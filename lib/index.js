const { when } = require('feathers-hooks-common');
const {SERVICES_TO_SKIP_VALIDATE} = require('./enums');
const authentication = require('./authentication');

// helpers
const {
  deletePropertyPath,
  compiledRolesTemplate,
  swaggerAuthenticationCookie,
  asyncForEach,
  setJoiInstance,
  getJoiInstance,
  addAuthenticationSwaggerDocs
} = require('./utils/helpers');
const createModelFromJoi = require('./utils/createModelFromJoi');
const modelToSwagger = require('./utils/modelToSwagger');
const createService = require('./utils/createService');
const returnUserOnLogin = require('./hooks/authenticate/returnUserOnLogin.hook');

const Joi = require('./utils/Joi');
const joi2json = require('./utils/joi2json');
const pick = require('./utils/pick');
// -------------------------------------------------------------------------

// hooks
const _sanitizedData = require('./hooks/sanitizedData.hook');
const authenticate = require('./hooks/authenticate/authenticate.hook');
const abilities = require('./hooks/abilities/abilities.hook');
const _validateSchema = require('./hooks/abilities/validateSchema.hook');
const validateAbilities = when(
  hook => hook.params.provider &&
  (`/${hook.path}` !== hook.app.get('authentication').path),
  authenticate, 
  abilities.hook, // Checks whether the client has permission
  _sanitizedData(SERVICES_TO_SKIP_VALIDATE) // Remove fields that block by roles from data before Create/Update
);
const sanitizedData = when(
  hook => hook.params.provider,
  _sanitizedData(SERVICES_TO_SKIP_VALIDATE) // Remove fields that blocked by the roles from data before sending to client
);
const validateSchema = when(
  hook => hook.params.provider,
  _validateSchema(SERVICES_TO_SKIP_VALIDATE) // Remove fields that blocked by the roles from data before sending to client
);
const removeUserProtectedFields = require('./hooks/abilities/removeUserProtectedFields.hook');
const rolesCache = require('./hooks/cache/rolesCache.hook');
const usersCache = require('./hooks/cache/usersCache.hook');
// -------------------------------------------------------------------------






module.exports = {
  createService,
  createModelFromJoi,
  modelToSwagger,
  authentication,

  // Hooks
  hooks: {
    validateAbilities,
    sanitizedData,
    validateSchema,
    rolesCache,
    usersCache,
    abilities,
    removeUserProtectedFields,
    returnUserOnLogin
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
    roles: require('./services/roles/roles.service'),
    mailer: require('./services/mailer/mailer.service'),
    files: require('./services/files/files.service')
  },
  // helpers
  deletePropertyPath,
  compiledRolesTemplate,
  swaggerAuthenticationCookie,
  asyncForEach,
  setJoiInstance,
  getJoiInstance,
  Joi,
  joi2json,
  pick,
  addAuthenticationSwaggerDocs,
  enum: {
    SERVICES_TO_SKIP_VALIDATE
  }
};