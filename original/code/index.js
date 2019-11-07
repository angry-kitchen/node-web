const http = require('http')
const url = require('url')
const { pathRegexp } = require('./util')

const routes = { all: [] };
const app = {};

app.use = function (path, action) {
    routes.all.push([pathRegexp(path), action])
}

const methods = ['get', 'put', 'delete', 'post']
methods.forEach(method => {
    routes[method] = [];
    app[method] = function (path, action) {
        routes[method].push([pathRegexp(path), action]);
    };
});

const matchPath = (req, res) => (pathname, routes) => {
    for (let i = 0; i < routes.length; i++) {
        const route = routes[i];
        const reg = route[0].regexp;
        const keys = route[0].keys;
        const matched = reg.exec(pathname);
        if (matched) {
            let params = {};
            for (let i = 0, l = keys.length; i < l; i++) {
                const value = matched[i + 1]; 
                if (value) {
                    params[keys[i]] = value;
                }
            }
            req.params = params;
            const action = route[1]; 
            action(req, res); 
            return true;
        }
    }
    return false;
}

const resJSON = function (res, json) {
    res.setHeader('Content-Type', 'application/json'); 
    res.writeHead(200);
    res.end(JSON.stringify(json));
}

const handle = function (req, res) {
    const pathname = url.parse(req.url).pathname;
    const method = req.method.toLowerCase();
    const match = matchPath(req, res)
    res.json = json => resJSON(res)
    const route = Object.hasOwnProperty.call(routes, method) ? routes[method] : routes.all
    if (Object.hasOwnProperty.call(routes, method)) {
        if (match(pathname, routes[method])) {
            return; 
        } else {
            if (match(pathname, routes.all)) {
                return; 
            }
        }
    } else {
        if (match(pathname, routes.all)) {
            return; 
        }
    }
    handle404(req. res);
}

app.listen = function (port, hostname) {
    http.createServer(handle).listen(port, hostname);
}

exports.app = app