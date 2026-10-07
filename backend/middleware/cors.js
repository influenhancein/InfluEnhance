module.exports = function applyCors(request, response, allowedOrigin) {
  response.setHeader("Access-Control-Allow-Origin", allowedOrigin);
  response.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  response.setHeader("Access-Control-Allow-Headers", "Content-Type");
  response.setHeader("Vary", "Origin");

  if (request.method !== "OPTIONS") {
    return false;
  }

  response.writeHead(204);
  response.end();
  return true;
};
