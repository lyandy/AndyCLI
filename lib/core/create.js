const program = require("commander");
const {
    createProjectAction,
    addComponentAction,
    addPageAndRouteAction,
    addStoreAction
} = require('./action')

const createCommands = () => {
    program
        .command('create <project> [others...]')
        .description('clone a repository into a folder')
        .action(createProjectAction);

    program
        .command('addcpn <name>')
        .description('add vue component, 例如: andy addcpn HelloWorld [-d src/components]')
        .action((name) => {
            addComponentAction(name, program.dest || 'src/components');
        });

    program
        .command('addpage <page>')
        .description('add vue page and router condif, 例如: andy addpage Home [-d src/page]')
        .action((page) => {
            addPageAndRouteAction(page, program.dest || 'src/pages');
        });

    program
        .command('addstore <store>')
        .description('add vue store, 例如: addstore Home [-d src/store/modules]')
        .action((store) => {
            addStoreAction(store, program.dest || 'src/store/modules');
        });
};

module.exports = createCommands;