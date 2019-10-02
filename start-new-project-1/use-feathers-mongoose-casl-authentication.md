---
description: We need to add authentication to app.configure
---

# Verify user

Open src/authentication.js and update file

```javascript
const { AuthenticationService, JWTStrategy } = require('@feathersjs/authentication');
const { LocalStrategy } = require('@feathersjs/authentication-local');
const { expressOauth } = require('@feathersjs/authentication-oauth');

// Add this
const { verifyHooks, returnUserOnLogin } = require('feathers-authentication-management').hooks;
//

module.exports = app => {
  // Add this
  const config = app.get('authentication');
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

```

