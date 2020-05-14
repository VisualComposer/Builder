const Plugin = require('./controller/plugin')
const program = require('commander')

program.command('plugin')
  .description('Build VCWB Wordpress plugin zip archive')
  .option('-p, --path <s>', 'Path where to create zip file')
  .option('-c, --builderCommit <s>', 'Select commit SHA1 for VCWB')
  .option('-b, --bundleVersion <s>', 'Add version to bundle.')
  .option('--isDev', 'Is it a development version')
  .option('-h, --branch <s>', 'Choose brunch version to bundle.')
  .action((options) => {
    const plugin = new Plugin(options.path, options.bundleVersion, options.branch, options.isDev)
    plugin.build()
  })
program.parse(process.argv)
