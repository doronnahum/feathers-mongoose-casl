
const { when, isProvider } = require('feathers-hooks-common');
const enums = require('../../enums');
const _sanitizedData = require('./sanitizedData');



const sanitizedData = when(
  isProvider('external'),
  _sanitizedData(enums.SERVICES_TO_SKIP_VALIDATE) // Remove fields that blocked by the rules from data before sending to client
);
  
module.exports = sanitizedData;