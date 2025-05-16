const fs = require('fs');
const path = require('path');

const SECRET_PATTERNS = {
  API_KEY: /(api|access|secret)[_-]?key\s*[:=]\s*["']?[a-z0-9]{20,}["']?/gi,
  PASSWORD: /(password|passwd|pwd)\s*[:=]\s*["']?[^ \n\r'"]+/gi,
  AWS_KEYS: /AKIA[0-9A-Z]{16}/gi,
};

function scanForSecrets(filePath) {

  const results = [];
  const content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.split('\n');

  lines.forEach((line, index) => {
    for (const [type, regex] of Object.entries(SECRET_PATTERNS)) {
      const matches = line.match(regex);
      if (matches) {
        matches.forEach((match) => {
          results.push({
            file: filePath,
            line: index + 1,
            type,
            match,
          });
        });
      }
    }
  });

  return results;
}




module.exports = { scanForSecrets };