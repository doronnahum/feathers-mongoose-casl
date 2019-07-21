const enums = require('../../../enums');
const UPLOAD_SERVICES = enums.UPLOAD_SERVICES;


const validateConfiguration = function (config) {

  const {
    app,
    serviceName,
    storageService,
  } = config;

  const fmcUploadConfig = app.get('feathers-mongoose-casl').uploads;

  if(!fmcUploadConfig) throw new Error('feathers-mongoose-casl - uploadMiddleware - missing feathers-mongoose-casl.uploads in config/default.json');
  if(!fmcUploadConfig.services) throw new Error('feathers-mongoose-casl - uploadMiddleware - missing feathers-mongoose-casl.uploads.services in config/default.json');

  /**
   * validate that uploadServiceName is valid
   */
  const uploadServiceName = UPLOAD_SERVICES[storageService];
  const uploadService = app.service(uploadServiceName);
  if (!uploadServiceName) {
    throw new Error('feathers-mongoose-casl - uploadMiddleware - storageService need to be onOf ' + Object.keys(UPLOAD_SERVICES).join(','));
  }

  /**
   * Validate that app include this service
   */
  if (!uploadService) {
    if(!fmcUploadConfig.services[storageService]){
      throw new Error(`
      feathers-mongoose-casl - uploadMiddleware - yur forggot to allow ${storageService} in the  feathers-mongoose-casl.uploads.services in config/default.json
      `);
    }else{
      throw new Error(`
      feathers-mongoose-casl - uploadMiddleware - this ${uploadServiceName} service is not found
      please check that is your app service you configuration feathers-mongoose-casl upload service before ${serviceName},
      `);
    }
  }


};

module.exports = validateConfiguration;