
const { when, isProvider } = require('feathers-hooks-common');
const _sanitizedData = require('./sanitizedData');

const sanitizedData = when(
  isProvider('external'),
  _sanitizedData() // Remove fields that blocked by the rules from data before sending to client
);

module.exports = sanitizedData;
