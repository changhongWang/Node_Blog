const { exec } = require('../db/mysql');
/**
 * 获取博客列表
 * @param {*} author 作者
 * @param {*} keyword 关键字
 */
const getList = (author, keyword) => {
    // 1=1 防止author跟keyword都没有值
    let sql = 'select * from blogs where 1=1 '
    if (author) {
        sql += `and author='${author}' `
    }
    if (keyword) {
        sql += `and title like "%${keyword}%" `
    }
    sql += 'order by createtime desc';
    return exec(sql);
}

/**
 * 获取博客详情
 * @param {} id 
 */
const getDetail = id => {
    const sql = `select * from blogs where id='${id}'`;
    return exec(sql).then((rows) => {
        return rows[0];
    });
}

/**
 * 创建博客
 */
const createBlog = (blogData = {}) => {
    const { title, author, content } = blogData;
    const createtime = Date.now();
    const sql = `insert into blogs (title, author, createtime, content) values (${title}, ${author}, ${createtime}, ${content})`;
    
    return exec(sql).then(insertData => {
        return {
            id: insertData.insertId
        }
    })
}

/**
 * 更新博客
 * @param {*} id 需要更新的blog的id
 * @param {*} blogData 更新相关数据
 */
const updateBlog = (id, blogData = {}) => {
    const { title, content } = blogData;
    const sql = `update blogs set title='${title}', content='${content}' where id='${id}'`;

    return exec(sql).then(updateData => {
        if (updateData.affectedRows > 0) {
            return true;
        }
        return false;
    })
}

/**
 * shanchu博客
 * @param {*} id 需要更新的blog的id
 * @param {*} blogData 更新相关数据
 */
const deleteBlog = (id, author) => {
    console.log(`[INFO] 删除blog数据, id为${id}, 数据为${JSON.stringify(blogData)}`);
    const sql = `delete from blogs wherer id='${id}' and author='${author}'`;
    return exec(sql).then(delData => {
        if (delData.affectedRows > 0) {
            return true
        }
        return false
    })
}

module.exports = {
    getList,
    getDetail,
    createBlog,
    updateBlog,
    deleteBlog
}