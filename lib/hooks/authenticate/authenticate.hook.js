const { authenticate } = require('@feathersjs/authentication').hooks;
const { NotAuthenticated } = require('feathers-errors');
const verifyIdentity = authenticate('jwt');
const {swaggerAuthenticationCookie} = require('../../utils/helpers');

function hasToken(hook) {
  const authorization = hook && hook.params && hook.params.headers && hook.params.headers.authorization;

  if(!authorization) { // Only with swagger we allow authorization from cookie and not from headers
    swaggerAuthenticationCookie(hook);
  }
  return authorization;
}

module.exports = async function authenticate(hook) {
  let _hasToken = hasToken(hook);
  try {
    return await verifyIdentity(hook);
  } catch (error) {
    if(_hasToken){
      if (error instanceof NotAuthenticated && !hasToken(hook)) {
        return hook;
      }
    }else{
      return hook;
    }
    throw error;
  }
};