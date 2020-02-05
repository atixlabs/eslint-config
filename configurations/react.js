module.exports = {
  extends: [
    'formidable/configurations/es6-react',
    'formidable/configurations/es6-test',
    './common.js'
  ],
  plugins: ['react-hooks'],
  rules: {
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'warn'
  }
};
