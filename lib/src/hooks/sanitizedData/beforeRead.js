const debug = require('debug')('feathers-mongoose-casl');
const { defineAbilitiesHelpers } = require('../../utils/helpers');

const beforeRead = async function(hook) {
  const action = hook.method;
  const abilityFields = hook.params.abilityFields;
  
  /**
   * Protect populate
   * -----------------
   * Before we make the request we want to remove un valid populates
   * populateWhitelist- populate White list is populate that define in the rules[{populateWhitelist: [...]}]
   * populate - populate from client query
   */
  let populate = hook.params.query['$populate'];
  if (populate && populate.length) {
    const populateWhitelist =
      hook.params[defineAbilitiesHelpers.POPULATE_WHITELIST_KEY];
    const populateArr =
      typeof populate === 'string' ? populate.split(',') : populate;

    if (populateWhitelist) {
      populate = populateArr.filter(item => {
        const isAllow = populateWhitelist.includes(item);
        if (isAllow) return true;
        debug(
          `sanitizedData hook - protect populate - remove ${item} populate from request`
        );
      });
      if (populate && populate.length) {
        hook.params.query['$populate'] = populate;
      } else {
        delete hook.params.query['$populate'];
      }
    }
  }

  /**
   * Select fields
   * ---------------
   * We Want to select fields with mongoose select
   * select come from:
   * 1 - client ->  hook.params.query['$select']
   * 2 - rules -> rules[{fields: [...]}]
   * when the abilityFields include only simple strings then we used mongoose select by merge abilityFields into hook.params.query['$select']
   * when the abilityFields include complex options like ["*", {"path": "author", "select": ["email", "-updatedAt"] }] see https://feathersjs-mongoose.gitbook.io/feathers-mongoose-casl/guides/casl#each-rule-define-by-this-fields
   * then we remove the fields after the request
   */
  let select = hook.params.query['$select'];
  const _isSimpleAbilityFields = defineAbilitiesHelpers.isSimpleAbilityFields(
    abilityFields,
    select
  );

  /**
   * When AbilityFields is simple then we select only the fields user [able] to fetch
   */
  if (_isSimpleAbilityFields) {
    // we can use mongoose to protect fields
    hook.params[defineAbilitiesHelpers.SKIP_SANITIZED_DATA_AFTER_READ] = true;
    if (select && abilityFields) {
      hook.params.query['$select'] = [...select, ...abilityFields];
    } else if(abilityFields) {
      hook.params.query['$select'] = abilityFields;
    }
    debug(
      `sanitizedData hook - before ${action}, protect fields with feathers select, service ${
        hook.path
      }, select: ${hook.params.query['$select']}`
    );
  }

  /**
   * When request include select we want to select only the fields user [want] to fetch
   * [_isSimpleAbilityFields] add to select all fields user [able] to fetch
   * this step [select] only fields user [want] and [able]
   */
  if(select){
    hook.params.query['$select'] = hook.params.query['$select'].filter(field => select.includes(field));
  }
};

module.exports = beforeRead;
