const http = require('http');

http.createServer((req, res) => {
    res.writeHead(200, {'Content-Type': 'plain/text; charset=utf-8'});
    res.end('Hello World');
}).listen(3000);
