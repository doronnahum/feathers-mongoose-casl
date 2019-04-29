const verifyHooks = require('feathers-authentication-management').hooks;
const commonHooks = require('feathers-hooks-common');
const { hashPassword, protect } = require('@feathersjs/authentication-local').hooks;

// feathers-mongoose-casl
// ------------------------
const notifier = require('../authmanagement/notifier');
const usersCache = require('../../hooks/cache/usersCache');
// //un comment to copy to your src folder
// const notifier = require('feathers-mongoose-casl/lib/src/services/authmanagement/notifier/index.js');
// const {usersCache} = require('feathers-mongoose-casl').hooks;

module.exports = {
  before: {
    all: [],
    find: [],
    get: [],
    create: [ 
      commonHooks.iff(commonHooks.isProvider('external'), commonHooks.discard(
        'isVerified',
        'verifyToken',
        'verifyShortToken',
        'verifyExpires',
        'verifyChanges',
        'resetToken',
        'resetShortToken',
        'resetExpires',
        'roles')),
      hashPassword(),
      verifyHooks.addVerification(),
    ],
    update: [
      commonHooks.iff(commonHooks.isProvider('external'), commonHooks.preventChanges(true,
        'isVerified',
        'verifyToken',
        'verifyShortToken',
        'verifyExpires',
        'verifyChanges',
        'resetToken',
        'resetShortToken',
        'resetExpires'
      )),
    ],
    patch: [
      commonHooks.iff(commonHooks.isProvider('external'), commonHooks.preventChanges(true,
        'email',
        'isVerified',
        'verifyToken',
        'verifyShortToken',
        'verifyExpires',
        'verifyChanges',
        'resetToken',
        'resetShortToken',
        'resetExpires'
      )),
    ],
    remove: []
  },

  after: {
    all: [ 
      // Make sure the password field is never sent to the client
      // Always must be the last hook
      protect('password'), // do not remove
      commonHooks.when(
        commonHooks.isProvider('external'),
        // removeUserProtectedFields(),
      ),
    ],
    find: [],
    get: [usersCache.setUserInCache],
    create: [
      context => {
        const applyIsVerifiedEmail = context.app.get('feathers-mongoose-casl').verifyEmail.enabled;
        if(applyIsVerifiedEmail){
          notifier(context.app).notifier('resendVerifySignup', context.result);
          context.result.verifiedRequired = true;
        }
      },
      verifyHooks.removeVerification(),
    ],
    update: [usersCache.clearUserFromCache],
    patch: [usersCache.clearUserFromCache],
    remove: [usersCache.clearUserFromCache]
  },
};