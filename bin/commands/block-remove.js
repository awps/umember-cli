#! /usr/bin/env node

const fs = require('fs')
const path = require('path')
const Case = require('case')
const replaceInFile = require('replace-in-file')
const chalk = require('chalk')
const rimraf = require('rimraf')
const prompts = require('prompts')
const mkdirp = require('./helpers/mkdirp')

const log = console.log

module.exports = function (args) {
    (async () => {
        let label = args._[1]
        let customLabel

        if (!label) {
            customLabel = await prompts({
                type: 'text',
                name: 'value',
                message: 'Please specify the block name that you want to delete:',
            })
            if (!customLabel.value) {
                return log(chalk.red.bold('Invalid block name'))
            }

            label = customLabel.value
        }

        let camel = Case.camel(label) //helloWold
        let kebab = Case.kebab(label) //hello-world
        let snake = Case.snake(label) //hello_world
        let block_path = `./src/blocks/${kebab}`

        // Trying to remove a block that does not exist.
        if (!fs.existsSync(block_path)) {
            return log(chalk.red.bold('Error: Can not remove this block because it does not exist!'))
        }

        const confirmDelete = await prompts({
            type: 'confirm',
            name: 'value',
            message: 'Are you sure that you want to delete this block?',
            initial: false
        })

        // Abort deletion if is not confirmed.
        if (!confirmDelete.value) {
            return
        }

        // Remove block dir
        // ----------------------------------------------------------------------------
        rimraf.sync(block_path)

        // Remove scope
        // ----------------------------------------------------------------------------
        rimraf.sync(`./.idea/scopes/block_${snake}.xml`)

        // Delete the admin settings js file import
        // ----------------------------------------------------------------------------
        replaceInFile.sync({
            files: './src/js/blocks/index.js',
            from: `import * as ${camel} from 'src/blocks/${kebab}/settings'
`, // important to be on new line
            to: '',
        })

        // Delete the admin block registration
        // ----------------------------------------------------------------------------
        replaceInFile.sync({
            files: './src/js/blocks/index.js',
            from: `${camel},
`,
            to: '',
        })

        return log(chalk.yellow(`"${block_path}" --> deleted`))
    })()
}
