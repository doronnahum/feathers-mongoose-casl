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
 * @function getTokenFromCookie
 * @param {array} whiteList services end points to allow token from cookie
 * This help hasToken feathers-mongoose-casl/hooks/authenticate/index.js to find token from cookie
 * getTokenFromCookie(hook, ['docs', 'get-file']);
 */
function getTokenFromCookie(hook) {
  // hook.params.headers.authorization = 
  var rc = hook.params.headers && hook.params.headers.cookie;
  var list = {};
  rc && rc.split(';').forEach(function( cookie ) {
    var parts = cookie.split('=');
    list[parts.shift().trim()] = decodeURI(parts.join('='));
  });
  if(list['feathers-jwt']){
    hook.params.headers.authorization = list['feathers-jwt'];
    return list['feathers-jwt'];
  }
}

/**
 * @function asyncForEach
 * @param {*} array 
 * @param {*} callback
 * async for each function
 */
async function asyncForEach(array, callback) {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array);
  }
}

const setJoiInstance = function(app, serviceName, joiSchema){
  app.set(serviceName + 'getJoi', joiSchema);
};

const getJoiInstance = function(app, serviceName){
  return app.get(serviceName + 'getJoi');
};
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

const defineAbilitiesHelpers = {
  TYPE_KEY: Symbol.for('type'),
  ENABLE_ABILITY_FIELDS_KEY: Symbol.for('ability-fields'),
  POPULATE_WHITELIST_KEY: Symbol.for('populate-whitelist'),
  subjectName: function (subject) {
    if (!subject || typeof subject === 'string') {
      return subject;
    }
    return subject[defineAbilitiesHelpers.TYPE_KEY];
  },
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
  findRoleMatch: function({roles, userRoles}){
    let result = false;
    if(userRoles){
      result = userRoles.some(item => roles.includes(item));
    }
    return result;
  },
  /*
  compiledRulesTemplate
  convert [{author: {{ user._id }} }] to [{author: '5c4f44c3e9e159be92c7ce17' }]
  */
  compiledRulesTemplate: function(rules, data){
    var rulesString = JSON.stringify(rules);
    var compiled = nunjucks.renderString(rulesString, data);
    var obj = JSON.parse(compiled);
    return obj;
  },
  /**
   * @isSimpleAbilityFields
   * @param {*} fields 
   * return true if fields not include '*', {}
   * when the result is true we can let mongoose to handle to fields select
   * simple is string and not '*' or {}
   * ok only when all simple and not mix of inclusion and exclusion
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

module.exports = {
  deletePropertyPath,
  getTokenFromCookie,
  asyncForEach,
  setJoiInstance,
  getJoiInstance,
  addAuthenticationExampleToSwaggerDocs,
  defineAbilitiesHelpers,
  joiCustomRules,
  callingParamsPersistUser,
  getSendgridEmailTemplateMail
};