const { mime } = require('../util')

exports.resJSON = function (req, res, next) {
    const resJSON = (response, json) => {
        response.setHeader('Content-Type', 'application/json'); 
        response.writeHead(200);
        response.end(JSON.stringify(json));
    }
    res.json = json => resJSON(res, json)
    next(); 
}
