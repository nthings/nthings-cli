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
        clear = true, 
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
            clear,
        });
    };

    module.cli = ({
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
            clear: {
                type: 'boolean',
                default: true,
                alias: 'c',
                desc: 'Clear the console',
            },
            debug: {
                type: 'boolean',
                default: false,
                alias: 'd',
                desc: 'Print debug info to console',
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
            }
        );
    };

    const alert = require('cli-alerts');
    module.log = {
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

    // Return module functions to the outside
    return module;
};