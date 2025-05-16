const fs = require('fs');
const path = require('path');

function scanPermissions(rootPath) {
  const results = [];

  // Check for insecure HTTP URLs in package.json
  const packageJsonPath = path.join(rootPath, 'package.json');

  if (fs.existsSync(packageJsonPath)) {
    const content = fs.readFileSync(packageJsonPath, 'utf-8');
    if (content.includes('http:')) {
      results.push({
        file: 'package.json',
        issue: 'Insecure HTTP URL in dependencies',
      });
    }
  }

  // Check for world-writable file permissions
  function checkPerms(filePath) {
    const mode = fs.statSync(filePath).mode & 0o777;
    if ((mode & 0o002) !== 0) {
      results.push({
        file: filePath,
        issue: 'World-writable file found',
      });
    }
  }

  function traverseDir(dirPath) {
    const files = fs.readdirSync(dirPath);
    files.forEach((file) => {
      const fullPath = path.join(dirPath, file);
      if (['node_modules', '.git', 'dist'].includes(file)) return;

      if (fs.statSync(fullPath).isDirectory()) {
        traverseDir(fullPath);
      } else {
        checkPerms(fullPath);
      }
    });
  }

  traverseDir(rootPath);

  return results;
}

module.exports = { scanPermissions };
