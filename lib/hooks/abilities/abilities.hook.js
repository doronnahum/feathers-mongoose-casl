// abilities.hook.js
// https://blog.feathersjs.com/authorization-with-casl-in-feathersjs-app-fd6e24eefbff
// abilities is run before each request, apply inside src/app.hooks.js
// run after authenticate that validate user from headers
// when user or anonymous user make request me make sure he have the right roles
// roles can be hard coded in this file or came from server
// 3 types of roles-
//   1- public - rules that apply to everyone
//   2- private - rules that apply for only user with pointer to this roles
//   3- blocked - this roles are included user id and can block user roles or block the user.
// examples of roles
// {"name": "find me", "actions": ["read"], "type": "public", "subject": ["me"], "condition": { "_id": "{{ user._id }}" } },
// {"name": "allow sing-up", "actions": ["create"], "type": "public", "subject": ["users"] },
// {"name": "allow resetPassword, verifyPassword", "actions": ["create"], "type": "public", "subject": ["authManagement"] },
// {"name": "temporary, for first user", "actions": ["manage"], "subject": ["all"]}


/* eslint-disable quotes */
const { Ability } = require('@casl/ability');
const { toMongoQuery } = require('@casl/mongoose');
const { Forbidden } = require('@feathersjs/errors');
const TYPE_KEY = Symbol.for('type');
const getRolesByTypes = require('./helpers/getRolesByTypes');
const defineAbilities = require('./helpers/defineAbilities');
const getUser = require('./helpers/getUser');
const getRoles = require('./helpers/getRoles');

Ability.addAlias('update', 'patch');
Ability.addAlias('read', ['get', 'find']);
Ability.addAlias('delete', 'remove');

const abilities = async function(hook, name, method, testMode, userIdForTest ) {
  try {
    const action = method || hook.method; // find,get,update,remove,create
    const service = name ? hook.app.service(name) : hook.service; // posts,roles...
    const model = service.options && service.options.Model && service.options.Model;
    const serviceName = name || hook.path;
    

    // --------- Find user ------------
    // find user from cache or from db
    const {user, hasUser, userId, userRolesIds} = await getUser({hook, testMode,userIdForTest});
    // --------------------------------


    // --------- Find Roles ------------
    // find roles from cache or from db
    const {roles, defaultRoles} = await getRoles({hook, testMode,userIdForTest});
    // --------------------------------

    // --------- Create filter groups and remove invalid ones ------------
    // split roles to publicRoles and userRoles, remove all active:false or by from&to that not include today
    const [userRoles, publicRoles] = getRolesByTypes(hook, hasUser, userRolesIds, roles, userId, testMode);

    // --------------------------------
    // --------- Define Abilities ------------
    // compiledRolesTemplate with user data:
    // from [{action: ['read', "conditions": {  "author": "{{ user._id }}" } ]}]
    // to   [{action: ['read', "conditions": {  "author": "a343dd9" } ]}]
    const ability = defineAbilities(user, userRoles, publicRoles, defaultRoles);
    // --------------------------------


    // --------- Create Test ability function ------------
    // this function will call and throw an error that block user with missing ability to is a request
    const id = hook.id ? hook.id : '';
    const throwUnlessCan = (action, resource) => {
      if (ability.cannot(action, resource)) {
        throw new Forbidden(`You are not allowed to ${action} ${id} ${serviceName}`);
      }
    };
    // --------------------------------

  
    // --------- Accessible Fields By ------------
    // we want to expose this into params to let sanitizedData.hook the right info to filter fields from the request or from the response
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
        throw new Forbidden(`You are not allowed to ${action} ${serviceName}`);
      }

      return hook;
    }
    // --------------------------------


    // --------- GET request ------------
    // check ability for get request
    const params = Object.assign({}, hook.params, { provider: null });
    const result = await service.get(hook.id, params);

    result[TYPE_KEY] = serviceName;
    throwUnlessCan(action, result);

    if (action === 'get') {
      hook.result = result;
    }

    return hook;
  } catch (error) {
    throw new Forbidden(error);
  }
  // --------------------------------
};

module.exports = {
  hook: abilities,
  test: (hook, name, method, userId) => abilities(hook, name, method, true, userId) // Test return results and not throw expecting that block the process
};