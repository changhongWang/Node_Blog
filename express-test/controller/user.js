const { exec } = require('../db/mysql');

const userLogin = (username, password) =>  {
    // 假数据
    const sql = `select username, password from users where username='${username}' and password='${password}'`;
    return exec(sql).then(rows => {
        return rows[0] || {};
    })
}

module.exports = {
    userLogin
}