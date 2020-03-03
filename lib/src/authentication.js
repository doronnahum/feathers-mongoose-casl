const { AuthenticationService, JWTStrategy } = require('@feathersjs/authentication');
const { LocalStrategy } = require('@feathersjs/authentication-local');
const { expressOauth } = require('@feathersjs/authentication-oauth');
const { NotAuthenticated } = require('@feathersjs/errors');
// Add this
// const { pick } = require('feathers-mongoose-casl');
const pick = require('./utils/pick');
//

module.exports = app => {
  // Add this
  const verifyEmailConfig = app.get('feathers-mongoose-casl').verifyEmail;
  const applyIsVerifiedEmail = verifyEmailConfig && verifyEmailConfig.enabled;
  //
  const authentication = new AuthenticationService(app);

  authentication.register('jwt', new JWTStrategy());
  authentication.register('local', new LocalStrategy());

  app.use('/authentication', authentication);
  app.configure(expressOauth());

  // Add this hooks
  app.service('authentication').hooks({
    before: {
      create: [
        (context) => {
          context.params.skipAbilitiesCheckFromAuthentication = true;
          return context;
        }
      ]
    },
    after: {
      create: [
        (context) => {
          const { user } = context.result;
          if (applyIsVerifiedEmail && !user.isVerified) {
            throw new NotAuthenticated('User Email is not yet verified.');
          }
          const pickMeReadFields = app.get('feathers-mongoose-casl').pickMeReadFields;

          // context.dispatch = context.result;
          context.dispatch = Object.assign({}, context.result, { user: pick(context.result.user, pickMeReadFields) });
          return context;
        }
      ]
    }
  });
};
