const fs = require('fs')
const path = require('path')

/**
 * 写日志方法
 * @param {*} writeStream 
 * @param {*} log 
 */
function writeLog(writeStream, log) {
    writeStream.write(log + '\n');
}

//  生成 write Stream
const createWriteStream = (fileName) => {
    const fullFileName = path.join(__dirname, `../../logs/${fileName}`);
    const writeStream = fs.createWriteStream(fullFileName, {
        flags: 'a'
    });
    return writeStream;
}

const accessWriteStream = createWriteStream('access.log');

/**
 * 提供给外部使用，写访问日志
 * @param {*} log 日志内容
 */
function access(log) {
    writeLog(accessWriteStream, log)
}

module.exports = {
    access
}