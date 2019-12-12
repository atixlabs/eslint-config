#! /usr/bin/env node

const npm = require('npm-programmatic');
const inquirer = require('inquirer');
const ora = require('ora');
const begoo = require('begoo');
const fs = require('fs');

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

/**
 * Launches an Ora spinner that will be shown while the function passed as parameter
 * is executed. Once it's done it shows a succeed message, fail otherwise.
 *
 * @param  {String} message To be shown alongside the spinner
 * @param  {Function<Promise<any>>} fn Function to be executed
 */
const withSpinner = async (message, fn) => {
  const spinner = ora(message).start();

  try {
    await fn(text => (spinner.text = text));
    spinner.succeed(message);
  } catch (error) {
    spinner.fail(`${message} - ${error.toString()}`);
  }
};

/**
 * Invokes npm to install the deps received as parameter. It will show a spinner
 * while it executes the process.
 *
 * @param  {Array<String>} deps NPM compatible dependencies stated in any form
 * supported by `npm install`.
 * @see https://docs.npmjs.com/cli/install
 * @returns {Promise<any>} a promise that will resolve once the deps are installed.
 */
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

/**
 * Writes `.erlintrc` file depending on the specified platforms in order to target
 * configs stated in `configurations` folder.
 *
 * @param  {Array<String>} platforms platforms to be written in the `.eslintrc` file
 */
const writeEslintrc = platforms =>
  withSpinner(
    `Creating .eslintrc file for ${platforms.join(', ')}`,
    async () => {
      // Turn platforms into a single array containing all the required configs
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

/**
 * Gets the NPM dependencies for each platforms. It avoids duplicates
 *
 * @param  {Array<String>} platforms Platforms to be used to get deps from.
 * @returns {Array<String} dependencies without duplicates.
 */
const getDepsForSelectedPlatforms = platforms => {
  let deps = [];
  for (const platform of platforms.values()) {
    deps = deps.concat(platformsConfigs[platform].deps);
  }
  // Avoid duplicates creating a new set and expanding to an array
  deps = [...new Set(deps)];
  return deps;
};

/**
 * Main function configure the dependencies and `.eslintrc` file based on the
 * user input.
 */
const doRun = async () => {
  const { platforms, createEslintrc } = await askUserForConfigs();

  const deps = getDepsForSelectedPlatforms(platforms);
  await installDeps(deps);

  if (createEslintrc) {
    await writeEslintrc(platforms);
  }
};

/**
 * Message to be shown when everything has been executed successfully.
 */
const everythingSetUpMessage = () =>
  // eslint-disable-next-line no-console
  console.log(begoo('Everything Ready! Happy Coding!'));

doRun()
  .then(everythingSetUpMessage)
  // eslint-disable-next-line no-console
  .catch(console.error);
