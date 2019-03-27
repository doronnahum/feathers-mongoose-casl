// Initializes the `users` service on path `/users`
const errors = require('@feathersjs/errors');

const createModel = require('./uses.model');
const hooks = require('./users.hooks');
// feathers-mongoose-casl
// ------------------------
const createService = require('../../utils/createService');
// //un comment to copy to your src folder
// const {createService} = require('feathers-mongoose-casl');


const notFound = new errors.NotFound('User does not exist');

module.exports = function (app) {
  const Model = createModel(app);
  const paginate = app.get('paginate');

  const options = {
    Model,
    paginate,
    serviceRules: [
      {
        'description': 'allow register to your app',
        'actions': ['create'],
        'fields': ['-roles'],
        'anonymousUser': true
      },
    ]
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
  meService.options = {
    serviceRules: [
      {
        'name': 'allow-me',
        'description': 'Allow user to get is document from users collection',
        'actions': ['read'],
        'condition': '{ "_id": "{{ user._id }}" }'
      },
      {
        'name': 'allow-signup',
        'actions': ['create'],
        anonymousUser: true
      },
    ]
  };
  meService.hooks(hooks);

};
