#! /usr/bin/env node

const npm = require('npm-programmatic');
const inquirer = require('inquirer');
const ora = require('ora');
const begoo = require('begoo');
const fs = require('fs');

const { PLATFORMS, platformsConfigs } = require('./platforms');

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

const withSpinner = async (message, fn) => {
  const spinner = ora(message).start();

  try {
    await fn(text => (spinner.text = text));
    spinner.succeed(message);
  } catch (error) {
    spinner.fail(`${message} - ${error.toString()}`);
  }
};

const installDeps = deps =>
  withSpinner('Installing deps', async notify => {
    for (const dep of deps) {
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
        (accumulator, platform) =>
          accumulator.concat(platformsConfigs[platform].eslintrc),
        []
      );

      const FORMAT_SPACES = 2;
      fs.writeFileSync(
        '.eslintrc',
        JSON.stringify({ extends: eslintrcExtends }, null, FORMAT_SPACES)
      );
    }
  );

const doRun = async () => {
  const { platforms, createEslintrc } = await askUserForConfigs();

  let deps = [];
  for (const platform of platforms.values()) {
    deps = deps.concat(getPlatformDeps(platform));
  }
  deps = [...new Set(deps)]; // avoid duplicates
  await installDeps(deps);

  if (createEslintrc) {
    await writeEslintrc(platforms);
  }
};

const everythingSetUpMessage = () =>
  // eslint-disable-next-line no-console
  console.log(begoo('Everything Ready! Happy Coding!'));

doRun()
  .then(everythingSetUpMessage)
  // eslint-disable-next-line no-console
  .catch(console.error);
