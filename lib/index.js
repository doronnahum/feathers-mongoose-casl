
module.exports = {
  enums: require('./enums'),
  createService: require('./utils/createService'),
  createModelFromJoi: require('./utils/createModelFromJoi'),
  modelToSwagger: require('./utils/modelToSwagger'),
  authentication: require('./authentication'),

  // Hooks
  hooks: {
    validateAbilities: require('./hooks/abilities'),
    sanitizedData: require('./hooks/sanitizedData'),
    validateSchema: require('./hooks/validateSchema'),
    rulesCache: require('./hooks/cache/rulesCache'),
    usersCache: require('./hooks/cache/usersCache'),
    removeUserProtectedFields: require('./hooks/removeUserProtectedFields'),
    returnUserOnLogin: require('./hooks/authenticate/returnUserOnLogin'),
    getUserFromParams: require('./hooks/getUserFromParams'),
  },
  // Services
  services: {
    userAbilities: require('./services/user-abilities/user-abilities.service'),
    authManagement: require('./services/authmanagement/authmanagement.service'),
    notifier: require('./services/authmanagement/notifier'),
    dashboard: require('./services/dashboard/dashboard.service'),
    users: require('./services/users/users.service'),
    uploads: require('./services/uploads/uploads.service'),
    sms: require('./services/sms/sms.service'),
    rules: require('./services/rules/rules.service'),
    mailer: require('./services/mailer/mailer.service'),
    files: require('./services/files/files.service')
  },
  Joi: require('./utils/Joi'),
  joi2json: require('./utils/joi2json'),
  pick: require('./utils/pick'),
  createUploadMiddleware: require('./utils/createUploadMiddleware'),
  // helpers
  deletePropertyPath: require('./utils/helpers').deletePropertyPath,
  getTokenFromCookie: require('./utils/helpers').getTokenFromCookie,
  asyncForEach: require('./utils/helpers').asyncForEach,
  setJoiInstance: require('./utils/helpers').setJoiInstance,
  getJoiInstance: require('./utils/helpers').getJoiInstance,
  addAuthenticationSwaggerDocs: require('./utils/helpers').addAuthenticationSwaggerDocs,
  joiCustomRules: require('./utils/helpers').joiCustomRules,
};