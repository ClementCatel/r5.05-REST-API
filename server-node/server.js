const http = require('http');

const host = 'localhost';
const port = 8000;

const server = http.createServer((req, res) => {
  console.log(req.method, req.url);
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  res.end('Bonjour depuis mon serveur Node.js !');
});

server.listen(port, host, () => {
  console.log(`Serveur démarré sur http://${host}:${port}`);
});
