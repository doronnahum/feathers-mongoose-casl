const { when, isProvider } = require('feathers-hooks-common');
const enums = require('../../enums');
const abilities = require('./abilities').hook;
const _sanitizedData = require('../sanitizedData/sanitizedData');
const authenticate = require('../authenticate');

const validateAbilities = when(
  hook => hook.params.provider &&
    (`/${hook.path}` !== hook.app.get('authentication').path) && isProvider('external'),
  authenticate, 
  abilities, // Checks whether the client has permission
  _sanitizedData(enums.SERVICES_TO_SKIP_VALIDATE) // Remove fields that block by rules from data before Create/Update
);

module.exports = validateAbilities;