#! /usr/bin/env node

const npm = require('npm-programmatic');
const inquirer = require('inquirer');
const ora = require('ora');
const begoo = require('begoo');
const fs = require('fs');

const { PLATFORMS, platformsConfigs } = require('./platforms');

const askUserForConfigs = () => {
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
    },
    {
      type: 'confirm',
      message: 'Do you want me to create .eslintrc file for you?',
      name: 'createEslintrc',
      default: true
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

const getPlatformDeps = platform => platformsConfigs[platform].deps;

const writeEslintrc = platforms =>
  withSpinner(
    `Creating .eslintrc file for ${platforms.join(', ')}`,
    async () => {
      const eslintrcExtends = platforms.reduce(
        (acc, platform) => acc.concat(platformsConfigs[platform].eslintrc),
        []
      );

      fs.writeFileSync(
        '.eslintrc',
        JSON.stringify({ extends: eslintrcExtends }, null, 2)
      );
    }
  );

const doRun = async () => {
  const { platforms, createEslintrc } = await askUserForConfigs();

  let deps = [];
  for (let platform of platforms.values()) {
    deps = deps.concat(getPlatformDeps(platform));
  }
  deps = [...new Set(deps)]; // avoid duplicates
  await installDeps(deps);

  if (createEslintrc) {
    await writeEslintrc(platforms);
  }
};

const everythingSetUpMsg = () =>
  console.log(begoo('Everything Ready! Happy Coding!'));

doRun()
  .then(everythingSetUpMsg)
  .catch(console.error);
