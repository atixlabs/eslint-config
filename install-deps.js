#! /usr/bin/env node

const npm = require('npm-programmatic');
const inquirer = require('inquirer');
const ora = require('ora');
const begoo = require('begoo');

const commonDeps = require('./dependencies/common-deps');
const reactDeps = require('./dependencies/reactjs-deps');

const NODEJS = 'NodeJS';
const REACT = 'React';
const SOLIDITY = 'Solidity';

const PLATFORMS = [NODEJS, REACT, SOLIDITY];

const getInstallType = () => {
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

const installDeps = async (deps, notify) => {
  for (let dep of deps) {
    notify(`Installing ${dep}`);
    await npm.install(dep, {
      cwd: '.',
      saveDev: true,
      saveExact: true
    });
  }
};

const installCommonDeps = () =>
  withSpinner('Installing common deps', notify =>
    installDeps(commonDeps, notify)
  );

const installPlatformDeps = platform => {
  switch (platform) {
    case NODEJS:
      return;
    case REACT:
      return withSpinner('Installing React deps', notify =>
        installDeps(reactDeps, notify)
      );
    case SOLIDITY:
      return;
  }
};

const doRun = async () => {
  const { platforms } = await getInstallType();
  await installCommonDeps();

  for (let platform of platforms.values()) {
    await installPlatformDeps(platform);
  }
};

const everyingSetUp = () =>
  console.log(begoo('Everything Ready! Happy Coding!'));

doRun()
  .then(everyingSetUp)
  .catch(console.error);
