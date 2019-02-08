const authentication = require('@feathersjs/authentication');
const jwt = require('@feathersjs/authentication-jwt');
const local = require('@feathersjs/authentication-local');
const oauth2 = require('@feathersjs/authentication-oauth2');
const Auth0Strategy = require('passport-auth0');
const GoogleStrategy = require('passport-google-oauth20');
const FacebookStrategy = require('passport-facebook');
const GithubStrategy = require('passport-github');
// const verifyHooks = require('feathers-authentication-management').hooks;
const verifyHooks = require('feathers-authentication-management').hooks;
const { debug } = require('feathers-hooks-common');
const returnUserOnLogin = require('./hooks/authenticate/returnUserOnLogin.hook');
const {addAuthenticationSwaggerDocs} = require('./utils/helpers');
// const {hooks} = require('feathers-mongoose-casl');
// const addAuthenticationSwaggerDocs = hooks.addAuthenticationSwaggerDocs;

module.exports = function (app) {
  const config = app.get('authentication');
  const applyIsVerifiedEmail = app.get('verifyEmail').enabled;

  // Set up authentication with the secret
  app.configure(authentication(config));
  
  // Swagger docs
  addAuthenticationSwaggerDocs(app);


  app.configure(jwt());
  app.configure(local());

  app.configure(oauth2(Object.assign({
    name: 'auth0',
    Strategy: Auth0Strategy
  }, config.auth0)));

  app.configure(oauth2(Object.assign({
    name: 'google',
    Strategy: GoogleStrategy
  }, config.google)));

  app.configure(oauth2(Object.assign({
    name: 'facebook',
    Strategy: FacebookStrategy
  }, config.facebook)));

  app.configure(oauth2(Object.assign({
    name: 'github',
    Strategy: GithubStrategy
  }, config.github)));

  // The `authentication` service is used to create a JWT.
  // The before `create` hook registers strategies that can be used
  // to create a new valid JWT (e.g. local or oauth2)
  app.service('authentication').hooks({
    before: {
      create: [
        authentication.hooks.authenticate(config.strategies),
        applyIsVerifiedEmail ? verifyHooks.isVerified() : debug('Allow unVerify email to login')
      ],
      remove: [
        authentication.hooks.authenticate(config.strategies),
      ]
    },
    after: {
      create: [
        returnUserOnLogin()
      ]
    }
  });
};
