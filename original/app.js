const { app }  = require('./code')

const PORT = 4337
const HOST = '127.0.0.1'

let users = new Map()

const addUser = function (req, res) {
    const username = req.params
    const user = users.get(username)
    res.json(user)
}

// curl -v http://127.0.0.1:4337/user/jigang
const getUser = function (req, res) {
    const username = req.params
    const user = users.get(username)
    res.json(user)
}

app.post('/user/:username', addUser);
app.get('/user/:username', getUser);
app.listen(PORT, HOST);

console.log(`服务运行： http://${HOST}:${PORT}/`)
