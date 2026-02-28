import http from "node:http";

const host = process.env.HOST ?? "127.0.0.1";
const port = Number(process.env.PORT ?? 5173);

const html = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Gen</title>
  </head>
  <body>
    <main>Gen: Browser Mage RPG</main>
  </body>
</html>`;

const server = http.createServer((_, res) => {
  res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
  res.end(html);
});

server.listen(port, host, () => {
  console.log(`Dev server running at http://${host}:${port}`);
});
