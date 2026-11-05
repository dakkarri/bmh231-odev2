const http = require("http");
const fs = require("fs");
const path = require("path");

const PORT = 3000;
const PUBLIC_DIR = path.resolve(__dirname, "public");
const DATA_FILE = path.resolve(__dirname, "etkinlikler.json");

const contentTypes = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".ico": "image/x-icon"
};

function sendText(response, statusCode, message, extraHeaders = {}) {
  response.writeHead(statusCode, {
    "Content-Type": "text/plain; charset=utf-8",
    ...extraHeaders
  });
  response.end(message);
}

function sendJson(response, statusCode, data) {
  response.writeHead(statusCode, {
    "Content-Type": "application/json; charset=utf-8"
  });
  response.end(JSON.stringify(data));
}

function readEvents() {
  return JSON.parse(fs.readFileSync(DATA_FILE, "utf8"));
}

const server = http.createServer((request, response) => {
  console.log(`${request.method} ${request.url}`);

  if (request.method !== "GET") {
    sendText(response, 405, "Method Not Allowed", { Allow: "GET" });
    return;
  }

  let url;
  try {
    url = new URL(request.url, `http://${request.headers.host || "localhost"}`);
  } catch {
    sendText(response, 400, "Bad Request");
    return;
  }

  const pathname = url.pathname;

  if (pathname === "/api/etkinlikler") {
    try {
      let events = readEvents();
      const type = url.searchParams.get("tur");
      if (type) events = events.filter((event) => event.tur === type);
      sendJson(response, 200, events);
    } catch (error) {
      console.error("JSON okunamadı:", error);
      sendJson(response, 500, { hata: "Sunucu hatası" });
    }
    return;
  }

  const eventMatch = pathname.match(/^\/api\/etkinlikler\/(\d+)$/);
  if (eventMatch) {
    try {
      const event = readEvents().find((item) => item.id === Number(eventMatch[1]));
      if (!event) {
        sendJson(response, 404, { hata: "Etkinlik bulunamadı" });
        return;
      }
      sendJson(response, 200, event);
    } catch (error) {
      console.error("JSON okunamadı:", error);
      sendJson(response, 500, { hata: "Sunucu hatası" });
    }
    return;
  }

  if (pathname.startsWith("/api/")) {
    sendText(response, 404, "Not Found");
    return;
  }

  let requestedPath;
  try {
    requestedPath = decodeURIComponent(pathname);
  } catch {
    sendText(response, 400, "Bad Request");
    return;
  }

  if (requestedPath === "/") requestedPath = "/index.html";

  const filePath = path.resolve(PUBLIC_DIR, `.${requestedPath}`);
  const relativePath = path.relative(PUBLIC_DIR, filePath);

  // public klasörünün dışına çıkılmasını engelle.
  if (relativePath.startsWith("..") || path.isAbsolute(relativePath)) {
    sendText(response, 403, "Forbidden");
    return;
  }

  fs.stat(filePath, (statError, stats) => {
    if (statError || !stats.isFile()) {
      sendText(response, 404, "Not Found");
      return;
    }

    const contentType = contentTypes[path.extname(filePath).toLowerCase()] ||
      "application/octet-stream";

    response.writeHead(200, { "Content-Type": contentType });
    const stream = fs.createReadStream(filePath);
    stream.on("error", () => {
      if (!response.headersSent) sendText(response, 500, "Internal Server Error");
      else response.destroy();
    });
    stream.pipe(response);
  });
});

server.listen(PORT, () => {
  console.log(`Sunucu çalışıyor: http://localhost:${PORT}`);
});
