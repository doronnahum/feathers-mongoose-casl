let nunjucks = require('nunjucks');
const sift = require('sift').default;

/**
 * @function deletePropertyPath
 * @param {object} obj {user: {name: 'Dor'}}
 * @param {string} path 'user.name'
 * delete value from object with deep support 
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
 * @param {*} array 
 * @param {*} callback
 * async for each function
 * asyncForEach([1,2,3], (item) => { await myFunc(item) })
 */
async function asyncForEach(array, callback) {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array);
  }
}

/**
 * @function setJoiInstance
 * This function will set a retrench of JOI schema in the app,
 * with this retrench we will validate the client request and build a dashboard screen
 * @param {*} app 
 * @param {*} serviceName 
 * @param {*} joiSchema 
 */
const setJoiInstance = function(app, serviceName, joiSchema){
  app.set(serviceName + 'getJoi', joiSchema);
};

/**
 * @function getJoiInstance
 * This function will return as the retrench of JOI schema that set by the setJoiInstance
 * @param {*} app 
 * @param {*} serviceName 
 */
const getJoiInstance = function(app, serviceName){
  return app.get(serviceName + 'getJoi');
};


/**
 * @function addAuthenticationExampleToSwaggerDocs
 * Just for making swagger Authentication more clear
 * @param {*} app 
 */
const addAuthenticationExampleToSwaggerDocs = function(app){
  if(app.docs && app.docs.paths['/authentication']){
    delete app.docs.paths['/authentication/{id}'];
    app.docs.paths['/authentication'].post.description = 'Login';
    app.docs.paths['/authentication'].post.parameters[0].schema = {
      type: 'object',
      properties: { 
        strategy: { type: 'string', example: 'local' },
        email: { type: 'string', example: 'userEmail@gmail.com' },
        password: { type: 'string', example: 'password' }
      }};
  }
};

/**
 * 
 * defineAbilitiesHelpers
 * -------------------------
 * This is a group of helpers that help us to handle user ability
 * 
 */ 
const defineAbilitiesHelpers = {
  TYPE_KEY: Symbol.for('type'), // private key that we used inside the hook.params
  ENABLE_ABILITY_FIELDS_KEY: Symbol.for('ability-fields'), // private key that we used inside the hook.params
  POPULATE_WHITELIST_KEY: Symbol.for('populate-whitelist'), // private key that we used inside the hook.params
  subjectName: function (subject) { // Copy from https://blog.feathersjs.com/authorization-with-casl-in-feathersjs-app-fd6e24eefbff
    if (!subject || typeof subject === 'string') {
      return subject;
    }
    return subject[defineAbilitiesHelpers.TYPE_KEY];
  },
  /**
   * @function checkUserContext
   * checkUserContext will used sift,
   * sift - validate objects & filter arrays with mongodb queries..https://github.com/crcn/sift.js
   * checkUserContext({hook, ruleId, {_id: 'A1dkld', email: 'd@gmail.com'}, {email: { $ne: "d@gmail.com" }}})
   * 
   * @param {*} param0 
   */
  checkUserContext: function({hook, ruleId, user, userContext}){
    const _sift = sift(userContext);
    let result = false;
    try {
      user._id = user._id.toString();
      result = _sift(user);
    } catch (error) {
      hook.app.error('feathers-mongoose-casl - failed to checkUserContext, id:  ', {ruleId});
    }
    return result;
  },
  /**
   * @function findRoleMatch
   * findRoleMatch will return rules that match user roles
   * @param {*} param0 
   */
  findRoleMatch: function({roles, userRoles}){
    let result = false;
    if(userRoles){
      result = userRoles.some(item => roles.includes(item));
    }
    return result;
  },
  /**
   * @function compiledRulesTemplate
   * Use nunjucks to convert [{author: {{ user._id }} }] to [{author: '5c4f44c3e9e159be92c7ce17' }]
   * @param {*} rules 
   * @param {*} data 
   */
  compiledRulesTemplate: function(rules, data){
    var rulesString = JSON.stringify(rules);
    var compiled = nunjucks.renderString(rulesString, data);
    var obj = JSON.parse(compiled);
    return obj;
  },
  /**
   * @function isSimpleAbilityFields
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
   * isSimpleAbilityFields(['*',{name: 'doron'}], '1 -1'))// false
   * isSimpleAbilityFields([{'-name': 'doron'}]))// false
   */
  isSimpleAbilityFields: function(fields, select){
    let isNegative = null;
    let isMixing = false;
    if(select){
      const selectFields = select.split(' ');
      selectFields.forEach(item => {
        const _isNegative =  item[0] === '-';
        if(isNegative !== null && isNegative !== _isNegative) isMixing = true;
        if(isMixing) return;
        isNegative = _isNegative;
      });
    }
    if(isMixing) return false;
    if(isNegative){
      const isAllFieldsNegative = !fields.some(item => item[0] !== '-');
      return isAllFieldsNegative;
    }else{
      if(select){
        const isAllFieldsAreSimpleAndPositive = !fields.some(item => (item === '*' || typeof item === 'object' || item[0] === '-'));
        return isAllFieldsAreSimpleAndPositive;
      }else{
        let isPositive = null;
        let testResult = true;
        fields.forEach(field => {
          const isSimple = field !== '*' && typeof field !== 'object';
          if(!isSimple) testResult = false;
          if(testResult === false) return;
          const _isPositive = field[0] !== '-';
          if(isPositive !== null && _isPositive !== isPositive) testResult = false;
          if(testResult === false) return;
          isPositive = _isPositive;
        });
        return testResult;
      }
    }
  }
};


