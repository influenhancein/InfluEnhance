const readJsonBody = require("../middleware/readJsonBody");
const sendJson = require("../middleware/sendJson");
const { ObjectId } = require("mongodb");
const { createHmac, randomBytes, scrypt, timingSafeEqual } = require("node:crypto");
const { promisify } = require("node:util");
const { getUsersCollection } = require("../config/database");

const scryptAsync = promisify(scrypt);
const sessionCookieName = "influEnhanceSession";
const sessionDurationSeconds = 60 * 60 * 24 * 7;
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;

function sessionToken(userId, expiresAt) {
  const payload = `${userId}.${expiresAt}`;
  const signature = createHmac("sha256", process.env.SESSION_SECRET)
    .update(payload)
    .digest("hex");
  return `${payload}.${signature}`;
}

function getSessionUserId(request) {
  const cookieHeader = request.headers.cookie ?? "";
  const cookie = cookieHeader
    .split(";")
    .map((part) => part.trim())
    .find((part) => part.startsWith(`${sessionCookieName}=`));

  if (!cookie) {
    return null;
  }

  const token = cookie.slice(sessionCookieName.length + 1);
  const [userId, expiresAtText, signature, ...extraParts] = token.split(".");
  const expiresAt = Number(expiresAtText);
  if (
    extraParts.length > 0 ||
    !ObjectId.isValid(userId) ||
    !Number.isSafeInteger(expiresAt) ||
    expiresAt <= Date.now() ||
    !signature
  ) {
    return null;
  }

  const expected = Buffer.from(
    sessionToken(userId, expiresAt).split(".").at(-1),
    "hex",
  );
  const actual = Buffer.from(signature, "hex");
  return actual.length === expected.length && timingSafeEqual(actual, expected)
    ? userId
    : null;
}

function setSessionCookie(response, userId) {
  const expiresAt = Date.now() + sessionDurationSeconds * 1000;
  const isProduction = process.env.NODE_ENV === "production";
  const sameSite = isProduction ? "None" : "Lax";
  const secure = isProduction ? "; Secure" : "";
  response.setHeader(
    "Set-Cookie",
    `${sessionCookieName}=${sessionToken(userId, expiresAt)}; HttpOnly; Path=/; SameSite=${sameSite}; Max-Age=${sessionDurationSeconds}${secure}`,
  );
}

function clearSessionCookie(response) {
  const isProduction = process.env.NODE_ENV === "production";
  const sameSite = isProduction ? "None" : "Lax";
  const secure = isProduction ? "; Secure" : "";
  response.setHeader(
    "Set-Cookie",
    `${sessionCookieName}=; HttpOnly; Path=/; SameSite=${sameSite}; Max-Age=0${secure}`,
  );
}

async function hashPassword(password, salt = randomBytes(16).toString("hex")) {
  const derivedKey = await scryptAsync(password, salt, 64);
  return `${salt}:${derivedKey.toString("hex")}`;
}

async function verifyPassword(password, storedHash) {
  const [salt, keyHex] = storedHash.split(":");
  if (!salt || !keyHex) {
    return false;
  }

  const expected = Buffer.from(keyHex, "hex");
  const actual = await scryptAsync(password, salt, expected.length);
  return actual.length === expected.length && timingSafeEqual(actual, expected);
}

function validCredentials(credentials, requireStrongPassword) {
  return (
    typeof credentials === "object" &&
    credentials !== null &&
    typeof credentials.email === "string" &&
    emailPattern.test(credentials.email) &&
    typeof credentials.password === "string" &&
    (requireStrongPassword
      ? passwordPattern.test(credentials.password)
      : credentials.password.length > 0)
  );
}

module.exports = async function authRoutes(request, response, pathname) {
  if (
    (request.method !== "POST" ||
      !["/api/signup", "/api/login", "/api/logout"].includes(pathname)) &&
    !(request.method === "GET" && pathname === "/api/session")
  ) {
    return false;
  }

  try {
    if (request.method === "GET") {
      const userId = getSessionUserId(request);
      const user = userId
        ? await getUsersCollection().findOne(
            { _id: new ObjectId(userId) },
            { projection: { email: 1 } },
          )
        : null;
      sendJson(response, 200, {
        authenticated: Boolean(user),
        ...(user ? { email: user.email } : {}),
      });
      return true;
    }

    if (pathname === "/api/logout") {
      clearSessionCookie(response);
      sendJson(response, 200, { message: "Logged out." });
      return true;
    }

    const credentials = await readJsonBody(request);
    const isSignup = pathname === "/api/signup";
    if (!validCredentials(credentials, isSignup)) {
      sendJson(response, 400, {
        message: isSignup
          ? "Enter a valid email and a password with at least 8 characters, including uppercase, lowercase, number, and special character."
          : "Enter a valid email and password.",
      });
      return true;
    }

    const email = credentials.email.trim().toLowerCase();
    const users = getUsersCollection();
    let user;

    if (isSignup) {
      const passwordHash = await hashPassword(credentials.password);
      try {
        const result = await users.insertOne({ email, passwordHash, createdAt: new Date() });
        user = { _id: result.insertedId, email };
      } catch (error) {
        if (error && error.code === 11000) {
          sendJson(response, 409, { message: "An account with this email already exists." });
          return true;
        }
        throw error;
      }
    } else {
      user = await users.findOne({ email });
      if (!user || !(await verifyPassword(credentials.password, user.passwordHash))) {
        sendJson(response, 401, { message: "Invalid email or password." });
        return true;
      }
    }

    setSessionCookie(response, user._id.toString());
    sendJson(response, 200, { message: isSignup ? "Account created." : "Logged in." });
  } catch (error) {
    if (
      error instanceof Error &&
      ["Request body must be valid JSON.", "Request body is too large."].includes(error.message)
    ) {
      sendJson(response, 400, {
        message: error.message,
      });
      return true;
    }
    console.error("Authentication request failed:", error);
    sendJson(response, 500, { message: "The authentication service is unavailable." });
  }

  return true;
};
