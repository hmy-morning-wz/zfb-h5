const fs = require('fs');
const path = require('path');
const mocks = {};

const requireMocks = (filePath) => {
  fs.readdirSync(filePath).forEach((file) => {
    const fullPath = path.join(filePath, file);
    if (fs.statSync(fullPath).isDirectory()) {
      file !== 'utils' && requireMocks(fullPath);
    } else {
      if (path.extname(fullPath) === '.js') {
        Object.assign(mocks, require(fullPath));
      }
    }
  });
}

// 加载mock目录下面所有的js结尾的文件
requireMocks(path.join(__dirname, 'mock'));

module.exports = mocks;
