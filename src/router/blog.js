const { getList, getDetail, createBlog, updateBlog, deleteBlog } = require('../controller/blog');
const { SuccessModel, ErrorModel } = require('../model/resModel');

/**
 * 登录验证
 * @param {*} req 
 */
const loginCheck = (req) => {
    if (!req.session.username) {
        return Promise.resolve(new ErrorModel('尚未登录！'))
    }
}

const handleBlogRouter = (req, res) => {
    const { method } = req;
    const { id = '' } = req.query;

    // 获取博客列表
    if (method === 'GET' && req.path === '/api/blog/list') {
        const loginCheckResult = loginCheck(req);
        if (loginCheckResult) {
            return loginCheck;
        }

        const { author = '', keyword = '' } = req.query
        const result = getList(author, keyword);
        return result.then(listData => {
            return new SuccessModel(listData, '获取博客列表接口成功');
        })
    }

    // 获取博客详情
    if (method === 'GET' && req.path === '/api/blog/detail') {
        const loginCheckResult = loginCheck(req);
        if (loginCheckResult) {
            return loginCheck;
        }
        
        const result = getDetail(id);
        return result.then(data => {
            return new SuccessModel(data);
        })
    }

    // 新建博客
    if (method === 'POST' && req.path === '/api/blog/new') {
        const loginCheckResult = loginCheck(req);
        if (loginCheckResult) {
            return loginCheck;
        }
        
        req.body.author = req.session.username;
        const result = createBlog(req.body);
        return result.then((data) => {
            return new SuccessModel(data);
        });
    }

    // 更新博客
    if (method === 'POST' && req.path === '/api/blog/update') {
        const loginCheckResult = loginCheck(req);
        if (loginCheckResult) {
            return loginCheck;
        }
        
        const result = updateBlog(id, req.body);
        return result.then(updateRes => {
            if (updateRes) {
                return new SuccessModel(updateRes, '更新博客接口');
            }
            return new ErrorModel('更新博客失败');
        }) 
    }

    // 删除博客
    if (method === 'POST' && req.path === '/api/blog/delete') {
        const loginCheckResult = loginCheck(req);
        if (loginCheckResult) {
            return loginCheck;
        }
        
        const author = req.session.username;
        const result = deleteBlog(id, req.body);
        return result.then((val) => {
            if (val) {
                return new SuccessModel(deleteRes, '删除博客成功');
            }
            return new ErrorModel('删除博客失败');
        })
    }
}

module.exports = handleBlogRouter;