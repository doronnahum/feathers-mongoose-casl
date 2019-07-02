// sanitizedData.js
// extract only allowed fields from request body and response data

const debug = require('debug')('feathers-mongoose-casl');
const beforeRead = require('./beforeRead');
const afterRead = require('./afterRead');
const beforeUpdateAndCreate = require('./beforeUpdateAndCreate');
const { SERVICES_TO_SKIP_VALIDATE } = require('../../enums');
module.exports = function sanitizedData () {
  return async function (hook) {
    try {
      if (SERVICES_TO_SKIP_VALIDATE.includes(hook.path)) {
        return hook;
      }

      /**
       * Skip sanitizedData
       * Check if service.options.skipAbilitiesCheck is true
       */
      const skipAbilitiesCheck =
        hook.service &&
        hook.service.options &&
        hook.service.options.skipAbilitiesCheck;
      if (skipAbilitiesCheck) {
        if (
          skipAbilitiesCheck === true ||
          skipAbilitiesCheck.includes(hook.method)
        ) {
          debug(
            `abilities hook end - skip sanitizedData ${
              hook.path
            }.service.options.skipAbilitiesCheck = true`
          );
          return hook;
        }
      }

      debug('sanitizedData hook - start');
      const action = hook.method;
      const hookType = hook.type;

      /**
       * Before Read
       * ------------
       * We want to define populate and select before server request
       *
       */
      if (hookType === 'before' && ['find', 'get'].includes(action)) {
        await beforeRead(hook);
      }

      /**
       * Before Update & Create
       * ------------
       * We want to remove fields from response
       * // TODO - need to think how to protect fields from update response
       */
      if (
        hookType === 'before' &&
        ['create', 'update', 'patch'].includes(action)
      ) {
        await beforeUpdateAndCreate(hook);
      }

      /**
       * After Read
       * ------------
       * We want to remove fields from response
       */
      if (hookType === 'after' && ['find', 'get'].includes(action)) {
        await afterRead(hook);
      }

      debug('sanitizedData hook - end');
      return hook;
    } catch (error) {
      hook.app.error(
        'feathers-mongoose-casl/src/hooks/sanitizedData/sanitizedData.js ',
        error
      );
      throw new Error(error);
    }
  };
};
