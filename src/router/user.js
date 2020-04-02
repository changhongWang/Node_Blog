const { userLogin } = require('../controller/user');
const { SuccessModel, ErrorModel } = require('../model/resModel');
const { set } = require('../db/redis');

const handleUserRouter = (req, res) => {
    const { method } = req;

    // 登录接口
    if (method === 'POST' && req.path === '/api/user/login') {
        const { username, password } = req.body;
        const loginResult = userLogin(username, password)
        return loginResult.then((data) => {
            const { username, realname } = data;
            if (username) {
                // 设置session
                req.session.username = username;
                req.session.realname = realname;
                // 同步到redis
                set(req.sessionId, req.session);
                
                return new SuccessModel(`${data.username} 登录成功`);
            }
            return new ErrorModel('登录失败');
        }).catch(e => {
            console.log(`[ERROR] 异常 ${e}`);
            return new ErrorModel('登录失败');
        })
    }

    // 登录验证test接口
    if (method === 'GET' && req.path === '/api/user/login-test') {
        console.log(req.session, 'sess')
        if (req.session.username) {
            return Promise.resolve(
                new SuccessModel({
                    username: req.session.username
                })
            )
        }
        return Promise.resolve(
            new ErrorModel('未登录')
        )
    }
}

module.exports = handleUserRouter;