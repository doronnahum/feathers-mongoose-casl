
// sanitizedData.js
// extract only allowed fields from request body and response data


const pick = require('../../utils/pick');
const {defineAbilitiesHelpers} = require('../../utils/helpers');
module.exports = function sanitizedData(skipServices) {
  return async function(hook) {
    try {
      if(skipServices && skipServices.includes(hook.path)) {
        hook.app.debug(`feathers-mongoose-casl - sanitizedData hook - skip - path: ${hook.path}`);
        return;
      }
      const action = hook.method;
      const abilityFields = hook.params.abilityFields;
      const hookType = hook.type;

      if(!abilityFields || !abilityFields.length) {
        hook.app.debug(`feathers-mongoose-casl - sanitizedData hook - end, the abilityFields in not found - path: ${hook.path}`);
        return hook;
      }
      if(!hook.params[defineAbilitiesHelpers.ENABLE_ABILITY_FIELDS_KEY]) {
        hook.app.debug('feathers-mongoose-casl - sanitizedData hook - end');
        return hook;
      };
      
      if(hookType === 'after' && action === 'find'){
        if(hook.result.data){
          hook.app.debug(`feathers-mongoose-casl - sanitizedData hook - filter data after find, service ${hook.path}`);
          hook.result.data = hook.result.data.map(doc => pick(doc, abilityFields));
        }
        return hook;
      }
      if(hookType === 'after' && action === 'get'){
        hook.app.debug(`feathers-mongoose-casl - sanitizedData hook - filter data after get, service ${hook.path}`);
        hook.result = pick(hook.result, abilityFields);
        return hook;
      }if(hookType === 'before' && ['find', 'get'].includes(action)){
        // protect populate
        let populate = hook.params.query['$populate'];
        if(populate){
          const populateWhitelist = hook.params[defineAbilitiesHelpers.POPULATE_WHITELIST_KEY];
          const populateArr = typeof populate === 'string' ? populate.split(',') : populate;
          populate = populateWhitelist && populateArr.filter(item => populateWhitelist.includes(item));
          if(populate && populate.length){
            hook.app.debug('feathers-mongoose-casl - sanitizedData hook - protect populate', { before:hook.params.query['$populate'], after: populate});
            hook.params.query['$populate'] = populate;
          }else{
            hook.app.debug('feathers-mongoose-casl - sanitizedData hook - protect populate - remove populate from request');
            delete hook.params.query['$populate'];
          }
        }
        // select fields
        let select = hook.params.query['$select'];
        const _isSimpleAbilityFields = defineAbilitiesHelpers.isSimpleAbilityFields(abilityFields, select);
        if(_isSimpleAbilityFields){ // we can use mongoose to protect fields
          if(select){
            hook.params.query['$select'] = [select, ...abilityFields].join(' ');
          }else{
            hook.params.query['$select'] = [...abilityFields].join(' ');
          }
          hook.app.debug(`feathers-mongoose-casl - sanitizedData hook - before ${action}, protect fields with feathers select, service ${hook.path}, select: ${hook.params.query['$select']}`);
          const disabledSanitizedDataAfterFetch = !populate;
          // we disabled sanitized data after fetch only if $populate empty,
          // because populate: 'author' and select 'author._id' will fetch the full author
          if(disabledSanitizedDataAfterFetch){
            hook.params[defineAbilitiesHelpers.ENABLE_ABILITY_FIELDS_KEY] = false;
          }
        }
      }

      if(hookType === 'before' && ['create', 'update', 'patch'].includes(action)){
        if(hook.data && typeof hook.data === 'object'){
          const isArray = Array.isArray(hook.data);
          hook.app.debug(`feathers-mongoose-casl - sanitizedData hook - protect fields before ${action}`);
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
