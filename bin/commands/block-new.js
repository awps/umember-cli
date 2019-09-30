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

class Cmd {
    constructor(args, label) {
        this.args = args
        this.label = label
        this.tpl = require('./helpers/tpl.js')

        this.camel = Case.camel(label) //helloWold
        this.kebab = Case.kebab(label) //hello-world
        this.snake = Case.snake(label) //hello_world
        this.pascal = Case.pascal(label) //HelloWorld
        this.blocksPath = `./src/blocks/${this.kebab}`

        this.projectName = path.basename(process.cwd());

    }

    createTemplates(block_path) {
        mkdirp(`${block_path}/settings.js`)

        fs.writeFileSync(
            `${block_path}/settings.js`,
            this.tpl.settings.replace(/__DIRNAME__/gi, this.kebab)
                .replace(/__TITLE__/gi, this.label)
        )
        fs.writeFileSync(
            `${block_path}/public.js`,
            this.tpl.public.replace(/__DIRNAME__/gi, this.kebab)
        )
        fs.writeFileSync(
            `${block_path}/edit.js`,
            this.tpl.edit.replace(/__DIRNAME__/gi, this.kebab)
        )
        fs.writeFileSync(
            `${block_path}/view.blade.php`,
            this.tpl.blade.replace(/__DIRNAME__/gi, this.kebab)
        )
        fs.writeFileSync(
            `${block_path}/style.scss`,
            this.tpl.scss.replace(/__DIRNAME__/gi, this.kebab)
        )

        fs.writeFileSync(
            `${block_path}/config.php`,
            this.tpl.php.replace(/__NS_SUFFIX__/gi, this.pascal)
                .replace(/__DIRNAME__/gi, this.kebab)
        )


        // Add PHPStorm scope
        let scopeFile = `./.idea/scopes/block_${this.snake}.xml`;

        mkdirp(scopeFile)

        fs.writeFileSync(
            scopeFile,
            this.tpl.scope.replace(/__PROJECT_NAME__/gi, this.projectName)
                .replace(/__BLOCK_NAME__/gi, this.kebab),
        );

    }

    registerBlock() {
        replaceInFile.sync({
            files: './src/css/main/index.scss',
            from: /\/\/UMEMBER_BLOCKS_IMPORT/gi,
            to: `@import "../../blocks/${this.kebab}/style";
//UMEMBER_BLOCKS_IMPORT`,
        })

        // Register the block in for admin use
        // ----------------------------------------------------------------------------
        replaceInFile.sync({
            files: './src/js/blocks/index.js',
            from: /\/\/UMEMBER_BLOCKS_IMPORT/gi,
            to: `import * as ${this.camel} from '../../blocks/${this.kebab}/settings'
//UMEMBER_BLOCKS_IMPORT`,
        })
        replaceInFile.sync({
            files: './src/js/blocks/index.js',
            from: /\/\/UMEMBER_BLOCKS_REGISTER/gi,
            to: `${this.camel},
//UMEMBER_BLOCKS_REGISTER`,
        })
    }
}

module.exports = function (args) {
    (async () => {
            // Prompt to enter the block name in case it's missed.
            // ----------------------------------------------------------------------------
            let label = args._[1]
            let customLabel

            if (!label) {
                customLabel = await prompts({
                    type: 'text',
                    name: 'value',
                    message: 'Please specify the block name:',
                })
                if (!customLabel.value) {
                    return log(chalk.red.bold('Invalid block name'))
                }

                label = customLabel.value
            }

            // Prepare templates
            // ----------------------------------------------------------------------------
            let cmd = new Cmd(args, label)


            if (fs.existsSync(cmd.blocksPath)) {
                return log(chalk.red.bold('Error: This block already exists!'))
            }

            cmd.createTemplates(cmd.blocksPath)
            cmd.registerBlock()

            return log(chalk.yellow(`"${cmd.blocksPath}" --> created`))

        }
    )()
}
