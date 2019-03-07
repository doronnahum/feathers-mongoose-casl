
const services = {
  userAbilities: require('./services/user-abilities/user-abilities.service'), // Get user abilities with userId and ServiceName - this service help dashboard to return relevant data
  dashboard: require('./services/dashboard/dashboard.service'), // Return array of object, is object is service with json schema.
  authManagement: require('./services/authmanagement/authmanagement.service'), // feathers-authentication-management
  users: require('./services/users/users.service'), // manage users (mongoose service)
  rules: require('./services/rules/rules.service'), // manage rules (mongoose service)
  files: require('./services/files/files.service'), // allow user to upload files and record them on DB (mongoose service)
  uploads: require('./services/uploads/uploads.service'), // Upload files to s3/static folder (private service)
  sms: require('./services/sms/sms.service'), // feathers-twilio (private service)
  mailer: require('./services/mailer/mailer.service'), // feathers-mailer (private service)
  notifier: require('./services/authmanagement/notifier'), // Send email to client on rest password (private service)
  authentication: require('./authentication'), // '@feathersjs/authentication
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
    validateAbilities: require('./hooks/abilities'), // Check for token, get rules and check abilities with casl
    sanitizedData: require('./hooks/sanitizedData'), // Filter fields from user request and from db response base abilities
    validateSchema: require('./hooks/validateSchema'), // Validate user request with joi
    rulesCache: require('./hooks/cache/rulesCache'), // Save rules in cache with @feathers-plus/cache, reset cache when rules changed
    usersCache: require('./hooks/cache/usersCache'), // Save users in cache with @feathers-plus/cache, reset cache when rules changed
    returnUserOnLogin: require('./hooks/authenticate/returnUserOnLogin'), // When user login/sign in return user data with token
    getUserFromParams: require('./hooks/getUserFromParams'), // Find user in params, helpful to 
    protectFile: require('./hooks/protectFile'), // Protect s3 files
  },
  // Services
  services,
  createService: require('./utils/createService'), // feathers-mongoose wrapper  - create mongoose service
  createModelFromJoi: require('./utils/createModelFromJoi'), // joigoose wrapper - convert joi to mongoose schema
  modelToSwagger: require('./utils/modelToSwagger'), // mongoose-to-swagger wrapper- convert mongoose to swagger
  joi2json: require('./utils/joi2json'), // joi2json wrapper - convert joi to jon schema
  Joi: require('./utils/Joi'), // joi wrapper
  enums: require('./enums'),
  createUploadMiddleware: require('./utils/createUploadMiddleware'),
  // helpers
  pick: require('./utils/pick'), // Pick fields from array with lodash.pick and with mongodb queries
  deletePropertyPath: require('./utils/helpers').deletePropertyPath, // Remove Property from object with deep support
  getTokenFromCookie: require('./utils/helpers').getTokenFromCookie, // Find token from cookie, helpful when user cant pass token in the header
  asyncForEach: require('./utils/helpers').asyncForEach, // map over array with async support
  setJoiInstance: require('./utils/helpers').setJoiInstance, // Set joi schema to let validateSchema useful to your customs service
  getJoiInstance: require('./utils/helpers').getJoiInstance, // validateSchema use this to find your joi schema
  addAuthenticationExampleToSwaggerDocs: require('./utils/helpers').addAuthenticationExampleToSwaggerDocs, 
  joiCustomRules: require('./utils/helpers').joiCustomRules,
};