const mysql = require('mysql');
const { MYSQL_CONFIG } = require('../config/db');

// 创建链接对象
const conn = mysql.createConnection(MYSQL_CONFIG);

// 开始链接
conn.connect();

// 统一执行mysql的函数
function exec(sql) {
    return new Promise((resolve, reject) => {
        conn.query(sql, (err, result) => {
            if (err) {
                console.log(`[ERROR] ${JSON.stringify(err)}`);
                reject(err);
                return;
            }
            resolve(result);
        })
    })
}

module.exports = {
    exec
}

