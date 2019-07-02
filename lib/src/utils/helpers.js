let nunjucks = require('nunjucks');
const sift = require('sift').default;

/**
 * @function deletePropertyPath
 * @description delete value from object with deep support
 * @param {object} obj
 * @param {string} path
 * @example
 * deletePropertyPath({user: {name: 'Dan', age: 33}}, 'user.age')
 */
const deletePropertyPath = function (obj, path) {
  if (!obj || !path) {
    return;
  }

  if (typeof path === 'string') {
    path = path.split('.');
  }

  for (var i = 0; i < path.length - 1; i++) {
    obj = obj[path[i]];

    if (typeof obj === 'undefined') {
      return;
    }
  }
  delete obj[path.pop()];
};

/**
 * @function asyncForEach
 * @description run async function for each item in the array
 * @param {array} array
 * @param {function} callback
 * @example
 * await asyncForEach([1,2,3], (item) => { await myFunc(item) })
 */
async function asyncForEach (array, callback) {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array);
  }
}

/**
 * @function setJoiInstance
 * @description This function will set a retrench of JOI schema in the app,
 * with this retrench we will validate the client request and build a dashboard screen
 * @param {object} app
 * @param {string} serviceName
 * @param {function} joiSchema
 * @example
 * const postsValidators = require('../validators/posts.validators.js');
 * setJoiInstance(app, 'posts', postsValidators)
 */
const setJoiInstance = function (app, serviceName, joiSchema) {
  app.set(serviceName + 'getJoi', joiSchema);
};

/**
 * @function getJoiInstance
 * @description This function will return as the retrench of JOI schema that set by the setJoiInstance
 * @param {object} app
 * @param {string} serviceName
 * @example
 * getJoiInstance(app, 'posts')
 */
const getJoiInstance = function (app, serviceName) {
  return app.get(serviceName + 'getJoi');
};

/**
 * @function addAuthenticationExampleToSwaggerDocs
 * @description Just for making swagger Authentication more clear
 * @param {object} app
 * @example
 * addAuthenticationExampleToSwaggerDocs(app)
 */
const addAuthenticationExampleToSwaggerDocs = function (app) {
  if (app.docs && app.docs.paths['/authentication']) {
    delete app.docs.paths['/authentication/{id}'];
    app.docs.paths['/authentication'].post.description = 'Login';
    app.docs.paths['/authentication'].post.parameters[0].schema = {
      type: 'object',
      properties: {
        strategy: { type: 'string', example: 'local' },
        email: { type: 'string', example: 'userEmail@gmail.com' },
        password: { type: 'string', example: 'password' }
      } };
  }
};

/**
 * @typedef {Function} CheckUserContext
 * @description This will return true by using [shift] to check user Context against user data
 * @property {Object} payload
 * @property {Object} payload.hook The feathers hook object
 * @property {Object} payload.user The user data
 * @property {Object} payload.userContext The userContext data
 * @example
 * checkUserContext({
  *  hook,
  *  user: {_id: 'A12345', email: 'd@gmail.com'},
  *  userContext: {email: { $ne: "d@gmail.com" }}
  * })
  */

/**
 * @typedef {Function} FindRoleMatch
 * @description this function will check the user roles against the roles and return boolean if user match one of the roles
 * @property {Object} payload
 * @property {Array} payload.userRoles The user roles array
 * @property {Array} payload.roles The roles array
 * @return {Boolean}
 * @example
 * findRoleMatch(['admin'],['sysadmin','admin']) === true
 * findRoleMatch(['manager'],['sysadmin','admin']) === false
  */

/**
 * @typedef {Function} CompiledRulesTemplate
 * @description Use [nunjucks] to compile templates
 * @property {Object} rule
 * @property {Object} data
 * @example
 * compiledRulesTemplate({author: {{ user._id }}, role: 'admin' }, {author: '5c4f44c3e9e159be92c717' }) === {author: '5c4f44c3e9e159be92c717', role: 'admin' }
 * @returns {Object}
 */

