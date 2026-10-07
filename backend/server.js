const http = require("node:http");
const authRoutes = require("./routes/authRoutes");
const applyCors = require("./middleware/cors");
const sendJson = require("./middleware/sendJson");

const port = Number(process.env.PORT ?? 4000);
const frontendOrigin = process.env.FRONTEND_ORIGIN ?? "http://localhost:3000";

if (!Number.isInteger(port) || port < 1 || port > 65_535) {
  throw new Error("PORT must be an integer between 1 and 65535.");
}

const server = http.createServer(async (request, response) => {
  if (applyCors(request, response, frontendOrigin)) {
    return;
  }

  const requestUrl = new URL(
    request.url ?? "/",
    `http://${request.headers.host ?? "localhost"}`,
  );

  if (request.method === "GET" && requestUrl.pathname === "/api/health") {
    sendJson(response, 200, { status: "ok" });
    return;
  }

  if (await authRoutes(request, response, requestUrl.pathname)) {
    return;
  }

  sendJson(response, 404, { message: "Route not found." });
});

server.listen(port, () => {
  console.log(`InfluEnhance API listening on port ${port}`);
});

server.on("error", (error) => {
  console.error("Failed to start the InfluEnhance API:", error);
  process.exitCode = 1;
});
