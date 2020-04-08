const qs = require('querystring');
const { get, set } = require('./src/db/redis');
const { access } = require('./src/util/log');
const handleBlogRouter = require('./src/router/blog');
const handleUserRouter = require('./src/router/user');
const { getCookieExpires } = require('./src/common/util');

// session 数据
const SESSION_DATA = {};

/**
 * 用于处理postData
 * @param {}} req 
 */
const getPostData = (req) => {
    return new Promise((resolve, reject) => {
        if (req.method !== 'POST') {
            resolve({});
            return;
        }
        if (req.headers['content-type'] !== 'application/json') {
            // 有可能是 x-www-form-urlencoded / form-data
            resolve({});
            return;
        }
        let postData = '';
        req.on('data', chunk => {
            postData += chunk.toString()
        });
        req.on('end', () => {
            if (!postData) {
                resolve({});
                return;
            }
            resolve(
                JSON.parse(postData)
            )
        })
    })
}

const serverHandler = (req, res) => {
    // 记录日志
    access(`[INFO] ${req.method} -- ${req.url} -- ${req.headers['user-agent']} -- ${Date.now()}`);

    // 返回数据格式 JSON
    res.setHeader('Content-type', 'application/json')

    // 获取path
    const { url } = req;
    req.path = url.split('?')[0];

    // 解析query
    req.query = qs.parse(url.split('?')[1]);

    // 解析cookie
    req.cookie = {};
    const cookieStr = req.headers.cookie || '';
    cookieStr.split(';').forEach(item => {
        if (!item) {
            return;
        }
        const arr = item.split('=');
        const key = arr[0].trim();
        const value = arr[1].trim();
        req.cookie[key] = value;
    })
    
    // 解析 session (使用redis)
    let needSetCookie = false;
    let userId = req.cookie.userId;

    if (!userId) {
        needSetCookie = true;
        userId = `${Date.now()}_${Math.random()}`
        // 初始化redis中的session值
        set(userId, {});
    }

    // 获取session
    req.sessionId = userId;
    get(req.sessionId).then(sessionData => {
        if (sessionData === null) {
            // 初始化redis中的session值
            set(req.sessionId, {});
            // 设置session
            req.session = {};
        } else {
            // 设置session
            req.session = sessionData;
        }

        return getPostData(req, res);
    }).then(postData => {
        // 处理postData
        req.body = postData;

        // 处理blog路由
        const blogResult = handleBlogRouter(req, res);
        if (blogResult) {
            blogResult.then(blogData => {
                if (needSetCookie) {
                    res.setHeader('Set-Cookie', `userId=${userId}; path=/; httpOnly; expires=${getCookieExpires()}`);
                }
                res.end(
                    JSON.stringify(blogData)
                )
            })
            return;
        }

        // 处理user路由
        const userResult = handleUserRouter(req, res);
        if (userResult) {
            userResult.then(userData => {
                if (needSetCookie) {
                    res.setHeader('Set-Cookie', `userId=${userId}; path=/; httpOnly; expires=${getCookieExpires()}`);
                }
                res.end(
                    JSON.stringify(userData)
                )
            })
            return;
        }

        // 未命中，返回404
        res.writeHead(404, {'Content-type': 'text/plain'});
        res.write("404 Not Found\n");
        res.end();
    })
}

module.exports = serverHandler;
