# App hooks

feathers-mongoose-casl hooks We need to set global hooks,

these hooks will run before and after each query hook.authenticate This is wrapper of @feathersjs/authentication - Feathers local, token, and OAuth authentication over REST and Websockets using JSON Web Tokens \(JWT\) with PassportJS.

**hooks.validateAbilities** This is a wrapper of Casl, in this hook, we will define abilities and block client without the ability to run this request Casl will add to mongoose query object a relevant key value before making the request, and validate Abilities will remove fields from user request by id abilities

**hooks.validateSchema** This hook will use JOI to validate request data follow the scheme

**hooks.sanitizedData** This hook will remove data from response follow the user abilities

**hook.errorHandler** to make sure that errors get cleaned up before they go back to the client

## Open src\app.hooks.js and paste this

{% tabs %}
{% tab title="src\\app.hooks.js" %}
```javascript
Open src\app.hooks.js and paste thisconst log = require('./hooks/log');const {hooks} = require('feathers-mongoose-casl');​module.exports = {  before: {    all: [      log(),      hooks.authenticate, // Check user token(JWT) and get user from DB, user will be found at hook.params.user       hooks.validateAbilities // Check user abilities (CASL)     ],    find: [],    get: [],    create: [hooks.validateSchema], // validate Schema with JOI before create    update: [hooks.validateSchema], // validate Schema with JOI before update    patch: [hooks.validateSchema],// validate Schema with JOI before patch    remove: []  },​  after: {    all: [ log(),      hooks.sanitizedData, // Remove protected fields(CASL rules fields) from response    ],    find: [],    get: [],    create: [],    update: [],    patch: [],    remove: []  },​  error: {    all: [ log(), hooks.errorHandler() ], // errorHandler - make sure that errors get cleaned up before they go back to the client    find: [],    get: [],    create: [],    update: [],    patch: [],    remove: []  }};
```
{% endtab %}
{% endtabs %}

```text
git add .git commit -m "Add feathers-mongoose-casl authentication and authorization hooks"
```

