const { ErrorModel } = require('../model/resModel');

module.exports = (req, res, next) => {
    if (req.session.username) {
        // 已经登录
        next();
        return;
    }
    res.json(
        new ErrorModel('登录失败')
    )
}