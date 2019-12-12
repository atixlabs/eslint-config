module.exports = {
  plugins: ['prettier', 'sonarjs'],
  extends: ['plugin:sonarjs/recommended', 'plugin:unicorn/recommended'],
  rules: {
    'prettier/prettier': 'error',
    strict: 'off',
    curly: 'off',
    indent: 'off',
    quotes: ['error', 'single'],
    'max-statements': ['error', 30],
    'quote-props': 'off',
    'arrow-parens': 'off',
    'no-extra-parens': 'off',
    'max-len': ['warn', 120],
    'nonblock-statement-body-position': 'off',
    // Deprecated https://eslint.org/blog/2018/11/jsdoc-end-of-life
    'valid-jsdoc': 'off',
    'require-jsdoc': 'off',
    'operator-linebreak': 'off',
    'max-params': ['error', 5],
    'object-property-newline': 'off',
    'filenames/match-regex': 'off' // As this rule is already defined by unicorn/filename-case
  }
};
