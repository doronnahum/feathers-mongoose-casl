const { authenticate } = require('@feathersjs/authentication').hooks;
const { NotAuthenticated } = require('feathers-errors');
const verifyIdentity = authenticate('jwt');
const {getTokenFromCookie} = require('../../utils/helpers');

// const {swaggerAuthenticationCookie} = require('feathers-mongoose-casl');

function hasToken(hook) {
  let authorization = hook && hook.params && hook.params.headers && hook.params.headers.authorization;
  if(!authorization) { // Only with swagger we allow authorization from cookie and not from headers
    getTokenFromCookie(hook, ['docs', 'get-file']);
    authorization =  hook.params.headers.authorization;
  }
  return authorization;
}

module.exports = async function (hook) {
  hook.app.info('feathers-mongoose-casl - authenticate hook - looking for token');
  let _hasToken = hasToken(hook);
  hook.app.info(`feathers-mongoose-casl - authenticate hook - token is ${_hasToken ? 'found' : 'not found'}`);
  try {
    if(_hasToken ) {
      await verifyIdentity(hook);
      hook.app.info('feathers-mongoose-casl - authenticate hook - token verified');
    }
    return hook;
  } catch (error) {
    if(_hasToken){
      if (error instanceof NotAuthenticated) {
        hook.app.info('feathers-mongoose-casl - authenticate hook - token not verified');
        return hook;
      }
    }
    throw error;
  }
};