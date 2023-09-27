module.exports = {
  '*.{md,html,css}': 'prettier --write',
  '*.{js,jsx}': ['eslint --fix', 'prettier --write']
}
