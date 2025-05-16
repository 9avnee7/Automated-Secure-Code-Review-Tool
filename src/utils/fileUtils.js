const fs = require('fs');
const path = require('path');

function getAllFiles(dirPath, arrayOfFiles = [], allowedExtensions = ['.js', '.json','.jsx'], excludedDirs = ['node_modules', '.git', 'dist','.gitignore','package-lock.json','package.json','secretsScanner.js']) {
  const files = fs.readdirSync(dirPath);


  files.forEach((file) => {
    const fullPath = path.join(dirPath, file);
    if (excludedDirs.some(dir => fullPath.includes(`/${dir}`))) return;

    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      getAllFiles(fullPath, arrayOfFiles, allowedExtensions, excludedDirs);
    } else if (allowedExtensions.includes(path.extname(fullPath))) {
      arrayOfFiles.push(fullPath);
    }
  });

  return arrayOfFiles;
}

module.exports = { getAllFiles };
