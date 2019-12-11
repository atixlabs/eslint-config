#! /usr/bin/env node

const npm = require('npm-programmatic');
const inquirer = require('inquirer');
const ora = require('ora');
const begoo = require('begoo');

const jsCommonDeps = require('./dependencies/js-common-deps');
const reactDeps = require('./dependencies/reactjs-deps');

const NODEJS = 'NodeJS';
const REACT = 'React';

const PLATFORMS = [NODEJS, REACT];

const getPlatforms = () => {
  return inquirer.prompt([
    {
      type: 'checkbox',
      message: 'Please select the platforms you are going to work with:',
      name: 'platforms',
      choices: PLATFORMS,
      validate: function(answer) {
        if (answer.length < 1) {
          return 'You must choose at least one platform.';
        }
        return true;
      }
    }
  ]);
};

const withSpinner = async (msg, fn) => {
  const spinner = ora(msg).start();

  try {
    await fn(text => (spinner.text = text));
    spinner.succeed(msg);
  } catch (err) {
    spinner.fail(`${msg} - ${err.toString()}`);
  }
};

const installDeps = deps =>
  withSpinner('Installing deps', async notify => {
    for (let dep of deps) {
      notify(`Installing ${dep}`);
      await npm.install(dep, {
        cwd: '.',
        saveDev: true,
        saveExact: true
      });
    }
  });

const getPlatformDeps = platform => {
  switch (platform) {
    case NODEJS:
      return jsCommonDeps;
    case REACT:
      return jsCommonDeps.concat(reactDeps);
  }
};

const doRun = async () => {
  const { platforms } = await getPlatforms();

  let deps = [];
  for (let platform of platforms.values()) {
    deps = deps.concat(getPlatformDeps(platform));
  }
  deps = [...new Set(deps)]; // avoid duplicates
  await installDeps(deps);
};

const everythingSetUpMsg = () =>
  console.log(begoo('Everything Ready! Happy Coding!'));

doRun()
  .then(everythingSetUpMsg)
  .catch(console.error);
