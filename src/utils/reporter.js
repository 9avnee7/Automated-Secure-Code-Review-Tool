const chalk = require('chalk');
const fs = require('fs');
const path = require('path');


function reportResults(results, format = 'text') {
  if (format === 'json') {
    const jsonOutput = JSON.stringify(results, null, 2);
    // Save to file in current working directory
    fs.writeFileSync(path.resolve(process.cwd(), 'security-report.json'), jsonOutput, 'utf-8');
    console.log('Security scan results saved to security-report.json');
    return;
  }

  let totalIssues = 0;

  results.forEach(result => {
    const { type, issues } = result;

    if (!issues || issues.length === 0) {
      console.log(chalk.green(`  No ${type} found`));
    } else {
      totalIssues += issues.length;

      console.log(chalk.yellow.bold(`\n  ${type}:`));
      issues.forEach(issue => {
        // Show line number if present, else skip
        const location = issue.line ? `${issue.file}:${issue.line}` : issue.file;

        // Show issue description or fallback to match/function
        const description = issue.issue || issue.match || issue.function || 'Issue found';

        console.log(chalk.red(`  - ${location} - ${description}`));
      });
    }
  });

  if (totalIssues > 0) {
    console.log(chalk.redBright(`\nScan completed with ${totalIssues} issues found.`));
  } else {
    console.log(chalk.greenBright('\n Scan completed with no issues!'));
  }
}

module.exports = { reportResults };
