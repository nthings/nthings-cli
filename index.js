/**
 * nthings-cli
 * Reusable module to build cool looking CLI tools.
 */

module.exports = (name) => {
    const module = {};

    module.init = ({
        tagLine = 'By NTHINGs<https://github.com/nthings>.',
        description = 'No description provided.',
        version = '0.0.1',
        bgColor = '#36BB09',
        color = '#000000',
        bold = true,
    }) => {
        const welcome = require('cli-welcome');
        const unhandled = require('cli-handle-unhandled');

        unhandled();
        welcome({
            title: name,
            tagLine,
            description,
            version,
            bgColor,
            color,
            bold,
            clear: false,
        });
    };

    module.cli = ({
        input = [],
        flags = {},
        commands = {},
        options = {
            inferType: true,
            description: true,
            hardRejection: false,
        },
    }) => {
        const meow = require('meow');
        const meowHelp = require('cli-meow-help');

        // Object that contains reasonable default flags
        const flags_built = {
            debug: {
                type: 'boolean',
                default: false,
                alias: 'd',
                desc: 'Print debug info to console',
            },
            logFile: {
                type: 'string',
                default: '',
                alias: 'l',
                desc: 'Path for the log file for the execution.',
            },
            ...flags,
        };
        // Object that contains reasonable default commands
        const commands_built = {
            help: {
                desc: 'Print help info',
            },
            ...commands,
        };

        return meow(
            meowHelp({
                name,
                flags: flags_built,
                commands: commands_built,
            }),
            {
                ...options,
                flags: flags_built,
                input,
            }
        );
    };

    module.log = (path_to_log = null) => {
        const alert = require('cli-alerts');
        const log_functions = {
            debug: (msg, title = '', debug = false) => {
                if (debug) {
                    alert({
                        type: 'warning',
                        name: `DEBUG LOG${title != '' ? ` - ${title}` : ''}`,
                        msg: JSON.stringify(msg),
                    });
                }
            },
            info: msg => {
                alert({
                    type: 'info',
                    name: '🤖:',
                    msg
                });
            },
            error: msg => {
                alert({
                    type: 'error',
                    name: '🤖 OH NO!:',
                    msg
                });
            },
            success: msg => {
                alert({
                    type: 'success',
                    name: '🤖:',
                    msg
                });
            },
        };

        // Functionality to log to console and file
        if (path_to_log) {
            const fs = require('fs');
            const util = require('util');
            const now = new Date().getTime();
            const log_location = `${path_to_log}_${now}.log`;
            const log_file = fs.createWriteStream(log_location, { flags: 'w' });
            const log_stdout = process.stdout;
            console.log = (log) => {
                if (log) {
                    const log_no_colors = log.replace(/[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]/g, '');
                    log_file.write(util.format(log_no_colors) + '\n');
                    log_stdout.write(util.format(log) + '\n');
                }
            };
            log_functions.info(`What you see in this console is being logged to this file as well: ${log_location}`);
        }

        return log_functions;
    }

    // Return module functions to the outside
    return module;
};