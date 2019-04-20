// Initializes the `users` service on path `/users`
const errors = require('@feathersjs/errors');
const pick = require('../../utils/pick');
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
    async patch(id, data, params) {
      return app.service('users').patch(params.user._id, data);
    },
  });
  const meService = app.service('me');
  meService.options = {
    Model: service.options.Model, // We need this here to help src\feathers-mongoose-casl\src\hooks\abilities\abilities.js defined fields
    serviceRules: [
      {
        'name': 'allow-me',
        'description': 'Allow user to get is document from users collection',
        'actions': ['read'],
        //app.get('feathers-mongoose-casl').pickMeReadFields,
        'conditions': '{ "_id": "{{ user._id }}" }'
      },
      {
        'name': 'allow-update-me',
        'description': 'Allow user to update some fields in there document from users collection',
        'actions': ['update'],
        'fields': app.get('feathers-mongoose-casl').pickMeUpdateFields,
        'conditions': '{ "_id": "{{ user._id }}" }'
      }
    ]
  };
  meService.hooks({
    before: {
      patch: [(hook) => {
        const abilityFields = app.get('feathers-mongoose-casl').pickMeUpdateFields;
        hook.data = pick(hook.data, abilityFields);
      }]
    },
    after: {
      patch: [(hook) => {
        hook.dispatch = pick(hook.result, app.get('feathers-mongoose-casl').pickMeReadFields);
      }],
      find: [(hook) => {
        hook.dispatch = pick(hook.result, app.get('feathers-mongoose-casl').pickMeReadFields);
      }],
    }
  });

};
