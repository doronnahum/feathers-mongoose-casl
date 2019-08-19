
const rulesCache = require('../../cache/rulesCache');
const _filterRule = require('./filterRule');

/**
 * @typedef {Object} Rule
  * @property {string[]} actions
  * @property {string[]} subject
  * @property {object} [conditions]
  * @property {[]} [fields]
  * @property {string[]} [roles]
  * @property {boolean} [anonymousUser]
  * @property {string[]} [populateWhitelist]
  * @property {object} [userContext]
 */

/**
 * @function getRules
 * @description this function collect the rules from the DB, config, service.options and create
 * a default rules and return all in one object
 * @param {object} payload
 * @param {object} payload.hook
 * @param {string} payload.serviceName
 * @param {string} payload.action
 * @return {Promise<{
 *    rulesFromDb: Rule[],
 *    rulesFromServiceOptions: Rule[],
 *    rulesFromConfig: Rule[],
 *    defaultRules: Rule[]
 * }>}
 *
 */
const getRules = async function (payload) {
  const { hook, serviceName, action } = payload;
  try {
    /**
     * filter Rule
     * --------------------------------------------------------------------------------
     * we use filter rule to filter all rules array
     * --------------------------------------------------------------------------------
     */
    const filterRule = _filterRule(serviceName, action);

    /**
     * Rules From Config
     * --------------------------------------------------------------------------------
     * Get all the rules from the config file
     * filter the array with [filterRule]
     * save result inside [rulesFromConfig]
     * --------------------------------------------------------------------------------
     */
    let mongooseCaslConfig = hook.app.get('feathers-mongoose-casl');
    if (!mongooseCaslConfig) {
      hook.app.error('Missing feathers-mongoose-casl in config file');
    }
    let rulesFromConfig;
    if (mongooseCaslConfig && mongooseCaslConfig.defaultRules) {
      rulesFromConfig = mongooseCaslConfig.defaultRules.filter(filterRule);
    }

    /**
     * Rules From DB
     * --------------------------------------------------------------------------------
     * Get all the rules from the rules collection
     * filter the array with [filterRule]
     * save result inside [rulesResults.date]
     * --------------------------------------------------------------------------------
     */
    let rulesResults;
    let rulesFromDb;
    if (hook.app.service('/rules')) { // Rules from Db is optional
      const rulesFromCache = await rulesCache.getRulesFromCache();
      rulesResults = rulesFromCache || await hook.app.service('/rules').find({
        query: {
          active: true,
          actions: { '$exists': true },
          subject: { '$exists': true }
        },
        requestFromAbilities: true // this will trigger parseRules hook
      });

      if (rulesResults.data) {
        rulesFromDb = rulesResults.data.filter(filterRule);
      } else {
        hook.app.error('Missing rules from DB', rulesResults);
      }
    } else {
      rulesFromDb = [];
    }

    // Default Rules
    const defaultRules = ['create', 'read', 'update', 'delete', 'manage'].map(action => ({
      actions: [action],
      subject: [serviceName],
      roles: [`${action}-${serviceName}`]
    }));

    // Rules From service options
    let rulesFromServiceOptions;
    const service = hook.app.service(serviceName);
    if (service && service.options && service.options.serviceRules) {
      rulesFromServiceOptions = service.options.serviceRules.map(rule => {
        rule.subject = [serviceName];
        return rule;
      }).filter(filterRule);
    }
    return {
      rulesFromDb,
      rulesFromServiceOptions,
      rulesFromConfig,
      defaultRules
    };
  } catch (error) {
    hook.app.error('feathers-mongoose-casl/src/hooks/abilities/helpers/getRules.js', error);
    throw new Error(error);
  }
};

module.exports = getRules;
