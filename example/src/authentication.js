const { AuthenticationService, JWTStrategy } = require('@feathersjs/authentication');
const { LocalStrategy } = require('@feathersjs/authentication-local');
const { expressOauth } = require('@feathersjs/authentication-oauth');
const { NotAuthenticated } = require('@feathersjs/errors');
// Add this
//

module.exports = app => {
  // Get  the verifyEmail value from config file
  // When verifyEmail is true, user can't logged in until
  // he verify is email
  const verifyEmailConfig = app.get('feathers-mongoose-casl').verifyEmail;
  const applyIsVerifiedEmail = verifyEmailConfig && verifyEmailConfig.enabled;

  // Create Authentication Service
  const authentication = new AuthenticationService(app);

  // Define strategies -
  // We allow logged in with email&password
  // You can learn more about this in feathers docs
  // to add more strategies like Facebook, Gmail...
  authentication.register('jwt', new JWTStrategy());
  authentication.register('local', new LocalStrategy());

  app.use('/authentication', authentication);
  app.configure(expressOauth());

  // Authentication service hooks
  app.service('authentication').hooks({
    before: {
      create: [
        (context) => {
          // disabled feathers-mongoose-casl abilities check for this service
          context.params.skipAbilitiesCheckFromAuthentication = true;
          return context;
        },
      ]
    },
    after: {
      create: [
        async (context) => {
          const { user } = context.result;
          // Block un verify user from logged in to the app when VerifiedEmail is true
          if (applyIsVerifiedEmail && !user.isVerified) {
            throw new NotAuthenticated('User Email is not yet verified.');
          }
          const me = await app.service('me').find({ user });
          context.dispatch = Object.assign({}, context.result, { user: me });
          return context;
        },
      ]
    }
  });
};