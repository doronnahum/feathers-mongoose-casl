
const moment = require('moment');
const methodToAction = {
  'find': 'read',
  'get': 'read',
  'update': 'update',
  'patch': 'update',
  'remove': 'delete',
  'create': 'create'
};

/**
 * @function buildFilterRule
 * @description this function will return a filterRule function
 * @param {string} serviceName 
 * @param {string} action 
 */
const buildFilterRule = function(serviceName, action){
  /**
 * Filter Rule
 * --------------------------------------------------------------------------------
 * This function call by array.filter method and return true
 * only when the rule is relevant
 * relevant by date
 * relevant by request method (actions of the rule - ['read','create',...])
 * relevant by the service name (subject: ['posts']) 
 * --------------------------------------------------------------------------------
 */
  const filterRule = function (rule) {
    let result = true;
    if (!rule.subject.includes(serviceName) && !rule.subject.includes('all')) {
      result = false;
    } else if (!rule.actions.includes('manage') && !rule.actions.includes(action) && !rule.actions.includes(methodToAction[action])) {
      result = false;
    } else if (rule.from && !moment().isAfter(rule.from)) {
      result = false;
    } else if (rule.to && !moment().isBefore(rule.from)) {
      result = false;
    }
    return result;
  };

  return filterRule;
};

module.exports = buildFilterRule;