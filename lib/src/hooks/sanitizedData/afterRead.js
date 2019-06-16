const debug = require('debug')('feathers-mongoose-casl');
const pick = require('../../utils/pick');
const {defineAbilitiesHelpers} = require('../../utils/helpers');

const afterRead = async function(hook) {
  const SKIP_SANITIZED_DATA_AFTER_READ = hook.params[defineAbilitiesHelpers.SKIP_SANITIZED_DATA_AFTER_READ]
  if(SKIP_SANITIZED_DATA_AFTER_READ){
    debug(`sanitizedData hook - skip filter data after read, select fields with mongoose select from sanitizedData/beforeRead.js, service ${hook.path}`);
  }else{
    const abilityFields = hook.params.abilityFields;
    const enableAbilityFieldsKey = hook.params[defineAbilitiesHelpers.ENABLE_ABILITY_FIELDS_KEY];
    const has_fields = abilityFields && abilityFields.length;
  
    if(enableAbilityFieldsKey && has_fields) {
      if(hook.result.data){
        debug(`sanitizedData hook - filter data after find, service ${hook.path}`);
        hook.dispatch = Object.assign({}, hook.result, {data: hook.result.data.map(doc => pick(doc, abilityFields))});
      }else{
        hook.dispatch = pick(hook.result, abilityFields);
      }
    }
  }
  return hook;

};

module.exports = afterRead;
