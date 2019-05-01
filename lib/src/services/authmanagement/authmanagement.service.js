// Initializes the `authmanagement` service on path `/authmanagement`
const authManagement = require('feathers-authentication-management');
const hooks = require('./authmanagement.hooks');
const notifier = require('./notifier');
const {sanitizeUserForClient} = require('../../utils/helpers');
const swaggerSchemaExamples = require('../../utils/swaggerSchemaExamples');

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
  // Swagger docs
  if(app.docs && app.docs.paths['/authManagement']){
    app.docs.paths['/authManagement'].post.description = 'sendResetPwd, passwordChange, verifySignupLong, checkUnique, resendVerifySignup';
    app.docs.paths['/authManagement'].post.parameters[0].schema = swaggerSchemaExamples.authmanagementSwaggerSchema;
  }
  service.options = Object.assign({
    skipAbilitiesCheck: true
  }, service.options);
  service.hooks(hooks);
};