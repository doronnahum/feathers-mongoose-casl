
const services = {
  userAbilities: require('./src/services/user-abilities/user-abilities.service'), // Get user abilities with userId and ServiceName - this service help dashboard to return relevant data
  dashboard: require('./src/services/dashboard/dashboard.service'), // Return array of object, is object is service with json schema.
  authManagement: require('./src/services/authmanagement/authmanagement.service'), // feathers-authentication-management
  users: require('./src/services/users/users.service'), // manage users (mongoose service)
  rules: require('./src/services/rules/rules.service'), // manage rules (mongoose service)
  files: require('./src/services/files/files.service'), // allow user to upload files and record them on DB (mongoose service)
  uploads: require('./src/services/uploads/uploads.service'), // Upload files to s3/static folder (private service)
  sms: require('./src/services/sms/sms.service'), // feathers-twilio (private service)
  mailer: require('./src/services/mailer/mailer.service'), // feathers-mailer (private service)
  notifier: require('./src/services/authmanagement/notifier'), // Send email to client on rest password (private service)
  authentication: require('./src/authentication'), // '@feathersjs/authentication
  configureServices: function(app) {
    app.configure(services.authManagement);
    app.configure(services.dashboard);
    app.configure(services.mailer);
    app.configure(services.notifier);
    app.configure(services.uploads);
    // app.configure(services.sms);
    app.configure(services.rules);
    app.configure(services.files);
    app.configure(services.mailer);
    app.configure(services.userAbilities);
    app.configure(services.users);
  }
}
module.exports = {
  // Hooks
  hooks: {
    validateAbilities: require('./src/hooks/abilities'), // Check for token, get rules and check abilities with casl
    sanitizedData: require('./src/hooks/sanitizedData'), // Filter fields from user request and from db response base abilities
    validateSchema: require('./src/hooks/validateSchema'), // Validate user request with joi
    rulesCache: require('./src/hooks/cache/rulesCache'), // Save rules in cache with @feathers-plus/cache, reset cache when rules changed
    usersCache: require('./src/hooks/cache/usersCache'), // Save users in cache with @feathers-plus/cache, reset cache when rules changed
    returnUserOnLogin: require('./src/hooks/authenticate/returnUserOnLogin'), // When user login/sign in return user data with token
    getUserFromParams: require('./src/hooks/getUserFromParams'), // Find user in params, helpful to 
    authenticate: require('./src/hooks/authenticate'), // authenticate check
    uploadsHooks: require('./src/hooks/uploads/uploadsHooks'), // uploadsHooks handle protectFile
    
  },
  // Services
  services,
  createService: require('./src/utils/createService'), // feathers-mongoose wrapper  - create mongoose service
  createModelFromJoi: require('./src/utils/createModelFromJoi'), // joigoose wrapper - convert joi to mongoose schema
  modelToSwagger: require('./src/utils/modelToSwagger'), // mongoose-to-swagger wrapper- convert mongoose to swagger
  joi2json: require('./src/utils/joi2json'), // joi2json wrapper - convert joi to jon schema
  Joi: require('./src/utils/joi.js'), // joi wrapper
  enums: require('./src/enums'),
  uploadMiddleware: require('./src/utils/uploadMiddleware'),
  // helpers
  pick: require('./src/utils/pick'), // Pick fields from array with lodash.pick and with mongodb queries
  deletePropertyPath: require('./src/utils/helpers').deletePropertyPath, // Remove Property from object with deep support
  getTokenFromCookie: require('./src/utils/helpers').getTokenFromCookie, // Find token from cookie, helpful when user cant pass token in the header
  asyncForEach: require('./src/utils/helpers').asyncForEach, // map over array with async support
  setJoiInstance: require('./src/utils/helpers').setJoiInstance, // Set joi schema to let validateSchema useful to your customs service
  getJoiInstance: require('./src/utils/helpers').getJoiInstance, // validateSchema use this to find your joi schema
  addAuthenticationExampleToSwaggerDocs: require('./src/utils/helpers').addAuthenticationExampleToSwaggerDocs, 
  joiCustomRules: require('./src/utils/helpers').joiCustomRules,
  callingParamsPersistUser: require('./src/utils/helpers').callingParamsPersistUser, //  When you call service method from hook and you want to persist user
  getSendgridEmailTemplateMail:  require('./src/utils/helpers').getSendgridEmailTemplateMail,
  STORAGE_TYPES: require('./src/enums').STORAGE_TYPES
};