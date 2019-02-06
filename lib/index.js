const _sanitizedData = require('./hooks/sanitizedData.hook');

const authenticate = require('./hooks/authenticate/authenticate.hook');
const abilities = require('./hooks/abilities/abilities.hook');

const _validateSchema = require('./hooks/abilities/validateSchema.hook');

const createModelFromJoi = require('./utils/createModelFromJoi');

const modelToSwagger = require('./utils/modelToSwagger.util');
const authentication = require('./authentication');


const { when } = require('feathers-hooks-common');
const {SERVICES_TO_SKIP_VALIDATE} = require('./enums');

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

module.exports = {
  createModelFromJoi,
  modelToSwagger,
  authentication,
  // Hooks
  hooks: {
    validateAbilities,
    sanitizedData,
    validateSchema,
  },
  // Services
  services: {
    userAbilities: require('./services/user-abilities/user-abilities.service'),
    authManagement: require('./services/authmanagement/authmanagement.service'),
    accountService: require('./services/authmanagement/notifier'),
    dashboard: require('./services/dashboard/dashboard.service'),
    users: require('./services/users/users.service'),
    uploads: require('./services/uploads/uploads.service'),
    sms: require('./services/sms/sms.service'),
    roles: require('./services/roles/roles.service'),
    mailer: require('./services/mailer/mailer.service')
  }
};


// const removeUserProtectedFields = require('./hooks/abilities/removeUserProtectedFields.hook');
// const rolesCache = require('./hooks/cache/rolesCache.hook');
// const usersCache = require('./hooks/cache/usersCache.hook');
// const {
//   deletePropertyPath,
//   compiledRolesTemplate,
//   swaggerAuthenticationCookie,
//   asyncForEach
// } = require('./utils/helpers');
// const joi2json = require('./utils/joi2json');
// const pick = require('./utils/pick');
//deletePropertyPath,
//compiledRolesTemplate,
//swaggerAuthenticationCookie,
//asyncForEach,
//joi2json,
//pick,
//rolesCache,
//usersCache,
//authenticate,
//abilities,
//removeUserProtectedFields,