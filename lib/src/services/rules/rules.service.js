/* eslint-disable quotes */
// Initializes the `rules` service on path `/rules`

const createService = require('../../utils/createService');
// const {createService} = require('feathers-mongoose-casl');
const createModel = require('./rules.model');
const hooks = require('./rules.hooks');
const swaggerSchemaExamples = require('../../utils/swaggerSchemaExamples');

module.exports = function (app) {
  const Model = createModel(app);
  const rulesCacheConfig = app.get('feathers-mongoose-casl').rulesCache;
  const options = {
    Model,
    paginate: {
      "default": rulesCacheConfig['local-config'].max,
      "max": rulesCacheConfig['local-config'].max
    },
    whitelist: [ '$exists' ],
    dashboardConfig: {
      sideBarIconName: 'account-book',
      docLayout: [
        ['name','description','active'],
        'actions',
        'subject',
        'fields',
        ['from','to'],
        'anonymousUser',
        'conditions',
        'userContext',
        'roles'
      ],
    }
  };

  // Initialize our service with any options it requires
  const rulesService = createService(options);
  app.use('/rules',rulesService);
  
  // Swagger docs
  if(app.docs && app.docs.paths['/rules']){
    app.docs.paths['/rules'].post.description = 'Create and update rules collection';
    app.docs.paths['/rules'].post.parameters[0].schema = swaggerSchemaExamples.rulesSwaggerSchema;
  }

  // Get our initialized service so that we can register hooks
  const service = app.service('rules');
  
  service.hooks(hooks);

};
