// Initializes the `dashboard` service on path `/dashboard`

// dashboard find() will pass over the app services and return array of objects.
// each object will be include the user abilities to this specific collection and the json schema
// only collection with model that build with createModelFromJoi.js util that user able to read will be include in the result
// this service is depend on user-abilities service and createModelFromJoi util.js

const createService = require('./dashboard.class.js');
const hooks = require('./dashboard.hooks');

module.exports = function (app) {
  const paginate = app.get('paginate');

  const options = {
    paginate,
    app
  };

  // Initialize our service with any options it requires
  app.use('/dashboard', createService(options));

  // Get our initialized service so that we can register hooks
  const service = app.service('dashboard');

  service.hooks(hooks);
};

// Result Example
// ----------------------
// {
//   'total': 1,
//   'data': [
//     {'result': {
//       'name': 'posts',
//       'canRead': true,
//       'readFields': [
//         'title'
//       ],
//       'canCreate': true,
//       'createFields': [
//         'title',
//         'body'
//       ],
//       'canUpdate': true,
//       'updateFields': [
//         'body'
//       ],
//       'canDelete': false
//     },
//     'schema': {
//       'type': 'object',
//       'properties': {
//         'title': {
//           'type': 'string',
//           'meta': []
//         }
//       },
//       'additionalProperties': false,
//       'patterns': [],
//       'required': [
//         'title'
//       ]
//     },
//     'data': {
//       'serviceName': 'posts',
//       'includeSchema': true
//     },
//     },
//   ]
// };
