// Initializes the `posts` service on path `/posts`
const { createService } = require('../../../../lib/index');
const createModel = require('../../models/posts.model');
const hooks = require('./posts.hooks');

/**
 * Ability filed with select
 * @description Use to select some fields inside an inner object
 * @typedef {Object} AbilityFieldSelect
 * @property {string} path
 * @property {string[]} select
 * @property {string} [type] can be null or 'array'
 * @example select email and remove updatedAt from the data.author
 * {
 *    "path": "author",
 *    "select": ["email", "-updatedAt"] 
 * }
 */

/**
 * Ability filed with select
 * @description Use to select some fields with when condition inside an inner object
 * @typedef {Object} AbilityFieldWhen
 * @property {string} path
 * @property {string[]} select
  * @property {string} [type] can be null or 'array'
 * @example expose the author object only when the user is the author, all the else user can see the email field in the author object
 * {
 *    "path": "author",
 *     "when": {"author._id" : "{{ user._id}}"} ,
 *     "then" : ["*"] , 
 *     "otherwise": ["email"]
 *  }
 */

class Ability {
  /**
   * Create a ability.
   * @param {object} params
   * @param {string} [params.name] The ability name.
   * @param {string} [params.description] The ability description.
   * @param {string[]} params.actions The ability actions ['read','create','update','remove','manage']
   * @param {string[]} params.subject The ability subjects ['someServiceName','otherServiceName']
   * @param {[string]} [params.roles] Allow only user with one of the roles ['admin','otherRoleName']
   * @param {[string,AbilityFieldSelect, AbilityFieldWhen]} [params.fields] array of fields to keep or remove from the data
   * @param {object} [params.conditions] Allow users by the document context
   * examples:
   * 1. let the user to [actions] only if doc id equal to user id:   { "_id": "{{ user._id }}" }
   * 2. let user to [actions] only if author equal to is _id: { "author": "{{ user._id }}" }
   * let user to [actions] only if author equal to is _id
   * 3. let the user [actions] only when active is true:  { "active": true }
   * you can build conditions like a mongoose query with MongoDB operators: $in, $nin, $exists....
   * @param {object} [params.userContext] Allow users by the user context
   * 1. Allow only user with property email that equal to specific email 
   * :{"email":{"$eq":"doron+1@committed.co.il"}}
   * 2. Allow only user with property writer that equal to true: {"writer":{"$eq": true}}
   */
  constructor(params) {
    this.name = params.name;
    this.description = params.description;
    this.actions = params.actions;
    this.subject = params.subject;
    this.roles = params.roles;
    this.fields = params.fields;
    this.conditions = params.conditions;
    this.userContext = params.userContext;
    this.populateWhitelist = params.populateWhitelist;
    this.anonymousUser = params.anonymousUser;
    this.active = params.active;
    this.from = params.from;
    this.to = params.to;
  }
}

module.exports = function (app) {
  const Model = createModel(app);
  const paginate = app.get('paginate');

  const options = {
    Model,
    paginate,
    abilities: [
      new Ability({ actions: ['name'] })
    ]
  };

  // Initialize our service with any options it requires
  app.use('/posts', createService(options));

  // Get our initialized service so that we can register hooks
  const service = app.service('posts');

  service.hooks(hooks);
};
