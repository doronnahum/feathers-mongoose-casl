module.exports = function (hook) {
  // save rules is cache
  if(hook.params.requestFromAbilities && !hook.result.fromCache){
    const data = [];
    hook.result.data.forEach(rule => {
      let isRuleOk = true;
      if(rule.conditions){
        if(rule.conditions && rule.conditions.trim() < 2) rule.conditions = null;
        if(rule.conditions.length > 0){
          try {
            rule.conditions = JSON.parse(rule.conditions);
          } catch (error) {
            hook.app.error(`feathers-mongoose-casl Please delete this rule ${rule._id}, is conditions is not valid JSON.stringify({})`);
            isRuleOk = false;
          }
        }
      }
      if(isRuleOk && rule.userContext){
        if(rule.userContext && rule.userContext.trim() < 2) rule.userContext = null;
        if(rule.userContext.length > 0){
          try {
            rule.userContext = JSON.parse(rule.userContext);
          } catch (error) {
            hook.app.error(`feathers-mongoose-casl Please delete this rule ${rule._id}, is userContext is not valid JSON.stringify({})`);
            isRuleOk = false;
          }
        }
      }
      if(isRuleOk) data.push(rule);
    });
    hook.result.data = data;
  }
  return hook;
};