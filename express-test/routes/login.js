const express = require('express');
const router = express.Router();
const { userLogin } = require('../controller/user');;
const { SuccessModel, ErrorModel } = require('../model/resModel');

router.post('/login', function(req, res, next) {
    const { username, password } = req.body;
    const result = userLogin(username, password);
    return result.then(data => {
        const { username, realname } = data;
        if (username) {
            // 设置session
            req.session.username = username;
            req.session.realname = realname;

            res.json(
                new SuccessModel(`${data.username} 登录成功`)
            )
            return;
        }
        res.json(
            new ErrorModel('登录失败')
        )
        return
    }).catch((e) => {
        console.log(e)
        res.json(
            new ErrorModel('登录失败')
        )
        return
    })
})

module.exports = router;