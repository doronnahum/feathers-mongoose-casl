
// sanitizedData.js
// sanitizedData hook will remove locked fields from user from the.
// and remove from update/create/patch before make the request


const pick = require('../utils/pick');

/**
 * @function pick
 * When abilityFields is not empty then we sanitized the data from the client and to the client
 * abilityFields is array of fields, examples:
 * ['-_id'] // allow all fields except the _id
 * ['_id'] // allow only _id
 * ['_id', 'title', {'body': '{'author': '{{ user._id }}'}'}] // allow _id and title to anybody but the body only for author
 * [{'-body': { 'author': '{{ user._id }}' }}] // allow all to anybody but remove body only for author
 */
module.exports = function sanitizedData(skipServices) {
  return async function(hook) {
    try {
      if(skipServices && skipServices.includes(hook.path)) return;
      const action = hook.method;
      const abilityFields = hook.params.abilityFields;
      const hookType = hook.type;
      if(!abilityFields || !abilityFields.length) return hook;
      if(hookType === 'after' && action === 'find'){
        if(hook.result.data){
          hook.result.data = hook.result.data.map(doc => pick(doc, abilityFields));
        }
        return hook;
      }
      if(hookType === 'after' && action === 'get'){
        hook.result = pick(hook.result, abilityFields);
        return hook;
      }
      if(hookType === 'before' && ['create', 'update', 'patch'].includes(action)){
        if(hook.data && typeof hook.data === 'object'){
          const isArray = Array.isArray(hook.data);
          hook.data = isArray ? hook.data.map(doc => pick(doc, abilityFields)) : pick(hook.data, abilityFields);
        }
        return hook;
      }
      return hook;
          
    } catch (error) {
      hook.app.error('sanitizedData ', error);
    }
  };
};
