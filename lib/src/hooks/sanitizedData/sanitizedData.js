
// sanitizedData.js
// extract only allowed fields from request body and response data

const debug = require('debug')('feathers-mongoose-casl');
const pick = require('../../utils/pick');
const {defineAbilitiesHelpers} = require('../../utils/helpers');
module.exports = function sanitizedData(skipServices) {
  return async function(hook) {
    try {
      if(skipServices && skipServices.includes(hook.path)) {
        debug(`sanitizedData hook - skip - path: ${hook.path}`);
        return;
      }
      const action = hook.method;
      const abilityFields = hook.params.abilityFields;
      const hookType = hook.type;

			if(hookType === 'before' && ['find', 'get'].includes(action)){
        // protect populate
        let populate = hook.params.query['$populate'];
        if(populate){
          const populateWhitelist = hook.params[defineAbilitiesHelpers.POPULATE_WHITELIST_KEY];
          const populateArr = typeof populate === 'string' ? populate.split(',') : populate;
          populate = populateWhitelist && populateArr.filter(item => populateWhitelist.includes(item));
          if(populate && populate.length){
            debug('sanitizedData hook - protect populate', { before:hook.params.query['$populate'], after: populate});
            hook.params.query['$populate'] = populate;
          }else{
            debug('sanitizedData hook - protect populate - remove populate from request');
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
          debug(`sanitizedData hook - before ${action}, protect fields with feathers select, service ${hook.path}, select: ${hook.params.query['$select']}`);
          // TODO 
          // When the fields _isSimpleAbilityFields then select need to be enough but for some reason is not working 
          // If it will be enough then we can  
          // hook.params[defineAbilitiesHelpers.ENABLE_ABILITY_FIELDS_KEY] = false;
          // to skip sanitizedData hook.after
          // const disabledSanitizedDataAfterFetch = !populate;
          // we disabled sanitized data after fetch only if $populate empty,
          // because populate: 'author' and select 'author._id' will fetch the full author
          // if(disabledSanitizedDataAfterFetch){
          //   hook.params[defineAbilitiesHelpers.ENABLE_ABILITY_FIELDS_KEY] = false;
          // }
        }
      }
			
			// When ENABLE_ABILITY_FIELDS_KEY then we want to
			// Remove some client fields from the data data before the request
			// Remove some fields from the response
			const enableAbilityFieldsKey = hook.params[defineAbilitiesHelpers.ENABLE_ABILITY_FIELDS_KEY]
			const has_fields = abilityFields && abilityFields.length;
			if(enableAbilityFieldsKey && has_fields) {
				if(hookType === 'before' && ['create', 'update', 'patch'].includes(action)){
					if(hook.data && typeof hook.data === 'object'){
						const isArray = Array.isArray(hook.data);
						debug(`sanitizedData hook - protect fields before ${action}`);
						hook.data = isArray ? hook.data.map(doc => pick(doc, abilityFields)) : pick(hook.data, abilityFields);
					}
					return hook;
				}

				if(hookType === 'after' && ['find', 'get'].includes(action)){
					if(hook.result.data){
						debug(`sanitizedData hook - filter data after find, service ${hook.path}`);
						hook.dispatch = Object.assign({}, hook.result, {data: hook.result.data.map(doc => pick(doc, abilityFields))});
					}else{
						hook.dispatch = pick(hook.result, abilityFields);
					}
					return hook;
				}
      }
    
			debug('sanitizedData hook - end');
      return hook;
          
    } catch (error) {
			hook.app.error('sanitizedData ', error);
			throw new Error(error)
    }
  };
};
