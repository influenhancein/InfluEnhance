const readJsonBody = require("../middleware/readJsonBody");
const sendJson = require("../middleware/sendJson");

module.exports = async function authRoutes(request, response, pathname) {
  if (request.method !== "POST" || pathname !== "/api/login") {
    return false;
  }

  try {
    const credentials = await readJsonBody(request);
    if (
      typeof credentials !== "object" ||
      credentials === null ||
      typeof credentials.email !== "string" ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(credentials.email) ||
      typeof credentials.password !== "string" ||
      credentials.password.length === 0
    ) {
      sendJson(response, 400, { message: "Enter a valid email and password." });
      return true;
    }

    sendJson(response, 501, {
      message: "The login route is connected, but account authentication has not been configured yet.",
    });
  } catch (error) {
    sendJson(response, 400, {
      message: error instanceof Error ? error.message : "Invalid request body.",
    });
  }

  return true;
};