/**
   * @function isSimpleAbilityFields
   * @description return true when array included only simple string and all string are with '-' prefix or without prefix
   *
   * When rule contain a fields array,
   * We want to know if we can filter fields with mongoose select or we need to pick fields from the results aster the query
   * when the fields array include only string then we can use $select
   * but when the fields contain complex options like '*', or {}, we need to pick fields after the query
   * @param {*} fields
   * return true if fields not include '*', {}
   * examples:
   * --------------
   * isSimpleAbilityFields(['1','2']))// true
   * isSimpleAbilityFields(['1','4'], '3'))// true
   * isSimpleAbilityFields(['-5','-6']))// true
   * isSimpleAbilityFields(['-1','-8'], '-9'))// true
   * isSimpleAbilityFields(['-1','4'])) // false
   * isSimpleAbilityFields(['1','7'], '-1'))// false
   * isSimpleAbilityFields(['1','6'], '3 -5'))// false
   * isSimpleAbilityFields(['*','1']))// false
   * isSimpleAbilityFields(['*','1'], ' -2'))// false
   * isSimpleAbilityFields(['*',{name: 'Dan'}], '1 -1'))// false
   * isSimpleAbilityFields([{'-name': 'Dan'}]))// false
   */

/**
 * @typedef {Object} IsSimpleAbilityFields
 * @description return true when array of fields and select included only simple strings and all string are with '-' prefix or without prefix
 * @property {Array} fields
 * @property {Array} select
 * @example
 * isSimpleAbilityFields(['1','2']) === true;
 * isSimpleAbilityFields(['1','4'], ['3'])) === true;
 * isSimpleAbilityFields(['-5','-6'])) === true;
 * isSimpleAbilityFields(['-1','-8'], ['-9'])) === true;
 * isSimpleAbilityFields(['-1','4']))  === false;
 * isSimpleAbilityFields(['1','7'], ['-1'])) === false;
 * isSimpleAbilityFields(['*','1'])) === false;
 * @returns {Boolean}
 */

/**
 * @typedef {Object} DefineAbilitiesHelpers
 * @description This is a group of helpers that help us to handle user ability
 * @property {Symbol} TYPE_KEY private key that we used inside the hook.params
 * @property {Symbol} ENABLE_ABILITY_FIELDS_KEY private key that we used inside the hook.params
 * @property {Symbol} POPULATE_WHITELIST_KEY private key that we used inside the hook.params
 * @property {Symbol} SKIP_SANITIZED_DATA_AFTER_READ private key that we used inside the hook.params
 * @property {Function} subjectName copy from https://blog.feathersjs.com/authorization-with-casl-in-feathersjs-app-fd6e24eefbff
 * @property {CheckUserContext} checkUserContext
 * @property {FindRoleMatch} findRoleMatch
 * @property {CompiledRulesTemplate} compiledRulesTemplate
 * @property {IsSimpleAbilityFields} isSimpleAbilityFields
 */

const defineAbilitiesHelpers = {
  TYPE_KEY: Symbol.for('type'),
  ENABLE_ABILITY_FIELDS_KEY: Symbol.for('ability-fields'),
  POPULATE_WHITELIST_KEY: Symbol.for('populate-whitelist'),
  SKIP_SANITIZED_DATA_AFTER_READ: Symbol.for('skip-sanitized-data-after-read'),
  subjectName: function (subject) {
    if (!subject || typeof subject === 'string') {
      return subject;
    }
    return subject[defineAbilitiesHelpers.TYPE_KEY];
  },
  checkUserContext: function (payload) {
    const { hook, user, userContext } = payload;
    const _sift = sift(userContext);
    let result = false;
    try {
      user._id = user._id.toString();
      result = _sift(user);
    } catch (error) {
      hook.app.error('feathers-mongoose-casl - failed to checkUserContext');
    }
    return result;
  },
  findRoleMatch: function (payload) {
    const { roles, userRoles } = payload;
    let result = false;
    if (userRoles) {
      result = userRoles.some(item => roles.includes(item));
    }
    return result;
  },
  compiledRulesTemplate: function (rule, data) {
    var rulesString = JSON.stringify(rule);
    var compiled = nunjucks.renderString(rulesString, data);
    var obj = JSON.parse(compiled);
    return obj;
  },
  isSimpleAbilityFields: function (fields, select) {
    if (!fields) return true;
    let isNegative = null;
    let isMixing = false;
    if (select) {
      const selectFields = select;
      selectFields.forEach(item => {
        const _isNegative = item[0] === '-';
        if (isNegative !== null && isNegative !== _isNegative) isMixing = true;
        if (isMixing) return;
        isNegative = _isNegative;
      });
    }
    if (isMixing) return false;
    if (isNegative) {
      const isAllFieldsNegative = !fields.some(item => item[0] !== '-');
      return isAllFieldsNegative;
    } else {
      if (select) {
        const isAllFieldsAreSimpleAndPositive = !fields.some(item => (item === '*' || typeof item === 'object' || item[0] === '-'));
        return isAllFieldsAreSimpleAndPositive;
      } else {
        let isPositive = null;
        let testResult = true;
        fields.forEach(field => {
          const isSimple = field !== '*' && typeof field !== 'object';
          if (!isSimple) testResult = false;
          if (testResult === false) return;
          const _isPositive = field[0] !== '-';
          if (isPositive !== null && _isPositive !== isPositive) testResult = false;
          if (testResult === false) return;
          isPositive = _isPositive;
        });
        return testResult;
      }
    }
  }
};

