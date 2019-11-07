const strict = true;

exports.pathRegexp = function (path) { 
    let keys = [];
    if (path === undefined) {
        return {
            keys,
            regexp: new RegExp('.*')
        }; 
    }
    path = path
        .concat(strict ? '' : '/?')
        .replace(/\/\(/g, '(?:/')
        .replace(/(\/)?(\.)?:(\w+)(?:(\(.*?\)))?(\?)?(\*)?/g, function(_, slash, format, key, capture, optional, star) {
            keys.push(key);
            slash = slash || '';
            return ''
                + (optional ? '' : slash)
                + '(?:'
                + (optional ? slash : '')
                + (format || '') + (capture || (format && '([^/.]+?)' || '([^/]+?)')) + ')'
                + (optional || '')
                + (star ? '(/*)?' : '');
        })
        .replace(/([\/.])/g, '\\$1')
        .replace(/\*/g, '(.*)');
    return {
        keys,
        regexp: new RegExp('^' + path + '$')
    }; 
}

exports.mime = function (req) {
    const str = req.headers['content-type'] || '';
    return str.split(';')[0];
};
