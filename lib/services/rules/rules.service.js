/* eslint-disable quotes */
// Initializes the `rules` service on path `/rules`

const createService = require('../../utils/createService');
// const {createService} = require('feathers-mongoose-casl');
const createModel = require('./rules.model');
const hooks = require('./rules.hooks');

module.exports = function (app) {
  const Model = createModel(app);
  const rulesCacheConfig = app.get('rules-cache');
  const options = {
    Model,
    paginate: {
      "default": rulesCacheConfig['local-config'].max,
      "max": rulesCacheConfig['local-config'].max
    },
    whitelist: [ '$exists' ]
  };

  // Initialize our service with any options it requires
  const rulesService = createService(options);
  app.use('/rules',rulesService);
  
  // Swagger docs
  if(app.docs && app.docs.paths['/rules']){
    app.docs.paths['/rules'].post.description = 'Create and update rules collection';
    app.docs.paths['/rules'].post.parameters[0].schema = {
      type: 'object',
      example: rules_examples};
  }

  // Get our initialized service so that we can register hooks
  const service = app.service('rules');
  
  service.hooks(hooks);

};

const rules_examples = [
  {
    "name": "create rules",
    "description": "anybody with pointer to this rule can mange rules",
    "type": "private",
    "actions": [
      "manage"
    ],
    "subject": "rules",
    "active": true
  },
  {
    "name": "create post",
    "description": "anybody can read the posts title",
    "type": "public",
    "actions": [
      "read"
    ],
    "subject": "posts",
    "fields": [
      "title"
    ],
    "active": true
  },
  {
    "name": "author delete post",
    "description": "only author can delete or update the post",
    "actions": [
      "delete",
      "update"
    ],
    "type": "private",
    "subject": "posts",
    "conditions": {
      "author": "{{ user._id }}"
    },
    "active": true
  },
  {
    "name": "read post",
    "description": "anybody can read the posts, only author can see the post body",
    "actions": [
      "read"
    ],
    "type": "private",
    "subject": "posts",
    "fields": [
      {
        "-body": {
          "author": "{{ user._id }}"
        }
      }
    ]
  },
  {
    "name": "author update post",
    "description": "rating can update post except the rating field",
    "actions": [
      "update",
      "create"
    ],
    "type": "private",
    "subject": "posts",
    "fields": [
      "-rating"
    ],
    "conditions": {
      "author": "{{ user._id }}"
    }
  },
  {
    "name": "read post",
    "description": "any user with pointer to this rule can see the post except the _id field",
    "actions": [
      "read"
    ],
    "type": "private",
    "subject": "posts",
    "fields": [
      "-_id"
    ],
    "active": true
  },
  {
    "name": "read post temporary rules",
    "description": "anybody can see post except the _id field from X to Y data",
    "actions": [
      "read"
    ],
    "type": "public",
    "subject": "posts",
    "fields": [
      "-_id"
    ],
    "from": "2019-01-28T09:49:08.172Z",
    "to": "2019-02-28T09:49:08.172Z",
    "active": true
  },
  {
    "name": "blocked 5c4856f91c1b3bacd1c15e6c",
    "description": "blocked user from all app",
    "actions": [
      "read",
      "update",
      "delete",
      "create"
    ],
    "type": "blocked",
    "blocked": {
      "user": "5c4856f91c1b3bacd1c15e6c",
      "rules": [],
      "blockAll": true
    },
    "active": true
  },
  {
    "name": "blocked 5c4856f91c1b3bacd1c15e6c",
    "description": "blocked user from 5c4e03d81aabc97d7b8cf7fb rule",
    "actions": [
      "read",
      "update",
      "delete",
      "create"
    ],
    "type": "blocked",
    "blocked": {
      "user": "5c4856f91c1b3bacd1c15e6c",
      "rules": [
        "5c4e03d81aabc97d7b8cf7fb"
      ],
      "blockAll": false
    },
    "active": true
  }
];