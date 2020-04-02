const redis = require('redis');
const { REDIS_CONFIG } = require('../config/db');

// 创建客户端
const redisClient = redis.createClient(REDIS_CONFIG.port, REDIS_CONFIG.host);
// 异常处理
redisClient.on('error', err => {
    console.log(err)
})

function set(key, val) {
    if (typeof val === 'object') {
        val = JSON.stringify(val);
    }
    redisClient.set(key, val, redis.print);
}

function get(key) {
    return new Promise((resolve, reject) => {
        console.log(key, 'key')
        redisClient.get(key, (err, val) => {
            if (err) {
                reject(err);
                return;
            }
            if (val === null) {
                resolve(null);
                return;
            }

            // 兼容JSON
            try {
                resolve(JSON.parse(val));
            } catch(e) {
                resolve(val);
            }
        })
    })
}

module.exports = {
    get,
    set
}