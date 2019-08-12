// Initializes the `users` service on path `/users`
const createModel = require('./users.model');
const hooks = require('./users.hooks');
// feathers-mongoose-casl
// ------------------------
const createService = require('../../utils/createService');
// //un comment to copy to your src folder
// const {createService} = require('feathers-mongoose-casl');

module.exports = function (app) {
  const Model = createModel(app);
  const paginate = app.get('paginate');

  const options = Object.assign({
    Model,
    paginate,
    serviceRules: [
      {
        'description': 'allow register to your app',
        'actions': ['create'],
        'anonymousUser': true
      }
    ],
    dashboardConfig: {
      sideBarIconName: 'user'
    }
  }, app.get('feathers-mongoose-casl').usersServiceOptions);

  // Initialize our service with any options it requires
  const userService = createService(options);
  app.use('/users', userService);
  // Get our initialized service so that we can register hooks
  const service = app.service('users');
  service.hooks(hooks);
};
