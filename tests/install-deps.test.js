const chai = require('chai');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');

const installDeps = require('../install-deps');

chai.use(sinonChai);
const expect = chai.expect;

const getUserConfigs = (selectedPlatforms, createEslintrc = true) => () => ({
  platforms: selectedPlatforms,
  createEslintrc
});

describe('Install Deps', () => {
  const downloadDep = sinon.spy();
  const writeFile = sinon.spy();

  const PLATFORMS = ['platform1', 'platform2'];
  const platformConfigs = {
    platform1: {
      deps: ['dep1', 'dep2']
    },
    platform2: {
      deps: ['dep3', 'dep4', 'dep2']
    }
  };

  beforeEach(() => {
    downloadDep.resetHistory();
    writeFile.resetHistory();
  });

  it('Should install only deps for the specified platform', async () => {
    const [platform] = PLATFORMS;
    const configs = platformConfigs[platform];

    await installDeps(
      platformConfigs,
      getUserConfigs([platform]),
      downloadDep,
      writeFile
    );

    expect(downloadDep).to.have.been.calledTwice;
    expect(downloadDep).to.have.been.calledWith(configs.deps[0]);
    expect(downloadDep).to.have.been.calledWith(configs.deps[1]);
    // FIXME: This should be checking what is being written
    expect(writeFile).to.have.been.calledOnce;
  });

  it('Should merge platform dependencies when installing', async () => {
    await installDeps(
      platformConfigs,
      getUserConfigs(PLATFORMS),
      downloadDep,
      writeFile
    );

    const numberOfDeps = 4;
    expect(downloadDep).to.have.callCount(numberOfDeps);
    expect(downloadDep).to.have.been.calledWith('dep1');
    expect(downloadDep).to.have.been.calledWith('dep2');
    expect(downloadDep).to.have.been.calledWith('dep3');
    expect(downloadDep).to.have.been.calledWith('dep4');
    // FIXME: This should be checking what is being written
    expect(writeFile).to.have.been.calledOnce;
  });

  it('Should not write eslintrc if user does not requires it so', async () => {
    await installDeps(
      platformConfigs,
      getUserConfigs(PLATFORMS, false),
      downloadDep,
      writeFile
    );

    expect(writeFile).to.have.callCount(0);
  });
});
