const fs = require('fs');

const audit = JSON.parse(fs.readFileSync('./reports/audit-report.json'));
const codeScan = JSON.parse(fs.readFileSync('./reports/eslint-security-report.json'));

const report = {
  dependenciesVulnerabilities: audit,
  codeVulnerabilities: codeScan,
  generatedAt: new Date()
};

fs.writeFileSync('./reports/final-report.json', JSON.stringify(report, null, 2));
console.log('✅ Relatório final gerado em reports/final-report.json');