// Initializes the `users` service on path `/users`
const createService = require('../../utils/createService');
// const createService = require('feathers-mongoose-casl');
const createModel = require('./uses.model');
const hooks = require('./users.hooks');
const errors = require('@feathersjs/errors');

const notFound = new errors.NotFound('User does not exist');

module.exports = function (app) {
  const Model = createModel(app);
  const paginate = app.get('paginate');

  const options = {
    Model,
    paginate,
  };
  
  // Initialize our service with any options it requires
  const userService = createService(options);
  app.use('/users', userService);
  // Get our initialized service so that we can register hooks
  const service = app.service('users');
  service.hooks(hooks);

  // Return user document to authenticate user
  app.use('/me', {
    async find(params) {
      const userId = params.user && params.user._id;
      if(userId){
        return await app.service('users').get(userId);
      }else{
        return notFound;
      }
    },
  });
  const meService = app.service('me');
  meService.hooks(hooks);

};
