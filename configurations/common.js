const MXX_STATEMENTS = 30;
const MAX_LEN = 120;
const MAX_PARAMS = 5;

module.exports = {
  plugins: ['prettier', 'sonarjs'],
  extends: ['plugin:sonarjs/recommended', 'plugin:unicorn/recommended'],
  rules: {
    'prettier/prettier': 'error',
    strict: 'off',
    curly: 'off',
    indent: 'off',
    quotes: ['error', 'single'],
    'max-statements': ['error', MXX_STATEMENTS],
    'quote-props': 'off',
    'arrow-parens': 'off',
    'no-extra-parens': 'off',
    'max-len': ['warn', MAX_LEN],
    'nonblock-statement-body-position': 'off',
    // Deprecated https://eslint.org/blog/2018/11/jsdoc-end-of-life
    'valid-jsdoc': 'off',
    'require-jsdoc': 'off',
    'operator-linebreak': 'off',
    'max-params': ['error', MAX_PARAMS],
    'object-property-newline': 'off',
    'filenames/match-regex': 'off' // As this rule is already defined by unicorn/filename-case
  }
};
