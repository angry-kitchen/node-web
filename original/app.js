const { app }  = require('./code')
var debug = require('debug')('app')

const PORT = 4337
const HOST = '127.0.0.1'

let users = {
}

// curl -v -H "Content-Type:application/json" -X POST --data '{ "name": "a" }' http://127.0.0.1:4337/user/jigang
const addUser = function (req, res) {
    debug('addUser %s', req.body)
    const username = req.params
    users[username] = req.body
    res.json(req.body)
}

// curl -v http://127.0.0.1:4337/user/jigang
const getUser = function (req, res) {
    debug('getUser %o', req)
    const username = req.params
    const user = users[username]
    res.json(user)
}

app.post('/user/:username', addUser);
app.get('/user/:username', getUser);
app.listen(PORT, HOST);

console.log(`服务运行： http://${HOST}:${PORT}/`)
