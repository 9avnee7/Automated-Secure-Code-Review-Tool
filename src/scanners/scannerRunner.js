// src/scanners/scannerRunner.js
const { getAllFiles } = require('../utils/fileUtils');
const { scanForSecrets } = require('./secretsScanner');
const { scanForDangerousFunctions } = require('./dangerousFunctionsScanner');
const { scanPermissions } = require('./permissionsScanner');

async function scanDirectory(dir, verbose = false) {
  const files = getAllFiles(dir);


  const results = [];

  for (const file of files) {

    if (verbose) console.log(`Scanning ${file}`);

    const issues = [
      ...scanForSecrets(file),
      ...scanForDangerousFunctions(file),
      ...scanPermissions('./')
    ];

    if (issues.length > 0) {
      results.push({ file, issues });
    }
  }

  return results;
}

module.exports = { scanDirectory };
