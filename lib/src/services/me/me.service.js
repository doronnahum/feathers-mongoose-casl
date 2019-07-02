// Initializes the `me` service on path `/me`
const errors = require('@feathersjs/errors');
const hooks = require('./me.hooks');
const pick = require('../../utils/pick');
const notFound = new errors.NotFound('User does not exist');

module.exports = function (app) {
  if (!app.service('users').options.Model) {
    app.errors('feathers-mongoose-casl - !!Important - me service must register after the users service');
  }
  const options = {
    Model: app.service('users').options.Model, // We need this here to help src\feathers-mongoose-casl\src\hooks\abilities\abilities.js defined fields
    serviceRules: [
      {
        'name': 'allow-me',
        'description': 'Allow user to get is document from users collection',
        'actions': ['read'],
        // app.get('feathers-mongoose-casl').pickMeReadFields,
        'conditions': '{ "_id": "{{ user._id }}" }'
      },
      {
        'name': 'allow-update-me',
        'description': 'Allow user to update some fields in there document from users collection',
        'actions': ['update'],
        'conditions': '{ "_id": "{{ user._id }}" }'
      }
    ]
  };

  // Return user document to authenticate user
  app.use('/me', {
    async find (params) {
      const userId = params.user && params.user._id;
      if (userId) {
        const me = await app.service('users').get(userId);
        const pickMeReadFields = app.get('feathers-mongoose-casl').pickMeReadFields;
        return pick(me, pickMeReadFields);
      } else {
        return notFound;
      }
    },
    async patch (id, data, params) {
      const pickMeReadFields = app.get('feathers-mongoose-casl').pickMeUpdateFields;
      const pickMeUpdateFields = app.get('feathers-mongoose-casl').pickMeUpdateFields;
      const _data = pick(data, pickMeUpdateFields);
      const me = app.service('users').patch(params.user._id, _data);
      return pick(me, pickMeReadFields);
    }
  });
  const service = app.service('me');
  service.options = options;
  service.hooks(hooks);
};
