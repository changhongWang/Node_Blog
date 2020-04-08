var express = require('express');
var router = express.Router();
const { getList, getDetail, createBlog, updateBlog, deleteBlog } = require('../controller/blog');
const { SuccessModel, ErrorModel } = require('../model/resModel');
const loginCheck = require('../middleware/loginCheck');

/**
 * 查询列表接口
 */
router.get('/list', function(req, res, next) {
    const { keyword = '', isadmin = '' } = req.query
    let { author = '' } = req.query

    if (isadmin) {
        // 管理员界面
        if (!req.session.username) {
            res.json(
                new ErrorModel('未登录')
            )
            return
        }
        author = req.session.username;
    }

    const result = getList(author, keyword);
    return result.then(listData => {
        res.json(
            new SuccessModel(listData, '获取博客列表接口成功')
        )
    })
});

/**
 * 查询详情接口
 */
router.get('/detail', function(req, res, next) {
    const { id = '' } = req.query;
    const result = getDetail(id);
    return result.then(data => {
        res.json(
            new SuccessModel(data, '获取博客详情接口成功')
        )
    })
});

/**
 * 新增接口
 */
router.post('/new', loginCheck, function(req, res, next) {
    req.body.author = req.session.username;
    const result = createBlog(req.body);
    return result.then((data) => {
        res.json(
            new SuccessModel(data)
        )
        return;
    });
});

/**
 * 修改接口
 */
router.post('/update', loginCheck, function(req, res, next) {
    const { id = '' } = req.query;
    const result = updateBlog(id, req.body);
    return result.then(updateRes => {
        if (updateRes) {
            res.json(
                new SuccessModel(updateRes, '更新博客接口')
            )
            return
        }
        res.json(
            new ErrorModel('更新博客失败')
        )
        return;
    })
});

/**
 * 删除接口
 */
router.post('/del', loginCheck, function(req, res, next) {
    const author = req.session.username;
    const { id = '' } = req.query;
    const result = deleteBlog(id, req.body);
    return result.then((val) => {
        if (val) {
            res.json(
                new SuccessModel(deleteRes, '删除博客成功')
            )
            return
        }
        res.json(
            new ErrorModel('删除博客失败')
        )
        return
    })
});

module.exports = router;
