require('dotenv').config();

module.exports = {
  default: {
    formatOptions: {
      snippetInterface: 'async-await',
    },
    paths: ['tests/**/*.feature'],
    require: [
      'src/hooks/hooks.ts',
      'src/test/support/world.ts',
      'src/test/steps/**/*.steps.ts',
    ],
    dryRun: false,
    requireModule: ['ts-node/register'],
    format: [
      'progress-bar',
      'html:test-results/cucumber-report.html',
      'json:test-results/cucumber-report.json',
    ],
    publish: false,
    parallel: 1,
  },
};