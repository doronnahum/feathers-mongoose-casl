
const services = {
  userAbilities: require('./src/services/user-abilities/user-abilities.service'), // Get user abilities with userId and ServiceName - this service help dashboard to return relevant data
  dashboard: require('./src/services/dashboard/dashboard.service'), // Return array of object, is object is service with json schema.
  authManagement: require('./src/services/authmanagement/authmanagement.service'), // feathers-authentication-management
  users: require('./src/services/users/users.service'), // manage users (mongoose service)
  me: require('./src/services/me/me.service'), // allow the user to get and patch itself *must come after users
  rules: require('./src/services/rules/rules.service'), // manage rules (mongoose service)
  files: require('./src/services/files/files.service'), // allow user to upload files and record them on DB (mongoose service)
  uploads: require('./src/services/uploads/uploads.service'), // Upload files to s3/static folder (private service)
  sms: require('./src/services/sms/sms.service'), // feathers-twilio (private service)
  mailer: require('./src/services/mailer/mailer.service'), // feathers-mailer (private service)
  notifier: require('./src/services/authmanagement/notifier'), // Send email to client on rest password (private service)
  authentication: require('./src/authentication'), // '@feathersjs/authentication
  configureServices: function (app) {
    app.configure(services.users); // mongoose service to manage users collection
    app.configure(services.me); // / allow the user to get and patch itself *must come after users
    app.configure(services.authManagement); // handle user verify password, reset and more
    app.configure(services.rules); // mongoose service to manage rules collection
    app.configure(services.mailer); // used by notifier to send emails (Not exposed to the client)
    app.configure(services.notifier); // used by authManagement service to send the right email to the user to verify password, changed password message.(Not exposed to the client)
    app.configure(services.uploads); // uploads file to aws/google or to local folder.(Not exposed to the client)
    app.configure(services.files); // mongoose service to manage files collection, uploads files with upload service
    app.configure(services.dashboard); // A dashboard for managing your app
    app.configure(services.userAbilities); // Provides user permissions information
  }
};
module.exports = {
  // Hooks
  hooks: {
    validateAbilities: require('./src/hooks/abilities'), // Check for token, get rules and check abilities with casl
    sanitizedData: require('./src/hooks/sanitizedData'), // Filter fields from user request and from db response base abilities
    validateSchema: require('./src/hooks/validateSchema'), // Validate user request with joi
    rulesCache: require('./src/hooks/cache/rulesCache'), // Save rules in cache with @feathers-plus/cache, reset cache when rules changed
    parseRules: require('./src/hooks/parseRules'), //
    returnUserOnLogin: require('./src/hooks/authenticate/returnUserOnLogin'), // When user login/sign in return user data with token
    authenticate: require('./src/hooks/authenticate'), // authenticate check
    uploadsHooks: require('./src/hooks/uploads/uploadsHooks'), // uploadsHooks handle protectFile
    errorHandler: require('./src/hooks/errorHandler/errorHandler'), // errorHandler to make sure that errors get cleaned up before they go back to the client
    signFileAfterPopulate: require('./src/hooks/uploads/signFileAfterPopulate') // When you populate collection with protected files and you want to sign the files before you send them to  client
  },
  // Services
  services,
  createService: require('./src/utils/createService'), // feathers-mongoose wrapper  - create mongoose service
  createModelFromJoi: require('./src/utils/createModelFromJoi'), // joigoose wrapper - convert joi to mongoose schema
  joi2json: require('./src/utils/joi2json'), // joi2json wrapper - convert joi to jon schema
  Joi: require('./src/utils/joi.js'), // joi wrapper
  // Middleware
  uploadMiddleware: require('./src/utils/uploadMiddleware'),
  // helpers
  pick: require('./src/utils/pick'), // Pick fields from array with lodash.pick and with mongodb queries
  deletePropertyPath: require('./src/utils/helpers').deletePropertyPath, // Remove Property from object with deep support
  asyncForEach: require('./src/utils/helpers').asyncForEach, // map over array with async support
  setJoiInstance: require('./src/utils/helpers').setJoiInstance, // Set joi schema to let validateSchema useful to your customs service
  getJoiInstance: require('./src/utils/helpers').getJoiInstance, // validateSchema use this to find your joi schema
  addAuthenticationExampleToSwaggerDocs: require('./src/utils/helpers').addAuthenticationExampleToSwaggerDocs,
  joiCustomRules: require('./src/utils/helpers').joiCustomRules,
  callingParamsPersistUser: require('./src/utils/helpers').callingParamsPersistUser, //  When you call service method from hook and you want to persist user
  getSendgridEmailTemplateMail: require('./src/utils/helpers').getSendgridEmailTemplateMail,
  // Enums
  enums: require('./src/enums'),
  STORAGE_TYPES: require('./src/enums').STORAGE_TYPES,
  // Swaager
  swaggerServiceConfiguration: require('./src/utils/swaggerServiceConfiguration'), // Add more info about your service to swagger docs
  swaggerSchemaExamples: require('./src/utils/swaggerSchemaExamples'),
  modelToSwagger: require('./src/utils/modelToSwagger'), // mongoose-to-swagger wrapper- convert mongoose to swagger
};
