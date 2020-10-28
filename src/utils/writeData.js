const fs = require('fs');
const path = require('path')

const writeDataSync = (pathFile, data) => {
  const dir = path.dirname(pathFile);
  fs.mkdirSync(dir, { recursive: true } );
  return fs.writeFileSync(pathFile, Buffer.from(data));
}

module.exports = {
  writeDataSync
}
