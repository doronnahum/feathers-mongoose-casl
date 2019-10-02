/*
  abilities.js
  ---------------
  inspired by - https://blog.feathersjs.com/authorization-with-casl-in-feathersjs-app-fd6e24eefbff
  This hook run before each request from src/app.hooks.js after authenticate hook
  authenticate validate user from headers and set user inside params.user
  rules are fetching from DB and saved in the rules cache by feathers-mongoose-casl/src/hooks/abilities/helpers/getRules.js
*/

const { Ability } = require('@casl/ability');
const { toMongoQuery } = require('@casl/mongoose');
const { Forbidden, GeneralError } = require('@feathersjs/errors');
const TYPE_KEY = Symbol.for('type');
const defineAbilities = require('./helpers/defineAbilities');
const _getUser = require('./helpers/getUser');
const _getRules = require('./helpers/getRules');
const mockTestHelpers = require('./helpers/mockTestHelpers');
const debug = require('debug')('feathers-mongoose-casl');

const isProduction = process.env.NODE_ENV === 'production';

Ability.addAlias('update', 'patch');
Ability.addAlias('read', ['get', 'find']);
Ability.addAlias('delete', 'remove');

/**
 * @function abilities
 * This hook will run for each client request with the hook object
 * all the other parameters
 * @param {*} hook [required] feathers hook object https://github.com/LeCoupa/awesome-cheatsheets/blob/master/backend/feathers.js
 * Optional attributes for the purpose of testing and for services\user-abilities\user-abilities.hooks.js
 * @param {string} name [optional]
 * @param {string} method [optional]
 * @param {boolean} testMode [optional]
 * @param {string} userIdForTest [optional]
 * @param {function} [getRules=__getRules] getRules  [optional] default value './helpers/getRules'
 * @param {function} getUser [optional]
 * @returns {Promise<object>} hook
 */
