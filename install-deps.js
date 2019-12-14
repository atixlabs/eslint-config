const ora = require('ora');
const begoo = require('begoo');

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
const installDeps = (deps, downloadDep) =>
  withSpinner('Installing deps', async notify => {
    for (const dep of deps) {
      notify(`Installing ${dep}`);
      await downloadDep(dep);
    }
  });

/**
 * Writes `.erlintrc` file depending on the specified platforms in order to target
 * configs stated in `configurations` folder.
 *
 * @param  {Array<String>} platforms platforms to be written in the `.eslintrc` file
 */
const writeEslintrc = (platformsConfigs, platforms, writeFile) =>
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
      writeFile(
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
const getDepsForSelectedPlatforms = (platformsConfigs, platforms) => {
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
const doRun = async (
  platformsConfigs,
  getUserConfigs,
  downloadDep,
  writeFile
) => {
  const { platforms, createEslintrc } = await getUserConfigs();

  const deps = getDepsForSelectedPlatforms(platformsConfigs, platforms);
  await installDeps(deps, downloadDep);

  if (createEslintrc) {
    await writeEslintrc(platformsConfigs, platforms, writeFile);
  }
};

/**
 * Message to be shown when everything has been executed successfully.
 */
const everythingSetUpMessage = () =>
  // eslint-disable-next-line no-console
  console.log(begoo('Everything Ready! Happy Coding!'));

/**
 * Platform configurations to be used during execution
 * @typedef {Object} PlatformsConfigs
 * @property {Array<String>} deps NPM compatible deps
 * @property {String} eslintrc String to be written in extends field for this platform
 */

/**
 * User input options
 * @typedef {Object} GetUserConfigs
 * @property {Array<String>} platforms Platforms to be installed
 * @property {boolean} createEslintrc Wether if this process should create `.eslintrc` file or not
 */

/**
 * Function that returns user choices
 * @callback GetUserConfigsFn
 * @returns {GetUserConfigs} user choices
 */

/**
 * Function that invokes NPM to download a specific dependency
 * @callback DownloadDepFn
 * @param {String} dependency Dependency to Download
 * @returns {Promise<Any>} Promise to be resolved then when the dependency is successfully downloaded
 */

/**
 * Synchronously writes data to a file, replacing the file if it already exists.
 * @callback WriteFileFn
 * @param {String} path A path to a file.
 * @param {Object} data The data to write.
 */

/**
 * @param  {PlatformsConfigs} platformsConfigs Platform
 * @param  {GetUserConfigsFn} getUserConfigs
 * @param  {DownloadDepFn} downloadDep
 * @param  {WriteFileFn} writeFile
 */
module.exports = (platformsConfigs, getUserConfigs, downloadDep, writeFile) =>
  doRun(platformsConfigs, getUserConfigs, downloadDep, writeFile)
    .then(everythingSetUpMessage)
    // eslint-disable-next-line no-console
    .catch(console.error);
