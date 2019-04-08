// abilities.js
// https://blog.feathersjs.com/authorization-with-casl-in-feathersjs-app-fd6e24eefbff
// abilities is run before each request, apply inside src/app.hooks.js
// run after authenticate that validate user from headers
// when user or anonymous user make request me make sure he have the right rules
// rules can be hard coded in this file or came from server
// 3 types of rules-
//   1- public - rules that apply to everyone
//   2- private - rules that apply for only user with pointer to this rules
//   3- blocked - this rules are included user id and can block user rules or block the user.
// examples of rules
// {"name": "find me", "actions": ["read"], "type": "public", "subject": ["me"], "conditions": { "_id": "{{ user._id }}" } },
// {"name": "allow sing-up", "actions": ["create"], "type": "public", "subject": ["users"] },
// {"name": "allow resetPassword, verifyPassword", "actions": ["create"], "type": "public", "subject": ["authManagement"] },
// {"name": "temporary, for first user", "actions": ["manage"], "subject": ["all"]}

 
/* eslint-disable quotes */
const { Ability } = require('@casl/ability');
const { toMongoQuery } = require('@casl/mongoose');
const { Forbidden } = require('@feathersjs/errors');
const TYPE_KEY = Symbol.for('type');
const defineAbilities = require('./helpers/defineAbilities');
const _getUser = require('./helpers/getUser');
const _getRules = require('./helpers/getRules');
const mockTestHelpers = require('./helpers/mockTestHelpers');

const isProduction = process.env.NODE_ENV === "production";

Ability.addAlias('update', 'patch');
Ability.addAlias('read', ['get', 'find']);
Ability.addAlias('delete', 'remove');

