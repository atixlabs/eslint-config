const fs = require('fs');
const npm = require('npm-programmatic');
const inquirer = require('inquirer');

const installDeps = require('./install-deps');
const { PLATFORMS, platformsConfigs } = require('./platforms');

/**
 * This function uses Inquirer prompt to ask for:
 *  - Platform
 *  - If user want's to get `.eslintrc` file created
 *
 * @returns {Promise<Object>} Returns an object with two keys, platforms and createEslintrc
 */
const askUserForConfigs = () =>
  inquirer.prompt([
    {
      type: 'checkbox',
      message: 'Please select the platforms you are going to work with:',
      name: 'platforms',
      choices: PLATFORMS,
      validate(answer) {
        if (answer.length === 0) {
          return 'You must choose at least one platform.';
        }
        return true;
      }
    },
    {
      type: 'confirm',
      message: 'Do you want me to create .eslintrc file for you?',
      name: 'createEslintrc',
      default: true
    }
  ]);

const downloadDep = dep =>
  npm.install(dep, {
    cwd: '.',
    saveDev: true,
    saveExact: true
  });

installDeps(platformsConfigs, askUserForConfigs, downloadDep, fs.writeFileSync);
