const debug = require('debug')('feathers-mongoose-casl');
const { authenticate } = require('@feathersjs/authentication').hooks;
const { NotAuthenticated } = require('@feathersjs/errors');
const verifyIdentity = authenticate('jwt');

function hasToken(hook) {
  let authorization = hook && hook.params && hook.params.headers && hook.params.headers.authorization;
  return authorization;
}

module.exports = async function (hook) {
  debug('authenticate hook - looking for token');
  let _hasToken = hasToken(hook);
  debug(`authenticate hook - token is ${_hasToken ? 'found' : 'not found'}`);
  try {
    if(_hasToken ) {
      await verifyIdentity(hook);
      debug('authenticate hook - token verified');
    }
    return hook;
  } catch (error) {
    if(_hasToken){
      if (error instanceof NotAuthenticated) {
        debug('authenticate hook - token not verified');
        return hook;
      }
    }
    throw error;
  }
};