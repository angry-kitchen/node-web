const http = require('http')
const url = require('url')
const { pathRegexp } = require('./util')
const { resJSON, querystring } = require('./middleware')
const bodyParser = require('body-parser')

const routes = { all: [] };
const app = {};

app.use = function(path) {
    let handle;
    if (typeof path === 'string') {
        handle = {
            path: pathRegexp(path),
            stack: Array.prototype.slice.call(arguments, 1)
        };
    } else {
        handle = {
            path: pathRegexp(),
            stack: Array.prototype.slice.call(arguments, 0)
        }
    }
    routes.all.push(handle)
}

const methods = ['get', 'put', 'delete', 'post']
methods.forEach(method => {
    routes[method] = [];
    app[method] = (path, action) => {
        const handle = {
            path: pathRegexp(path),
            stack: action
        };
        routes[method].push(handle);
    };
});

const handle = (req, res, stack) => {
    const next = (err) => {
        if (err) {
            return handle500(err, req, res, stack)
        }
        const middleware = stack.shift();
        if (middleware) {
            // 传入next()函数自s身，使中间件能够执行结束后递归
            try {
                middleware(req, res, next)
            } catch (error) {
                next(error)
            }
        }
    }

    next();
}

app.use(resJSON);
app.use(bodyParser.json())
app.use(querystring);

const requestListener = (req, res) => {
    const match = (pathname, routes) => {
        let stacks = [];
        for (let i = 0; i < routes.length; i++) {
            const route = routes[i];
            const reg = route.path.regexp;
            const keys = route.path.keys;
            const matched = reg.exec(pathname);
            if (matched) {
                const params = {};
                for (let i = 0, l = keys.length; i < l; i++) {
                    const value = matched[i + 1];
                    if (value) {
                        params[keys[i]] = value; 
                    }
                }
                req.params = params;
                stacks = stacks.concat(route.stack)
            }
        }
        return stacks;
    }
    const pathname = url.parse(req.url).pathname;
    const method = req.method.toLowerCase();
    let stacks = match(pathname, routes.all);
    if (Object.hasOwnProperty.call(routes, method)) {
        stacks = stacks.concat(match(pathname, routes[method]));
    }

    if (stacks.length) {
        handle(req, res, stacks);
    } else {
        handle404(req. res);
    }
}

app.listen = (port, hostname) => {
    http.createServer(requestListener).listen(port, hostname);
}

exports.app = app
