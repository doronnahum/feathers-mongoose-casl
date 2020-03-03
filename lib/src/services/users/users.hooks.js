const verifyHooks = require('feathers-authentication-management').hooks;

const commonHooks = require('feathers-hooks-common');
const {
  hashPassword,
  protect
} = require('@feathersjs/authentication-local').hooks;

// feathers-mongoose-casl
// ------------------------
const notifier = require('../authmanagement/notifier');
const authenticate = require('../../hooks/authenticate');
const validateAbilities = require('../../hooks/abilities');
const validateSchema = require('../../hooks/validateSchema');
const sanitizedData = require('../../hooks/sanitizedData');
// //un comment to copy to your src folder
// const validateSchema = require('feathers-mongoose-casl/lib/src/hooks/validateSchema');
// const authenticate = require('feathers-mongoose-casl/lib/src/hooks/authenticate');
// const validateAbilities = require('feathers-mongoose-casl/lib/src/hooks/abilities');
// const sanitizedData = require('feathers-mongoose-casl/lib/src/hooks/sanitizedData');


module.exports = {
  before: {
    all: [
      authenticate, // Check user token(JWT) and get user from DB, user will be found at hook.params.user 
      validateAbilities // Check user abilities (CASL) 
    ],
    find: [],
    get: [],
    create: [
      validateSchema,
      commonHooks.iff(
        commonHooks.isProvider('external'),
        commonHooks.discard(
          'isVerified',
          'verifyToken',
          'verifyShortToken',
          'verifyExpires',
          'verifyChanges',
          'resetToken',
          'resetShortToken',
          'resetExpires',
          'roles'
        )
      ),
      (context) => {
        const isFirstUSer = context.app.get('firstUsers').includes(context.data.email)
        if (isFirstUSer) {
          context.data.isVerified = true;
          context.data.roles = ['sys_admin'];
        } else {
          verifyHooks.addVerification(context)
        }
        context.params.userRequest = context.data; // We need this to signin a user after signup
      },
      hashPassword('password'),
    ],
    update: [
      validateSchema,
      commonHooks.iff(
        commonHooks.isProvider('external'),
        commonHooks.preventChanges(
          true,
          'isVerified',
          'verifyToken',
          'verifyShortToken',
          'verifyExpires',
          'verifyChanges',
          'resetToken',
          'resetShortToken',
          'resetExpires'
        )
      )
    ],
    patch: [
      validateSchema,
      commonHooks.iff(
        commonHooks.isProvider('external'),
        commonHooks.preventChanges(
          true,
          'email',
          'isVerified',
          'verifyToken',
          'verifyShortToken',
          'verifyExpires',
          'verifyChanges',
          'resetToken',
          'resetShortToken',
          'resetExpires'
        )
      )
    ],
    remove: []
  },

  after: {
    all: [
      sanitizedData,
      // Make sure the password field is never sent to the client
      // Always must be the last hook
      protect('password'), // do not remove
      commonHooks.when(
        commonHooks.isProvider('external')
        // removeUserProtectedFields(),
      )
    ],
    find: [],
    get: [],
    create: [
      async context => {
        const verifyEmailConfig = context.app.get('feathers-mongoose-casl').verifyEmail;
        const applyIsVerifiedEmail = verifyEmailConfig && verifyEmailConfig.enabled;
        const isFirstUSer = context.app.get('firstUsers').includes(context.params.userRequest.email)
        if (applyIsVerifiedEmail && !isFirstUSer) {
          notifier(context.app).notifier('resendVerifySignup', context.result);
          context.result.verifiedRequired = true;
        } else {
          const user = await context.app.service('users').find({ query: { email: context.params.userRequest.email } });
          context.params.user = user.data[0]; // We need this at feathers-mongoose-casl > returnUserOnLogin.js
          const loginUser = await context.app.service('authentication').create({
            email: context.params.userRequest.email,
            password: context.params.userRequest.password,
            strategy: 'local'
          });
          context.dispatch = loginUser;
        }
      },
      verifyHooks.removeVerification()
    ],
    update: [],
    patch: [],
    remove: []
  }
};
