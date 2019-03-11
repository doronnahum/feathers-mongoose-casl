const { when, isProvider } = require('feathers-hooks-common');
const enums = require('../../enums');
const authenticate = require('./authenticate');

const validateAbilities = when(
  hook => hook.params.provider &&
    (`/${hook.path}` !== hook.app.get('authentication').path) && isProvider('external'),
    function(){console.log('before authenticate')},
    async function (hook) {
      return await authenticate(hook)
    }, 
    function(){console.log('after authenticate')},
);

module.exports = validateAbilities;