const abilities = async function(hook, name, method, testMode, userIdForTest, getRules = _getRules, getUser = _getUser) {
  try {
    const action = method || hook.method; // find,get,update,remove,create
    const service = name ? hook.app.service(name) : hook.service; // posts,rules...
    const model = service.options && service.options.Model && service.options.Model;
    const skipAbilitiesCheck = service.options &&  service.options.skipAbilitiesCheck;
    if(skipAbilitiesCheck){
      if(skipAbilitiesCheck === true || skipAbilitiesCheck.includes(action)) {
        hook.app.debug('feathers-mongoose-casl - abilities hook - skip abilities by service.options.skipAbilitiesCheck', {action, name, options: service.options});
        return hook;
      };
    }
    const serviceName = name || hook.path;
    if(testMode){
      hook.app.debug('feathers-mongoose-casl - abilities hook - start abilities process for testMode', {action, serviceName});
    }else{
      hook.app.debug('feathers-mongoose-casl - abilities hook - start abilities process', {action, serviceName});
    }
    

    // --------- Find user ------------
    // find user from Cache/DB
    hook.app.debug('feathers-mongoose-casl - abilities hook - get user start');
    const {user, hasUser} = await getUser({hook, allowUserFromCache: true, testMode,userIdForTest});
    hook.app.debug('feathers-mongoose-casl - abilities hook - get user end', {hasUser, userId: hasUser ? user._id : null});
    // --------------------------------
    
    
    // --------- Find Rules ------------
    // find rules from Cache/DB
    hook.app.debug('feathers-mongoose-casl - abilities hook - get rules start');
    const {rulesFromDb, defaultRules, rulesFromConfig, rulesFromServiceOptions} = await getRules({hook, serviceName});
    hook.app.debug(
      'feathers-mongoose-casl - abilities hook - get rule end',
      {
        rulesFromDb: rulesFromDb ? rulesFromDb.length : 0,
        defaultRules: defaultRules ? defaultRules.length : 0,
        rulesFromServiceOptions: rulesFromServiceOptions ? rulesFromServiceOptions.length : 0,
        rulesFromConfig: rulesFromConfig ? rulesFromConfig.length : 0,
      });
    // --------------------------------

    // --------- Define Abilities ------------
    // compiledRulesTemplate with user data:
    // from [{action: ['read', "conditions": {  "author": "{{ user._id }}" } ]}]
    // to   [{action: ['read', "conditions": {  "author": "a343dd9" } ]}]
    const ability = defineAbilities({hook, hasUser, user, rulesFromDb, defaultRules, rulesFromConfig, rulesFromServiceOptions, testMode});
    hook.app.debug('feathers-mongoose-casl - abilities hook - defineAbilities end', {action, serviceName});
    // --------------------------------


    // --------- Create Test ability function ------------
    // this function will call and throw an error that block user with missing ability to is a request
    const id = hook.id ? hook.id : '';
    const throwUnlessCan = (action, resource) => {
      if (ability.cannot(action, resource)) {
        hook.app.debug('feathers-mongoose-casl - abilities hook - user not allowed', {action, serviceName});
        throw new Forbidden(`You are not allowed to ${action} ${id} ${serviceName}`);
      }
    };
    // --------------------------------

  
    // --------- Accessible Fields By ------------
    // we want to expose this into params to let sanitizedData.hook the right info to filter fields from the request or from the response
    hook.params = hook.params || {};
    hook.params.ability = ability;
    if(model && model.accessibleFieldsBy){
      hook.params.abilityFields = model.accessibleFieldsBy(ability, action);
    }
    // --------------------------------


    // --------- Test mode ------------
    // when test mode is true we catch the error from the ability function, throwUnlessCan()
    // because this is not a real request is only a check ability and we want only to check ability
    // we used this option from the user-abilities service
    if(testMode) {
      if(!hook.data) hook.data = {};
      hook.data[TYPE_KEY] = serviceName;
      try {
        throwUnlessCan(method, hook.data);
        hook.params.abilityTestCheckResult = true;
        hook.params.abilityTestCheckRun = true;
      } catch (error) {
        hook.params.abilityTestCheckResult = false;
        hook.params.abilityTestCheckRun = true;
      }
      hook.app.debug('feathers-mongoose-casl - abilities hook - user allowed - test mode', {action, serviceName});
      return hook;
    }
    // --------------------------------



    // --------- CREATE request ------------
    // check ability for create request
    if (hook.method === 'create') {
      hook.data[TYPE_KEY] = serviceName;
      throwUnlessCan('create', hook.data);
    }
    // --------------------------------

    // --------- READ/UPDATE/DELETE request ------------
    // read- build query that will filter the relevant data by user ability
    // update/delete - build query that will let user to change/remove by is ability
    if (!hook.id) {
      const query = toMongoQuery(ability, serviceName, action);

      if (query !== null) {
        Object.assign(hook.params.query, query);
      } else {
        hook.app.debug('feathers-mongoose-casl - abilities hook - user not allowed', {action, serviceName});
        throw new Forbidden(`You are not allowed to ${action} ${serviceName}`);
      }
      hook.app.debug('feathers-mongoose-casl - abilities hook - user allowed', {action, serviceName});
      return hook;
    }
    // --------------------------------


    // --------- GET request ------------
    // check ability for get request
    const params = Object.assign({}, hook.params, { provider: null });
    const result = await service.get(hook.id, params);

    if(!isProduction && result && typeof result !== 'object'){
      hook.app.error('feathers-mongoose-casl -abilities hook - serviceName need to return object as result to allow the abilities check, you can skip abilities check by adding the skipAbilitiesCheck to service.options', {action, serviceName});
    }
    
    result[TYPE_KEY] = serviceName;
    throwUnlessCan(action, result);

    if (action === 'get') {
      hook.result = result;
    }
    hook.app.debug('feathers-mongoose-casl - abilities hook - user allowed', {action, serviceName});
    return hook;
  } catch (error) {
    throw new Forbidden(error);
  }
  // --------------------------------
};

const testAbilities = (hook, name, method, userId) => abilities(hook, name, method, true, userId); // testAbilities return results and not throw expecting that block the process

const mockTest = ({service = 'posts', method = 'create', query = {}, data = {}, rules = [], userRulesIds = []}) => {
  const hook = mockTestHelpers.getHook({service, method, query, data});
  return abilities(hook, service, method, false, null, mockTestHelpers.getRules(rules), mockTestHelpers.getUser(userRulesIds));
};

module.exports = {
  hook: abilities,
  testAbilities,
  mockTest
};