const parser = require('@babel/parser');
const traverse = require('@babel/traverse').default;
const fs = require('fs');


const DANGEROUS_FUNCTIONS = [
  'eval',
  'child_process.exec',
  'child_process.execSync',
  'child_process.spawn',
  'child_process.spawnSync',
  'fs.chmod',
  'fs.chmodSync',
];

function scanForDangerousFunctions(filePath) {
  const results = [];
  const content = fs.readFileSync(filePath, 'utf-8');

  try {
    const ast = parser.parse(content, {
      sourceType: 'unambiguous',
      plugins: ['jsx'],
    });

    traverse(ast, {
      CallExpression(path) {
        const callee = path.get('callee').toString();
        DANGEROUS_FUNCTIONS.forEach((fn) => {
          if (callee.includes(fn)) {
            results.push({
              file: filePath,
              line: path.node.loc?.start.line || 0,
              function: callee,
            });
          }
        });
      },
    });
  } catch (err) {
  
    // Ignore parse errors from malformed JS files
    console.log(`Error parsing file ${filePath}: ${err.message}`);
  }

  return results;
}

module.exports = { scanForDangerousFunctions};
