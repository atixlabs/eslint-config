const jsCommonDeps = require('./dependencies/js-common-deps');
const reactDeps = require('./dependencies/reactjs-deps');

const NODEJS = 'NodeJS';
const REACT = 'React';

const PLATFORMS = [NODEJS, REACT];

const platformsConfigs = {};
platformsConfigs[NODEJS] = {
  deps: jsCommonDeps,
  eslintrc: '@atixlabs/eslint-config/configurations/node'
};
platformsConfigs[REACT] = {
  deps: jsCommonDeps.concat(reactDeps),
  eslintrc: '@atixlabs/eslint-config/configurations/react'
};

module.exports = {
  PLATFORMS, 
  platformsConfigs
}