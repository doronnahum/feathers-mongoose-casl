const posts = require('./posts/posts.service.js');
const { services } = require('../../../lib/index'); // require('feathers-mongoose-casl');

// eslint-disable-next-line no-unused-vars
module.exports = function (app) {
  // feathers-mongoose-casl services
  app.configure(services.users); // mongoose service to manage users collection
  app.configure(services.me); // / allow the user to get and patch itself *must come after users
  app.configure(services.authManagement); // handle user verify password, reset and more
  app.configure(services.rules); // Optional - import only if you need dynamic rules,mongoose service to manage rules collection
  app.configure(services.mailer); // used by notifier to send emails (Not exposed to the client)
  app.configure(services.notifier); // used by authManagement service to send the right email to the user to verify password, changed password message.(Not exposed to the client)
  app.configure(services.uploads); // uploads file to aws/google or to local folder.(Not exposed to the client)
  app.configure(services.files); // mongoose service to manage files collection, uploads files with upload service
  app.configure(services.dashboard); // A dashboard for managing your app
  app.configure(services.userAbilities); // Provides user permissions information
  // Specific project services
  app.configure(posts);
};
