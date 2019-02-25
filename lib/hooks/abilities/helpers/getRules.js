

const moment = require('moment');

module.exports = async function({hook, testMode}){
   
  // Hard coded rules from config
  const mongooseCaslConfig = hook.app.get('feathers-mongoose-casl') || {};
  if(!mongooseCaslConfig){
    hook.app.error('Missing feathers-mongoose-casl in config file');
  }
  let defaultRules = mongooseCaslConfig.defaultRules || [];
  
  // Rules from DB/CACHE
  let rules;
  const rulesResults = await hook.app.service('/rules').find({
    query: {
      active: true,
      actions: { '$exists': true },
      subject: { '$exists': true }
    },
    disabledCache: testMode,// disabledCache in testMode
    requestFromAbilities: true
  });
  if(rulesResults && rulesResults.data){
    rules = rulesResults.data.filter(item => {
      let result = true;
      if(item.from) result = moment().isAfter(item.from);
      if(item.to) result = moment().isBefore(item.from);
      return result;
    });
  }else{
    hook.app.error('Missing rules from DB', rulesResults);
  }
  
  return {
    rules,
    defaultRules
  };
};