const { when, isProvider } = require('feathers-hooks-common');
const abilities = require('./abilities').hook;
const _sanitizedData = require('../sanitizedData/sanitizedData');

module.exports = when(hook => hook.params.provider &&
  (`/${hook.path}` !== hook.app.get('authentication').path) && isProvider('external'),
[
  abilities, // Checks whether the client has permission
  _sanitizedData() // Remove fields that block by rules from data before Create/Update
]
);
