/* eslint-disable quotes */
// Initializes the `roles` service on path `/roles`
const createService = require('feathers-mongoose');
const createModel = require('./roles.model');
const hooks = require('./roles.hooks');

module.exports = function (app) {
  const Model = createModel(app);
  const rolesCacheConfig = app.get('roles-cache');
  const options = {
    Model,
    paginate: {
      "default": rolesCacheConfig['local-config'].max,
      "max": rolesCacheConfig['local-config'].max
    },
    whitelist: [ '$exists' ]
  };

  // Initialize our service with any options it requires
  const rolesService = createService(options);
  app.use('/roles',rolesService);
  
  // Swagger docs
  if(app.docs && app.docs.paths['/roles']){
    app.docs.paths['/roles'].post.description = 'Create and update roles collection';
    app.docs.paths['/roles'].post.parameters[0].schema = {
      type: 'object',
      example: roles_examples};
  }

  // Get our initialized service so that we can register hooks
  const service = app.service('roles');
  
  service.hooks(hooks);

};

const roles_examples = [
  {
    "name": "create roles",
    "description": "anybody with pointer to this role can mange roles",
    "type": "private",
    "actions": [
      "manage"
    ],
    "subject": "roles",
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
    "description": "any user with pointer to this role can see the post except the _id field",
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
    "name": "read post temporary roles",
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
      "roles": [],
      "blockAll": true
    },
    "active": true
  },
  {
    "name": "blocked 5c4856f91c1b3bacd1c15e6c",
    "description": "blocked user from 5c4e03d81aabc97d7b8cf7fb role",
    "actions": [
      "read",
      "update",
      "delete",
      "create"
    ],
    "type": "blocked",
    "blocked": {
      "user": "5c4856f91c1b3bacd1c15e6c",
      "roles": [
        "5c4e03d81aabc97d7b8cf7fb"
      ],
      "blockAll": false
    },
    "active": true
  }
];