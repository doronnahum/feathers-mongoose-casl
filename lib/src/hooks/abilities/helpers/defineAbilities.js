const { AbilityBuilder, Ability } = require('@casl/ability');
const {defineAbilitiesHelpers} = require('../../../utils/helpers');
const {compiledRulesTemplate, findRoleMatch, checkUserContext, subjectName} = defineAbilitiesHelpers;
const debug = require('debug')('feathers-mongoose-casl');

function defineAbilities({hook, hasUser, user, rulesFromDb, defaultRules, rulesFromConfig, rulesFromServiceOptions, testMode}) {
  try {
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
        debug('sanitizedData update populateWhitelist');
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
    if(rulesFromConfig){
      let _rulesFromConfig = user ? compiledRulesTemplate(rulesFromConfig, {user}) : rulesFromConfig;
      _rulesFromConfig.forEach(handleRule);
    }
  
    if(rulesFromDb){
      let _rulesFromDb = user ? compiledRulesTemplate(rulesFromDb, {user}) : rulesFromDb;
      _rulesFromDb.forEach(handleRule);
    }
  
    if(rulesFromServiceOptions){
      let _rulesFromServiceOptions = user ? compiledRulesTemplate(rulesFromServiceOptions, {user}) : rulesFromServiceOptions;
      _rulesFromServiceOptions.forEach(handleRule);
    }
  
    defaultRules.forEach(handleRule); // default rules- any service get be default;
    
    return new Ability(rules, { subjectName });
  } catch (error) {
    hook.app.error('feathers-mongoose-casl/src/hooks/abilities/helpers/defineAbilities.js', error);
    throw new Error(error);
  }

}

module.exports = defineAbilities;