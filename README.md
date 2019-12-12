# AtixLabs Eslint Config 

This repository contains predefined (an opinionated) rules for AtixLabs eslint projects. Here you will be able to find presets for NodeJs and ReactJS (and obviously Javascript).

All the presets are based on other excellent projects with some minor tweaks to fit our needs. All our presets are defined using [Eslint Shareable Configs](https://eslint.org/docs/developer-guide/shareable-configs)

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on a live system.

### Prerequisites

In order to setup the eslint rules in your project, you need to install our rules presets: 

```
npm install -E @atixlabs/eslint-rules
```

Once you have installed the package, there is a helper script that will help installing the required dependencies based on the projec type you are trying to configure. To do so, invoke it using:

`npx atixlabs-eslint-config-install-deps` 

or

`./node_modules/.bin/atixlabs-eslint-config-install-deps` in case you don't have `npx` installed.

### Configuring 

Depending on the project you are running you will need to specify which rules you want to use. To do so, create an `.eslintrc` file with the following configs:

- NodeJS

```
{
  "extends": "@atixlabs/eslint-config/configurations/node"
}

```

- ReactJS

```
{
  "extends": "@atixlabs/eslint-config/configurations/react"
}

```

If your project contains multiple technologies, you can compose the configs, for example, if you have a NodeJs and React project, you can set:

```
{
  "extends": [
    "@atixlabs/eslint-config/configurations/react",
    "@atixlabs/eslint-config/configurations/node"
  ]
}

```

### Customization

- If you want to override any rule you an still do it by adding them in your project `.eslintrc` config file as you would normaly do.

## Deployment

Add additional notes about how to deploy this on a live system

## Built With

* [Eslint](https://eslint.org/) - Linter Used.
* [Prettier](https://prettier.io/) - For some presets related to our formatting rules.
* [Formidable Labs presets](https://github.com/FormidableLabs/eslint-config-formidable) - Used as a base for our config.
* [Eslint Plugin Unicorn](https://github.com/sindresorhus/eslint-plugin-unicorn) - With useful eslint rules.
* [SonarJS](https://github.com/SonarSource/eslint-plugin-sonarjs) - To detect bugs and suspicious patterns in the code.

## Contributing

Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct, and the process for submitting pull requests to us.

## Versioning

We use [SemVer](http://semver.org/) for versioning. For the versions available, see the [tags on this repository](https://github.com/your/project/tags). 

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details



