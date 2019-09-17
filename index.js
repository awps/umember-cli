#!/usr/bin/env node
'use strict'

const fs = require('fs')
const path = require('path')
const args = require('yargs').argv
const chalk = require('chalk')
const config = require('./package.json')
const newBlock = require(`./bin/commands/block-new.js`)
const removeBlock = require(`./bin/commands/block-remove.js`)
const log = console.log;
const child_process = require("child_process")

const toolkitDirectory = path.dirname(__filename)

function dockerComposeExists() {
    return fs.existsSync('./docker-compose.yml');
}

function dockerComposeError() {
    return log(chalk.red.bold('Could not find "docker-compose.yml". Make sure you are in the right directory.'))
}

function dockerComposeDisallow() {
    return log(chalk.red.bold('This directory contains "docker-compose.yml". You are not allowed to create a project here. If you are sure what you do, use --force option.'))
}

(async () => {
    // console.log(args)

    switch (args._[0]) {
        case 'new:block':
        case 'nb':
        case 'block:new':
            if (!dockerComposeExists()) {
                return dockerComposeError()
            }

            newBlock(args)
            break
        case 'remove:block':
        case 'rb':
        case 'block:remove':
            if (!dockerComposeExists()) {
                return dockerComposeError()
            }

            removeBlock(args)
            break

        case 'block':
            if (!dockerComposeExists()) {
                return dockerComposeError()
            }

            if (args.remove) {
                removeBlock(args)
            } else {
                newBlock(args)
            }
            break

        default:
            // TODO: Display commands help.
            return log(chalk.red.bold('Invalid command'))
    }
})()
