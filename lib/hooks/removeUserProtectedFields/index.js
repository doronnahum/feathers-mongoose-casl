/**
 * removeUserProtectedFields.hook.js
 * Before update/create/patch
 * this hook will remove this fields
 *  'isVerified',
    'verifyToken',
    'verifyShortToken',
    'verifyExpires',
    'verifyChanges',
    'resetToken',
    'resetShortToken',
    'resetExpires',
    'password' -> allow only on create
    'email', -> allow only on create and read
  *
  * After find/get
  * this hook will remove password fields before sending data to user
 */


const pick = require('../../utils/pick');
const enums = require('../../enums');

module.exports = function removeUserProtectedFields() {
  return async function(hook) {
    
    const hookType = hook.type;
    const method = hook.method;
    let USER_PROTECTED_FIELDS = enums.USER_PROTECTED_FIELDS.map(field => `-${field}`);

    

    if(hookType === 'before' && ['create', 'update', 'patch'].includes(method)){
      
      if(method === 'update' || method === 'patch'){
        USER_PROTECTED_FIELDS.push('-email');
        USER_PROTECTED_FIELDS.push('-password');
      }


      if(hook.data && typeof hook.data === 'object'){
        const isArray = Array.isArray(hook.data);
        hook.data = isArray ? hook.data.map(doc => pick(doc, USER_PROTECTED_FIELDS)) : pick(hook.data, USER_PROTECTED_FIELDS);
      }
      return hook;
    }

    if(hookType === 'after' && method === 'find'){
      USER_PROTECTED_FIELDS.push('-password');
      if(hook.result.data){
        hook.result.data = hook.result.data.map(doc => pick(doc, USER_PROTECTED_FIELDS));
      }else if(hook.result){
        hook.result = pick(hook.result, USER_PROTECTED_FIELDS);
      }
      return hook;
    }
    if(hookType === 'after' && method === 'get'){
      USER_PROTECTED_FIELDS.push('-password');
      hook.result = pick(hook.result, USER_PROTECTED_FIELDS);
      return hook;
    }
    
    return hook;
  };
};
  