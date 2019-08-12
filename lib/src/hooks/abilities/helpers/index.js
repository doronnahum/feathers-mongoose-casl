const debug = require('debug')('feathers-mongoose-casl');

/**
 * @function skipTheAbilitiesCheck
 * @description When skipAbilitiesCheck is true inside service.option
 * we skip and allow the request
 * @param {object} hook 
 * @param {object} service 
 * @param {string} serviceName 
 * @param {string} action 
 */
const skipTheAbilitiesCheck = function(hook, service, serviceName, action){
  let value = false;
  const skipAbilitiesCheck = service.options && service.options.skipAbilitiesCheck;
  if (skipAbilitiesCheck) {
    if (skipAbilitiesCheck === true || skipAbilitiesCheck.includes(action)) {
      debug(`abilities hook end - skip abilities ${serviceName}.service.options.skipAbilitiesCheck = true`);
      value = true;
    }
  }
  return value;
};

module.exports = {
  skipTheAbilitiesCheck
};