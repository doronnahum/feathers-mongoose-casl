// Initializes the `authmanagement` service on path `/authmanagement`
const authManagement = require('feathers-authentication-management');
const hooks = require('./authmanagement.hooks');
const notifier = require('./notifier');
const { sanitizeUserForClient } = require('../../utils/helpers');
const swaggerSchemaExamples = require('../../utils/swaggerSchemaExamples');
const swaggerServiceConfiguration = require('../../utils/swaggerServiceConfiguration');

module.exports = function (app) {
  // Initialize our service with any options it requires
  app.configure(
    authManagement(
      {
        app,
        service: '/users', // need exactly this for test suite
        path: 'authManagement',
        notifier: notifier(app).notifier,
        longTokenLen: 15, // token's length will be twice this
        shortTokenLen: 6,
        shortTokenDigits: true,
        resetDelay: 1000 * 60 * 60 * 2, // 2 hours
        delay: 1000 * 60 * 60 * 24 * 5, // 5 days
        identifyUserProps: ['email'],
        sanitizeUserForClient: sanitizeUserForClient
      }
    )
  );

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('authManagement');
  swaggerServiceConfiguration({
    app,
    serviceName: 'authManagement',
    postDescription: 'sendResetPwd, passwordChange, verifySignupLong, checkUnique, resendVerifySignup',
    requestExample: swaggerSchemaExamples.authmanagementSwaggerSchema
  });
  service.hooks(hooks);
};
