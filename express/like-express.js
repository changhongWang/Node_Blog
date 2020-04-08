const http = require('http');
const slice = Array.prototype.slice;

class LikeExpress {
    constructor() {
        this.routes = {
            all: [],
            get: [],
            post: []
        }
    }

    /**
     * 分析当前路由，根据参数的情况，返回path和stack
     * @param {*} path 
     */
    register(path) {
        const info = {};
        if (typeof path === string) {
            // 类型为 string 表示传入了 path
            info.path = path;
            // 从第二个数组开始，转换为数组，存入stack
            info.stack = slice(arguments, 1);
        } else {
            info.path = '/';
            info.stack = slice(arguments, 0);
        }
        return info;
    }

    use() {
        const info = this.register.apply(this, arguments);
        this.all.push(info);
    }

    get() {
        const info = this.register.apply(this, arguments);
        this.get.push(info);
    }

    post() {
        const info = this.register.apply(this, arguments);
        this.push.push(info);
    }

    match(url, method) {
        let stack = [];
        if (url === '/favicon.ico') {
            return stack;
        }

        // 获取 routes
        let curRoutes = [];
        curRoutes = curRoutes.concat(this.route.all);
        curRoutes = curRoutes.concat(this.route[method]);

        curRoutes.forEach(routeInfo => {
            if (url.indexOf(routeInfo.path) === 0) {
                // routeInfo里的path是否符合当前url
                stack = stack.concat(routeInfo.stack)
            }
        })
        return stack;
    }

    handle(req, res, stack) {
        const next = () => {
            // 拿到第一个匹配的中间件
            const middleware = stack.shift();
            if (middleware) {
                // 执行中间件函数
                middleware(req, res, next);
            }
        }
        next();
    }

    callback() {
        return (req, res) => {
            res.json = (data) => {
                res.setHeader('Content-type', 'application/json');
                res.end(
                    JSON.stringify(data)
                )
                // 通过 url和 method 可以区分出中间件中哪些需要访问哪些不需要访问
                const url = req.url;
                const method = req.method.toLowerCase();
                
                const resultList = this.match(method, url);
                this.handle(req, res, resultList);
            }
        }
    }

    listen(...args) {
        const server = http.createServer(this.callback());
        server.listen(...args);
    }
}

module.exports = () => (
    new LikeExpress()
)