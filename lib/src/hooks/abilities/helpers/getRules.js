

const moment = require('moment');
const rulesCache = require('../../cache/rulesCache');


const methodToAction = {
  'find': 'read', 
  'get': 'read', 
  'update': 'update', 
  'patch': 'update',
  'remove': 'delete',
  'create': 'create'
};
module.exports = async function({hook, serviceName, action}){
  const filterRule = function(rule){
    let result = true;
    if(!rule.subject.includes(serviceName) && !rule.subject.includes('all')){
      result = false;
    }else if(!rule.actions.includes('manage') && !rule.actions.includes(action) && !rule.actions.includes(methodToAction[action])){
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
  let rulesResults;
  if(hook.app.service('/rules')){ // Rules from Db is optional
    const rulesFromCache = await rulesCache.getRulesFromCache();
    rulesResults = rulesFromCache || await hook.app.service('/rules').find({
      query: {
        active: true,
        actions: { '$exists': true },
        subject: { '$exists': true }
      },
      requestFromAbilities: true // this will trigger parseRules hook
    });
  
    if(rulesResults.data){
      rulesResults.data = rulesResults.data.filter(filterRule);
    }else{
      hook.app.error('Missing rules from DB', rulesResults);
    }
  }else{
    rulesResults = {
      data: []
    };
  }


  // Default Rules
  const defaultRules = ['create','read','update','delete','manage'].map(action => ({
    actions: action,
    subject: serviceName,
    roles: [`${action}-${serviceName}`]
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