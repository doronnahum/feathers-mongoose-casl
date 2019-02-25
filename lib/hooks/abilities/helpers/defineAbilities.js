const { AbilityBuilder, Ability } = require('@casl/ability');
const {defineAbilitiesHelpers} = require('../../../utils/helpers');
const {compiledRulesTemplate, findRoleMatch, checkUserContext, subjectName} = defineAbilitiesHelpers;


function defineAbilities({hook, hasUser, user, defaultRules, rulesFromDb, testMode}) {
  const { rules, can } = AbilityBuilder.extract();
  const handleRule = function(rule){
    const {actions, subject, conditions, fields, userContext, roles, anonymousUser, populateWhitelist} = rule;
    
    // Check if rule is relevant
    if(!anonymousUser && !hasUser) return; // this rule relevant only for logged in user
    if(roles && roles.length && (!hasUser || !findRoleMatch({roles, userRoles: user.roles}))) return; // The user does not have a proper role
    if(userContext && (!hasUser || !checkUserContext({hook, user, userContext, ruleId: rule._id}))) return; // The user does not have the correct context
    hook.params = hook.params || {};
    // we want to turn on the sanitizedData before/after request
    if(fields && fields.length){
      hook.params[defineAbilitiesHelpers.ENABLE_ABILITY_FIELDS_KEY] = true;
    }
    // we want add populateWhitelist to sanitizedData.populateWhitelist, we handle this before request
    if(['find', 'get'].includes(hook.method) && populateWhitelist && populateWhitelist.length){
      hook.app.info('feathers-mongoose-casl sanitizedData update populateWhitelist');
      const currentPopulateWhitelist = hook.params[defineAbilitiesHelpers.WHITELIST_POPULATE_KEY] || [];
      hook.params[defineAbilitiesHelpers.POPULATE_WHITELIST_KEY] = [...currentPopulateWhitelist, ...populateWhitelist];
    }
    // Run casl can function
    if(testMode){
      can(actions, subject, fields ); // in test mode , conditions is not relevant, we need something more general
    }else{
      can(actions, subject, fields, conditions );
    }
  };

  // Pass over all rules with handleRule
  if(defaultRules){
    let _defaultRules = user ? compiledRulesTemplate(defaultRules, {user}) : defaultRules;
    _defaultRules.forEach(handleRule);
  }

  if(rulesFromDb){
    let _rulesFromDb = user ? compiledRulesTemplate(rulesFromDb, {user}) : rulesFromDb;
    _rulesFromDb.forEach(handleRule);
  }
  
  return new Ability(rules, { subjectName });
}

module.exports = defineAbilities;