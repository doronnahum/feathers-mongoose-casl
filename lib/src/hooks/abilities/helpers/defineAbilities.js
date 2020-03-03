const { AbilityBuilder, Ability } = require('@casl/ability');
const { defineAbilitiesHelpers } = require('../../../utils/helpers');
const _handleRule = require('./hanldeRule');
const { compiledRulesTemplate, subjectName } = defineAbilitiesHelpers;

function defineAbilities ({ hook, hasUser, user, rulesFromDb, defaultRules, rulesFromConfig, rulesFromServiceOptions, testMode }) {
  try {
    const { rules, can } = AbilityBuilder.extract();

    /**
     * handleRule
     * ----------------------------------------------------------------------
     * Build handle rule function
     * handleRule check the rule condition
     * and apply the rule only if he relevant by [subject],[action],[user]
     * ----------------------------------------------------------------------
     */
    const handleRule = _handleRule({ hasUser, can, hook, user, testMode });

    /**
     * Run handleRule from each one of the compiled rules
     * [compiledRulesTemplate] - compile the rules with [nunjucks]
     * https://feathersjs-mongoose.gitbook.io/feathers-mongoose-casl/guides/casl#you-can-define-rules-in-3-places
     */

    /**
     * rules From Config
     * ----------------------------------------------------------------------
     * handle all rules from the config file
     * ----------------------------------------------------------------------
     */
    if (rulesFromConfig) {
      const _rulesFromConfig = user ? compiledRulesTemplate(rulesFromConfig, { user }) : rulesFromConfig;
      _rulesFromConfig.forEach(handleRule);
    }

    /**
     * rules From DB
     * ----------------------------------------------------------------------
     * handle all rules from the DB rules collection
     * ----------------------------------------------------------------------
     */
    if (rulesFromDb) {
      const _rulesFromDb = user ? compiledRulesTemplate(rulesFromDb, { user }) : rulesFromDb;
      _rulesFromDb.forEach(handleRule);
    }

    /**
     * rules From Service Options
     * ----------------------------------------------------------------------
     * service > options > serviceRules
     * ----------------------------------------------------------------------
     */
    if (rulesFromServiceOptions) {
      const _rulesFromServiceOptions = user ? compiledRulesTemplate(rulesFromServiceOptions, { user }) : rulesFromServiceOptions;
      _rulesFromServiceOptions.forEach(handleRule);
    }

    /**
     * service-default-rules
     * ----------------------------------------------------------------------
     * rules that define by feathers-mongoose-casl by default for each service
     * create-<serviceName>
     * read-<serviceName>
     * update-<serviceName>
     * delete-<serviceName>
     * manage-<serviceName>
     * for example - If user.role include delete-posts then he can delete posts
     * https://feathersjs-mongoose.gitbook.io/feathers-mongoose-casl/guides/casl#service-default-rules
     * ----------------------------------------------------------------------
     */
    defaultRules.forEach(handleRule);

    /**
     * Built Ability End
     */
    return new Ability(rules, { subjectName });
  } catch (error) {
    hook.app.error('feathers-mongoose-casl/src/hooks/abilities/helpers/defineAbilities.js', error);
    throw new Error(error);
  }
}

module.exports = defineAbilities;