const abilities = async function (
  hook,
  name,
  method,
  testMode,
  userIdForTest,
  getRules = _getRules,
  getUser = _getUser
) {
  debug(`abilities hook start ${testMode ? 'testMode' : ''}`);
  try {
    const action = method || hook.method; // find,get,update,remove,create
    const service = name ? hook.app.service(name) : hook.service; // posts,rules...

    const model = service.options && service.options.Model && service.options.Model;

    /**
     * Define serviceName
     */
    const serviceName = name || hook.path;
    if (!serviceName) {
      hook.app.error(
        'feathers-mongoose-casl - abilities hook - missing serviceName && hook.path'
      );
      return hook;
    }

    /**
     * Skip Abilities Check
     * ----------------------------------------------------------------------
     * When skipAbilitiesCheck is true inside service.option
     * we skip and allow the request
     * ----------------------------------------------------------------------
     */
    const skipAbilitiesCheck = service.options && service.options.skipAbilitiesCheck;
    if (skipAbilitiesCheck) {
      if (skipAbilitiesCheck === true || skipAbilitiesCheck.includes(action)) {
        debug(`abilities hook end - skip abilities ${serviceName}.service.options.skipAbilitiesCheck = true`);
        return hook;
      }
    } else if (serviceName === 'authentication') {
      return hook;
    } else if (hook.params.skipAbilitiesCheckFromAuthentication) {
      return hook;
    }


    /**
     * Find user
     * ----------------------------------------------------------------------
     * Select user from params.user
     * When the testMode is enabled we allow to test a different user
     * and in this situation we fetch user from DB
     * ----------------------------------------------------------------------
     */
    const { user, hasUser } = await getUser({
      hook,
      testMode,
      userIdForTest
    });
    debug(`abilities hook for ${hasUser ? user._id + ' user' : 'anonymousUser'}`);

    /**
     * Find Rules
     * ----------------------------------------------------------------------
     * Rules are saved in memory(cache), when we didn't found rules in
     * memory we fetch them from DB and save them in cache
     * ----------------------------------------------------------------------
     */
    const {
      rulesFromDb,
      defaultRules,
      rulesFromConfig,
      rulesFromServiceOptions
    } = await getRules({ hook, serviceName, action });
    debug('abilities hook - rules for this service: ', {
      serviceName,
      action,
      rulesFromDb: rulesFromDb ? rulesFromDb.length : 0,
      defaultRules: defaultRules ? defaultRules.length : 0,
      rulesFromServiceOptions: rulesFromServiceOptions
        ? rulesFromServiceOptions.length
        : 0,
      rulesFromConfig: rulesFromConfig ? rulesFromConfig.length : 0
    });

    /**
     * Define Abilities
     * ----------------------------------------------------------------------
     * Define Abilities Will use [casl] AbilityBuilder to build the [Ability]
     * some of the rules are template and [nunjucks] will compile them with user data
     * 1 - config file [rulesFromConfig]
     * 2 - service options [rulesFromServiceOptions]
     * 3 - DB [rulesFromDb]
     * 4- [defaultRules]
     * ----------------------------------------------------------------------
     */
    const ability = defineAbilities({
      hook,
      hasUser,
      user,
      rulesFromDb,
      defaultRules,
      rulesFromConfig,
      rulesFromServiceOptions,
      testMode
    });

    /**
     * Create throwUnlessCan ability function
     * ----------------------------------------------------------------------
     * this function will call and throw an error
     * that block user with missing ability to is a request
     * ----------------------------------------------------------------------
     */
    const id = hook.id ? hook.id : '';
    const throwUnlessCan = (action, resource) => {
      if (ability.cannot(action, resource)) {
        debug('abilities hook - user not allowed', { action, serviceName });
        throw new Forbidden(
          `You are not allowed to ${action} ${id} ${serviceName}` // The message that client will get
        );
      }
    };

    /**
     * Accessible Fields By
     * ----------------------------------------------------------------------
     * we want to expose this into params to let sanitizedData.hook the right info
     * to filter fields from the request or from the response
     * ----------------------------------------------------------------------
     */
    hook.params = hook.params || {};
    hook.params.ability = ability;

    if (model && model.accessibleFieldsBy) {
      hook.params.abilityFields = model.accessibleFieldsBy(ability, action);
    }

    /**
     * Test mode
     * ----------------------------------------------------------------------
     * when test mode is true we catch the error from the ability function, throwUnlessCan()
     * because this is not a real request is only a check ability and we want only to check ability
     * we used this option from the user-abilities service
     * ----------------------------------------------------------------------
     */
    if (testMode) {
      if (!hook.data) hook.data = {};
      hook.data[TYPE_KEY] = serviceName;
      try {
        throwUnlessCan(method, hook.data);
        hook.params.abilityTestCheckResult = true;
        hook.params.abilityTestCheckRun = true;
      } catch (error) {
        hook.params.abilityTestCheckResult = false;
        hook.params.abilityTestCheckRun = true;
      }
      debug('abilities hook - user allowed - test mode', {
        action,
        serviceName
      });
      return hook;
    }

    /**
     * [CREATE] request
     * ----------------------------------------------------------------------
     * check ability for create request
     * ----------------------------------------------------------------------
     */
    if (hook.method === 'create') {
      hook.data[TYPE_KEY] = serviceName;
      throwUnlessCan('create', hook.data);
    }

    /**
     * [READ/UPDATE/DELETE] request
     * ----------------------------------------------------------------------
     * read- build query that will filter the relevant data by user ability
     * update/delete - build query that will let user to change/remove by is ability
     * ----------------------------------------------------------------------
     */
    if (!hook.id) {
      const query = toMongoQuery(ability, serviceName, action);

      if (query !== null) {
        Object.assign(hook.params.query, query);
      } else {
        debug('abilities hook - user not allowed', { action, serviceName });
        throw new Forbidden(`You are not allowed to ${action} ${serviceName}`);
      }
      debug('abilities hook - user allowed', { action, serviceName });
      return hook;
    }

    /**
     * [GET] request
     * ----------------------------------------------------------------------
     * check ability for get request
     * ----------------------------------------------------------------------
     */
    const params = Object.assign({}, hook.params, { provider: null });
    const result = await service.get(hook.id, params);

    if (!isProduction && result && typeof result !== 'object') {
      hook.app.error(
        'feathers-mongoose-casl -abilities hook - serviceName need to return object as result to allow the abilities check, you can skip abilities check by adding the skipAbilitiesCheck to service.options',
        { action, serviceName }
      );
    }

    result[TYPE_KEY] = serviceName;
    throwUnlessCan(action, result);

    if (action === 'get') {
      hook.result = result;
    }
    debug('abilities hook - user allowed', { action, serviceName });
    return hook;
  } catch (error) {
    if (error instanceof Forbidden) {
      throw new Forbidden(error);
    }
    throw new GeneralError();
  }
};

/**
 * @function testAbilities
 * @description Call [abilities] in test mode with specific userId
 * @param {object} hook The feathers hook object
 * @param {string} name The service name
 * @param {string} method The request method to check
 * @param {string} userId The user id to check
 */
const testAbilities = (hook, name, method, userId) =>
  abilities(hook, name, method, true, userId); // testAbilities return results and not throw expecting that block the process

const mockTest = ({
  service = 'posts',
  method = 'create',
  query = {},
  data = {},
  rules = [],
  userRulesIds = []
}) => {
  const hook = mockTestHelpers.getHook({ method, query, data });
  return abilities(
    hook,
    service,
    method,
    false,
    null,
    mockTestHelpers.getRules(rules),
    mockTestHelpers.getUser(userRulesIds)
  );
};

module.exports = {
  hook: abilities,
  testAbilities,
  mockTest
};
