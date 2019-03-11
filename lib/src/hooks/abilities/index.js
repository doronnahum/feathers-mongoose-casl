const { when, isProvider, iffElse } = require('feathers-hooks-common');
const enums = require('../../enums');
const abilities = require('./abilities').hook;
const _sanitizedData = require('../sanitizedData/sanitizedData');
const {callingParamsPersistUserKey} = require('../../utils/helpers')


module.exports = iffElse(hook => hook.params.provider &&
  (`/${hook.path}` !== hook.app.get('authentication').path) && isProvider('external'),
  [
    abilities, // Checks whether the client has permission
    _sanitizedData(enums.SERVICES_TO_SKIP_VALIDATE) // Remove fields that block by rules from data before Create/Update
  ],
  [when(hook => hook.params[callingParamsPersistUserKey], // When server make request and we want to persist user to check is ability
    function(hook){
      Object.assign(hook.params, hook.params[callingParamsPersistUserKey])
      delete hook.params[callingParamsPersistUserKey];
    },
    abilities, // Checks whether the client has permission
    _sanitizedData(enums.SERVICES_TO_SKIP_VALIDATE) // Remove fields that block by rules from data before Create/Update
    )
  ],
  );