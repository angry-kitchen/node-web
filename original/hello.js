var http = require('http')

const PORT = 4337
const HOST = '127.0.0.1'

http.createServer(function (req, res) {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('Hello World\n');
}).listen(PORT, HOST);

console.log(`服务运行： http://${HOST}:${PORT}/`)
