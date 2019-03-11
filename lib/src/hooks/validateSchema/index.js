
const { when } = require('feathers-hooks-common');
const enums = require('../../enums');
const _validateSchema = require('./validateSchema');



const sanitizedData = when(
  hook => hook.params.provider,
  _validateSchema(enums.SERVICES_TO_SKIP_VALIDATE) // Remove fields that blocked by the rules from data before sending to client
);
  
module.exports = sanitizedData;