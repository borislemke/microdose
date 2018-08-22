const restify = require('restify')

const server = restify.createServer()

server.get('/', (req, res) => res.send('Hello World'))

server.listen(3000)
