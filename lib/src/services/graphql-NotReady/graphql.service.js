// Initializes the `graphql` service on path `/graphql`
const createService = require('./graphql.class.js');
const hooks = require('./graphql.hooks');
var graphqlHTTP = require('express-graphql');
const createSchema = require('./createSchema');

module.exports = function (app) {
  const paginate = app.get('paginate');
  const graphqlSchema = createSchema({ app });

  const options = {
    paginate,
    skipAbilitiesCheck: false,
    serviceRules: [
      {
        actions: ['manage'],
        anonymousUser: true
      }
    ]
  };

  // Initialize our service with any options it requires
  app.use('/graphql', createService(options), graphqlHTTP({
    schema: graphqlSchema,
    graphiql: true
  }));
  // Get our initialized service so that we can register hooks
  const service = app.service('graphql');

  service.hooks(hooks);
};
