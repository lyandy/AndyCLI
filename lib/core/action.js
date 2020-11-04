const { promisify } = require('util');
const path = require('path');
const download = promisify(require('download-git-repo'));
const open = require('open');
const { Command } = require('commander');

const { vueRepo } = require('../config/repo-config');
const { commandSpawn } = require('../utils/terminal');
const {compile, createDirSync, writeToFile } = require('../utils/utils')

const createProjectAction = async (project) => {
    console.log('we are creating your project...'); 

    await download(vueRepo, project, {clone: true});

    const command = process.platform === 'win32' ? 'npm.cmd' : 'npm';
    await commandSpawn(command, ['install'], {cwd: `./${project}`});
    
    commandSpawn(command, ['run', 'serve'], {cwd: `./${project}`});

    open('http://localhost:8080');
}

const addComponentAction = async (name, dest) => {
    const result = await compile('vue-component.ejs', { name, lowerName: name.toLowerCase()});

    const targetDest = path.resolve(dest, name.toLowerCase());
    console.log(targetDest);
    if (createDirSync(targetDest)) {
        const targetPath = path.resolve(targetDest, `${name}.vue`);
        console.log(targetPath);
        writeToFile(targetPath, result);
    }
}

const addPageAndRouteAction = async (name, dest) => {
    const data = {name, lowerName: name.toLowerCase()};
    const pageResult = await compile('vue-component.ejs', data);
    const routeResult = await compile('vue-router.ejs', data);

    const targetDest = path.resolve(dest, name.toLowerCase());
    if (createDirSync(targetDest)) {
        const targetPagePath = path.resolve(targetDest, `${name}.vue`);
        const targetRoutePath = path.resolve(targetDest, 'router.js');

        writeToFile(targetPagePath, pageResult);
        writeToFile(targetRoutePath, routeResult);
    }
}

const addStoreAction = async (name, dest) => {
    const storeResult = await compile('vue-store.ejs', {});
    const typesResult = await compile('vue-types.ejs', {});

    const targetDest = path.resolve(dest, name.toLowerCase());
    if (createDirSync(targetDest)) {
        const targetStorePath = path.resolve(targetDest, `${name}.js`);
        const targetTypePath = path.resolve(targetDest, 'types.js');

        writeToFile(targetStorePath, storeResult);
        writeToFile(targetTypePath, typesResult);
    }
}

module.exports = {
    createProjectAction,
    addComponentAction,
    addPageAndRouteAction,
    addStoreAction
}