const { program } = require('commander');
const { scanDirectory } = require('../scanners/scannerRunner');
const { reportResults } = require('../utils/reporter');

function runCLI() {
  program
    .name('secure-code-reviewer')
    .description('Automated security scanner for Node.js projects')
    .version('1.0.0');

  program
    .command('scan <directory>')
    .description('Scan a directory for security issues')
    .option('-o, --output <format>', 'Output format (text, json)', 'text')
    .option('-v, --verbose', 'Verbose output')
    .action(async (dir, options) => {
      try {
        const results = await scanDirectory(dir, options.verbose);

        reportResults(results, options.output);

        const hasIssues = results.some(r => r.issues.length > 0);
        process.exit(hasIssues ? 1 : 0);
      } catch (err) {
        console.error(' Error:', err.message);
        process.exit(2);
      }
    });

  program.parse();
}

module.exports = { runCLI };
