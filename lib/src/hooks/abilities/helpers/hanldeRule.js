const {defineAbilitiesHelpers} = require('../../../utils/helpers');
const {findRoleMatch, checkUserContext} = defineAbilitiesHelpers;
const debug = require('debug')('feathers-mongoose-casl');

module.exports = function({hasUser, can, hook, user, testMode}){
  /**
  * @function handleRule
  * This function will add can rule to casl ability when the rule is relevant to user
  * @param {object} rule
  * @param {string[]} rule.actions one or more relevant methods ['read','update','delete','create','manage'] 
  * @param {string[]} rule.subject collection of relevant services name ['posts' ,'users']
  * @param {object} rule.conditions query object mongoose style, see sift.js, example - { "_id": "{{ user._id }}" } , { "active": true }
  * @param {[]} rule.fields select/remove fields from req/res,
                            examples:
                             1- allow only title and body - ['title', 'body']
                             2- remove price from req/res - ['-price'],
                             3- allow all, select specific fields from author base user context-  ["*",{
                               "path": "author",
                               "when": {"author._id" : "{{ user._id}}"} ,
                               "then" : ["*"] , 
                               "otherwise": ["email"]
                               }
                             ]     
                             4- expose only email from author object - ["*", {"path": "author", "select": ["email", "-updatedAt"] }]
  * @param {string[]} rule.roles apply this rule only on user with one or more of this roles ['admin','sysadmin']
  * @param {boolean} rule.anonymousUser apply the rule on anonymous User when true
  * @param {string[]} rule.populateWhitelist allow user to populate one or more, example ['categories']
  * @param {object} rule.userContext query object base user Context,  mongoose style, see sift.js, example - {"email":{"$eq":"doron+1@committed.co.il"}}
  * 
  */
  const handleRule = function(rule){
    const {actions, subject, conditions, fields, userContext, roles, anonymousUser, populateWhitelist} = rule;
   
    // ----------------------------- Check if rule is relevant to this specific client --------------------------------------- //
   
   
    /**
    * When anonymousUser is not allowed when skip the rule when user is not found
    */
    if(!anonymousUser && !hasUser) return; // this rule relevant only for logged in user
   
    /**
    * When rule.roles is not empty then skip the rule if user not match at least one role
    */
    if(roles && roles.length && (!hasUser || !findRoleMatch({roles, userRoles: user.roles}))) return;
   
    /**
    * When userContext is found then skip the rule if checkUserContext is failed
    * checkUserContext used sift to test user context base client request or server response,
    */
    if(userContext && (!hasUser || !checkUserContext({hook, user, userContext}))) return;
   

    // ----------------------------- Rule is relevant to this specific client --------------------------------------- //
   
    hook.params = hook.params || {};
   
    /**
    * When fields found on the rule we want to set hook.params.ability-fields to true
    * with this flag we know to add fields to mongoose select or remove fields from request\response
    */
    if(fields && fields.length){
      hook.params[defineAbilitiesHelpers.ENABLE_ABILITY_FIELDS_KEY] = true;
    }
   
   /**
    * When rule include populateWhitelist
    * we want to add the values to hook.parsms.populate-whitelist
    * then sanitizedData/beforeRead.js will keep value in the $populate query
    * only if it found inside the hook.parsms.populate-whitelist
    */
   if(['find', 'get'].includes(hook.method) && populateWhitelist && populateWhitelist.length){
      debug('sanitizedData update populateWhitelist');
      const currentPopulateWhitelist = hook.params[defineAbilitiesHelpers.WHITELIST_POPULATE_KEY] || [];
      hook.params[defineAbilitiesHelpers.POPULATE_WHITELIST_KEY] = [...currentPopulateWhitelist, ...populateWhitelist];
    }
   
    /**
    * Define Abilities with AbilityBuilder.can
    * User can do [actions] on [subject] [fields] with [conditions] 
    * for example - user can [read] [post] [title]
    */
    if(testMode){
      can(actions, subject, fields ); // in test mode , conditions is not relevant, we need something more general
    }else{
      can(actions, subject, fields, conditions );
    }
  };
  return handleRule;
};