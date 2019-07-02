const debug = require('debug')('feathers-mongoose-casl');
const pick = require('../../utils/pick');
const { defineAbilitiesHelpers } = require('../../utils/helpers');

const beforeUpdateAndCreate = async function (hook) {
  const action = hook.method;
  const abilityFields = hook.params.abilityFields;
  const enableAbilityFieldsKey = hook.params[defineAbilitiesHelpers.ENABLE_ABILITY_FIELDS_KEY];
  const hasFields = abilityFields && abilityFields.length;

  if (enableAbilityFieldsKey && hasFields) {
    if (hook.data && typeof hook.data === 'object') {
      const isArray = Array.isArray(hook.data);
      debug(`sanitizedData hook - protect fields before ${action}`);
      hook.data = isArray
        ? hook.data.map(doc => pick(doc, abilityFields))
        : pick(hook.data, abilityFields);
    }
  }
};

module.exports = beforeUpdateAndCreate;
