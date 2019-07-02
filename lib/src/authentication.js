const authentication = require('@feathersjs/authentication');
const jwt = require('@feathersjs/authentication-jwt');
const local = require('@feathersjs/authentication-local');
const oauth2 = require('@feathersjs/authentication-oauth2');
const Auth0Strategy = require('passport-auth0');
const GoogleStrategy = require('passport-google-oauth20');
const FacebookStrategy = require('passport-facebook');
const GithubStrategy = require('passport-github');
const verifyHooks = require('feathers-authentication-management').hooks;
const { debug } = require('feathers-hooks-common');
// feathers-mongoose-casl
const returnUserOnLogin = require('./hooks/authenticate/returnUserOnLogin');
const { addAuthenticationExampleToSwaggerDocs } = require('./utils/helpers');
// //un comment to copy to your src folder
// const { verifyHooks, returnUserOnLogin } = require('feathers-authentication-management').hooks;
// const {addAuthenticationExampleToSwaggerDocs} = require('feathers-mongoose-casl');

module.exports = function (app) {
  const config = app.get('authentication');
  const verifyEmailConfig = app.get('feathers-mongoose-casl').verifyEmail;
  const applyIsVerifiedEmail = verifyEmailConfig && verifyEmailConfig.enabled;

  // Set up authentication with the secret
  app.configure(authentication(config));

  // Swagger docs
  addAuthenticationExampleToSwaggerDocs(app);

  app.configure(jwt());
  app.configure(local());

  if (config.auth0) {
    app.configure(oauth2(Object.assign({
      name: 'auth0',
      Strategy: Auth0Strategy
    }, config.auth0)));
  }

  if (config.google) {
    app.configure(oauth2(Object.assign({
      name: 'google',
      Strategy: GoogleStrategy
    }, config.google)));
  }

  if (config.facebook) {
    app.configure(oauth2(Object.assign({
      name: 'facebook',
      Strategy: FacebookStrategy
    }, config.facebook)));
  }

  if (config.github) {
    app.configure(oauth2(Object.assign({
      name: 'github',
      Strategy: GithubStrategy
    }, config.github)));
  }

  // The `authentication` service is used to create a JWT.
  // The before `create` hook registers strategies that can be used
  // to create a new valid JWT (e.g. local or oauth2)
  app.service('authentication').hooks({
    before: {
      create: [
        authentication.hooks.authenticate(config.strategies),
        applyIsVerifiedEmail ? verifyHooks.isVerified() : () => {}
      ],
      remove: [
        authentication.hooks.authenticate(config.strategies)
      ]
    },
    after: {
      create: [
        returnUserOnLogin()
      ]
    }
  });
};
