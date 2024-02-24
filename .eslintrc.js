module.exports = {
  parser: '@typescript-eslint/parser',
  root: true,
  parserOptions: {
    project: './tsconfig.json'
  },
  "rules": {
    "@typescript-eslint/restrict-plus-operands": "error"
  },
  ignorePatterns: [
    'dist',
    'tsconfig.json',
    'tsconfig.eslint.json',
    '.eslintrc.js',
    'build.mjs',
    'seeds-cli.js',
    'packages/**/helpers.js'
  ],
  extends: [
    'standard-with-typescript'
  ],
  overrides: [
    {
      files: ['*.ts', '*.tsx'],
      extends: 'standard-with-typescript'
    }
  ],
}