/**
 * @ joiCustomRules
 * Use this rule if you want to check if string is a valid stringify
 * How to use?
 * const _Joi = require('../../utils/joi');
 * const {joiCustomRules} = require('../../utils/helpers');
 * const Joi = _Joi.extend(joiCustomRules.stringify);
 */
const joiCustomRules = {
  stringify: function (joi) {  // We need this to convert validate a string Object
    return {
      name: 'string',
      base: joi.string(),
      language: {
        stringify: 'must be a valid JSON.stringify({})'
      },
      rules: [{
        name: 'stringify',
        validate(params, value, state, options) {
          let isValid = true;
          if(value && value.length > 0){
            try {
              const isObj = typeof JSON.parse(value) === 'object';
              if(!isObj) isValid = false;
            } catch (error) {
              isValid = false;
            }
          }
          if(!isValid) return this.createError('string.stringify', { value }, state, options);
          else{
            return value;
          }
        }
      }]
    };
  }
};

/**
 * @function callingParamsPersistUser
 * Use it when you want to make request from server with the current client abilities,
 * It will persist provider user headers authenticated
 */
const callingParamsPersistUser = function(hook, newParams){
  return Object.assign({}, {
    provider: hook.params.provider,
    headers: hook.params.headers,
    authenticated: hook.params.authenticated,
    user: hook.params.user
  }, newParams);
};

/**
 * 
 * @function getSendgridEmailTemplateMail
 * return data to mailer , when you want to use a template from sendgrid, https://sendgrid.com/dynamic_templates
 */
const getSendgridEmailTemplateMail = function({from, to,data, templateId}){
  return {
    'from':{
      'email': from
    },
    'personalizations':[
      {
        'to':[
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
 * Returns new object with values cloned from the original object. Some objects
 * (like Sequelize or MongoDB model instances) contain circular references
 * and cause TypeError when trying to JSON.stringify() them. They may contain
 * custom toJSON() or toObject() method which allows to serialize them safely.
 * Object.assign() does not clone these methods, so the purpose of this method
 * is to use result of custom toJSON() or toObject() (if accessible)
 * for Object.assign(), but only in case of serialization failure.
 *
 * @param {Object?} obj - Object to clone
 * @returns {Object} Cloned object
 */
var cloneObject = function cloneObject(obj) {
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
 * @param {*} user 
 * used by authmanagement.service.js to remove protected fields from user
 */
var sanitizeUserForClient = function sanitizeUserForClient(user) {
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