/**
 * @typedef {Object} JoiCustomRules
 * @description This is a object of joi custom rules
 * @property {Symbol} stringify check if string is result of JSON.stringify({})
 */
const joiCustomRules = {
  stringify: function (joi) {
    return {
      name: 'string',
      base: joi.string(),
      language: {
        stringify: 'must be a valid JSON.stringify({})'
      },
      rules: [{
        name: 'stringify',
        validate (params, value, state, options) {
          let isValid = true;
          if (value && value.length > 0) {
            try {
              const isObj = typeof JSON.parse(value) === 'object';
              if (!isObj) isValid = false;
            } catch (error) {
              isValid = false;
            }
          }
          if (!isValid) return this.createError('string.stringify', { value }, state, options);
          else {
            return value;
          }
        }
      }]
    };
  }
};

/**
 * @function callingParamsPersistUser
 * @description Use it when you want to make request from server with the current client abilities,
 * It will persist provider user headers authenticated
 * @param {Object} params The feathers params object
 * @param {object} newParams Object to merge into current params
 * @example
 * app.service('posts').get('someId', callingParamsPersistUser(hook, {'someKey': 'someValue'}));
 */
const callingParamsPersistUser = function (params, newParams) {
  /**
   * until 1.8.4 the first attribute was hook object and not parsm
   */
  const isHook = params && params.path;
  if (isHook) {
    // eslint-disable-next-line no-console
    console.warn('feathers-mongoose-casl > callingParamsPersistUser function - please stop passing hook at first attribute, need to pass only the params');
  }
  const _params = isHook ? params : { params }; // only to support previous versions
  return Object.assign({}, {
    provider: _params.params.provider,
    headers: _params.params.headers,
    authenticated: _params.params.authenticated,
    user: _params.params.user
  }, newParams);
};

/**
 *
 * @function getSendgridEmailTemplateMail
 * @description build mail data to [mailer] for send a email with [sendgrid] templates [https://sendgrid.com/dynamic_templates]
 * @param {object} payload
 * @param {string} payload.from Email.from
 * @param {string} payload.to Email.to
 * @param {object} payload.data Email data for the template
 * @param {string} payload.templateId sendgrid templateId
 */
const getSendgridEmailTemplateMail = function (payload) {
  const { from, to, data, templateId } = payload;
  return {
    'from': {
      'email': from
    },
    'personalizations': [
      {
        'to': [
          {
            'email': to
          }
        ],
        'dynamic_template_data': data
      }
    ],
    'template_id': templateId
  };
};

/**
 * @function cloneObject
 * @description return new instance to an object
 * @param {Object} obj - Object to clone
 * @returns {Object} Cloned object
 */
var cloneObject = function cloneObject (obj) {
  var obj1 = obj;

  if (typeof obj.toJSON === 'function' || typeof obj.toObject === 'function') {
    try {
      JSON.stringify(Object.assign({}, obj1));
    } catch (e) {
      obj1 = obj1.toJSON ? obj1.toJSON() : obj1.toObject();
    }
  }

  return Object.assign({}, obj1);
};

/**
 * @function sanitizeUserForClient
 * @description Remove protected fields from user
 * used by authmanagement.service.js
 * @param {object} user
 * @example
 * sanitizeUserForClient(userData)
 * @returns {Object} user object without the protected fields
 */
var sanitizeUserForClient = function sanitizeUserForClient (user) {
  var user1 = cloneObject(user);

  delete user1.password;
  delete user1.verifyExpires;
  delete user1.verifyToken;
  delete user1.verifyShortToken;
  delete user1.verifyChanges;
  delete user1.resetExpires;
  delete user1.resetToken;
  delete user1.resetShortToken;
  delete user1.roles;

  return user1;
};

module.exports = {
  deletePropertyPath,
  asyncForEach,
  setJoiInstance,
  getJoiInstance,
  addAuthenticationExampleToSwaggerDocs,
  defineAbilitiesHelpers,
  joiCustomRules,
  callingParamsPersistUser,
  getSendgridEmailTemplateMail,
  sanitizeUserForClient
};
