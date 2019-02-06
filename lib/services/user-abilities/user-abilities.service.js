/* eslint-disable quotes */
// Initializes the `roles` service on path `/user-abilities`
const createService = require('./user-abilities.class.js');
const hooks = require('./user-abilities.hooks');
const { accessibleRecordsPlugin } = require('@casl/mongoose');

module.exports = function (app) {
    
  const paginate = app.get('paginate');
  
  // --------- Add  accessibleRecordsPlugin ------------
  // It will serve all the services, we do it here for convenience
  const mongooseClient = app.get('mongooseClient');
  if(!mongooseClient){
    app.error('feathers-mongoose-casl- missing mongooseClient, need to app.set(mongooseClient, mongoose)');
  }else{
    mongooseClient.plugin(accessibleRecordsPlugin);
  }
  // ---------------------------------------------------


  const options = {
    paginate,
    app
  };

  app.use('/user-abilities',createService(options));
  const service = app.service('user-abilities');
  
  service.hooks(hooks);

};
