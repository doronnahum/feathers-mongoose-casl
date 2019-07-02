/**
 * validateSchema.hook.js
 * this hook run from src/app.hooks.js
 * create: [validateSchema()],
 * update: [validateSchema()],
 * patch: [validateSchema()],
 * We look for getValidators in the app
 * getValidators is set on model creator by utils/createModelFromJoi.js
 * We use Joi to validate the schema https://github.com/hapijs/joi
 */
const debug = require('debug')('feathers-mongoose-casl');
const { NotAcceptable } = require('@feathersjs/errors');
const { getJoiInstance } = require('../../utils/helpers');

module.exports = function validateSchema (skipServices) {
  return async function (hook) {
    try {
      const method = hook.method; // update,patch,create
      const serviceName = hook.path; // posts, products...
      if (skipServices.includes(serviceName)) {
        debug(`validateSchema hook - skip service ${serviceName}`);
        return hook;
      }
      const getValidators = getJoiInstance(hook.app, serviceName);

      let validator = null;
      if (getValidators) {
        // update is like create, it will replace all current data then check with required tests
        // in patch we didn't check the requirers tests
        const allowRequiredTest = ['create', 'update'].includes(method);
        validator = getValidators(allowRequiredTest);
        if (validator) {
          const check = validator.validate(hook.data);
          debug(`validateSchema hook - end, validate successfully, service ${serviceName}`);
          if (check.error) {
            debug(`validateSchema hook - end, validate failed, service ${serviceName}`);
            throw new NotAcceptable(check.error);
          }
        }
        return hook;
      } else {
        debug(`validateSchema hook - end, getValidators is not found, service ${serviceName}`);
      }
    } catch (error) {
      hook.app.error('feathers-mongoose-casl - validateSchema hook - error', error);
      throw new NotAcceptable(error);
    }
  };
};
