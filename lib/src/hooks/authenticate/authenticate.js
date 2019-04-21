const { authenticate } = require('@feathersjs/authentication').hooks;
const { NotAuthenticated } = require('@feathersjs/errors');
const verifyIdentity = authenticate('jwt');
const {getTokenFromCookie} = require('../../utils/helpers');

// const {swaggerAuthenticationCookie} = require('feathers-mongoose-casl');

function hasToken(hook, allowTokenFromCookie) {
  let authorization = hook && hook.params && hook.params.headers && hook.params.headers.authorization;
  if(!authorization) { // Only with swagger we allow authorization from cookie and not from headers
    if(allowTokenFromCookie || ['docs', 'get-file'].includes(hook.path)){
      const token = getTokenFromCookie(hook);
      authorization =  token;
      hook.params.headers = hook.params.headers || {}
      hook.params.headers.authorization = token;
    }
  }
  return authorization;
}

module.exports = async function (hook, allowTokenFromCookie) {
  hook.app.debug('feathers-mongoose-casl - authenticate hook - looking for token');
  let _hasToken = hasToken(hook, allowTokenFromCookie);
  hook.app.debug(`feathers-mongoose-casl - authenticate hook - token is ${_hasToken ? 'found' : 'not found'}`);
  try {
    if(_hasToken ) {
      await verifyIdentity(hook);
      hook.app.debug('feathers-mongoose-casl - authenticate hook - token verified');
    }
    return hook;
  } catch (error) {
    if(_hasToken){
      if (error instanceof NotAuthenticated) {
        hook.app.debug('feathers-mongoose-casl - authenticate hook - token not verified');
        return hook;
      }
    }
    throw error;
  }
};