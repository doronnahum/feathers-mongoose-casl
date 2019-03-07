

const moment = require('moment');
const rulesCache = require('../../cache/rulesCache');


module.exports = async function({hook, serviceName}){

  const filterRule = function(rule){
    let result = true;
    if(!rule.subject.includes(serviceName)){
      result = false;
    }else if(rule.from && !moment().isAfter(rule.from)) {
      result = false;
    }else if(rule.to && !moment().isBefore(rule.from)){
      result = false;
    }
    return result;
  };

  // Rules From Config
  let mongooseCaslConfig = hook.app.get('feathers-mongoose-casl');
  if(!mongooseCaslConfig){
    hook.app.error('Missing feathers-mongoose-casl in config file');
  }
  let rulesFromConfig;
  if(mongooseCaslConfig && mongooseCaslConfig.defaultRules){
    rulesFromConfig = mongooseCaslConfig.defaultRules.filter(filterRule);
  }
  
  // Rules from DB/CACHE
  // user = await usersCache.getUserFromCache(userId) || await hook.app.service('/users').get(user._id);
  const rulesFromCache = await rulesCache.getRulesFromCache(hook);
  const rulesResults =  rulesFromCache || await hook.app.service('/rules').find({
    query: {
      active: true,
      actions: { '$exists': true },
      subject: { '$exists': true }
    },
    requestFromAbilities: true // this will trigger parseRules hook
  });

  if(rulesResults && rulesResults.data){
    rulesResults.data = rulesResults.data.filter(filterRule);
  }else{
    hook.app.error('Missing rules from DB', rulesResults);
  }

  // Default Rules
  const defaultRules = ['create','read','update','delete','manage'].map(action => ({
    actions: action,
    subject: serviceName,
    roles: [`${serviceName}-${action}`]
  }));

  // Rules From service options
  let rulesFromServiceOptions;
  const service = hook.app.service(serviceName);
  if(service && service.options &&  service.options.serviceRules) {
    rulesFromServiceOptions = service.options.serviceRules.map(rule => {
      rule.subject = [serviceName];
      return rule;
    }).filter(filterRule);
  }
  return {
    rulesFromDb: rulesResults.data,
    rulesFromServiceOptions,
    rulesFromConfig,
    defaultRules
  };
};