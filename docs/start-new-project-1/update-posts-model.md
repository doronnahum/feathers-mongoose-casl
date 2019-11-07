# Create a new Service with casl&Dashboard

You can create new service with a cli or manual:

{% tabs %}
{% tab title="generetor" %}
we use [hygen](http://hygen.io) to generate new service

### **Add hygen**

  
1 - download this [repo](https://github.com/doronnahum/hygen-FMC/archive/master.zip)  
2 - copy this \_templates folder to your app  
3 - install hygen  
`npm i hygen --save-dev`  
4 - inside your src/service/index.js  
after the last app.configure\(..\) add comment  
// services  
`module.exports = function (app) {  
....  
app.configure(services.userAbilities);   
// services  
}`  
5- add this script to your package.json  
`"create-service": "hygen generator service"`  
**Done!**

### **Create new service run**

`npm run create-service`

> ✔ Name of your service · posts
>
> inject: src/services/index.js added: src/services/posts/posts.class.js added: src/services/posts/posts.hooks.js added: src/services/posts/posts.model.js added: src/services/posts/posts.service.js added: src/services/posts/posts.validators.js
{% endtab %}

{% tab title="manual" %}
We going to create posts service  
  
1- Create posts folder in the src/service folder with this files

* src/services/posts/
  * posts.class.js 
  * posts.hooks.js 
  * posts.model.js 
  * posts.service.js 
  * posts.validators.js 

4 - inside your src/service/index.js  
`const posts = require('./posts/posts.service.js');  
module.exports = function (app) {  
...  
// services  
app.configure(posts);  
}`   
3 - Copy and past each file content from this snippet

```javascript
const { Service } = require('feathers-mongoose');exports.Posts = class Posts extends Service {  };
```

```javascript
const { authenticate } = require('@feathersjs/authentication').hooks;const { hooks } = require('feathers-mongoose-casl');const { validateAbilities, validateSchema, sanitizedData } = hooks;module.exports = {  before: {    all: [      function (hook) {        if (!hook.params.user && hook.params.headers && hook.params.headers.authorization) {          return authenticate('jwt')(hook);        }        else return hook;      }, validateAbilities],    find: [],    get: [],    create: [validateSchema],    update: [validateSchema],    patch: [validateSchema],    remove: []  },  after: {    all: [sanitizedData],    find: [],    get: [],    create: [],    update: [],    patch: [],    remove: []  },  error: {    all: [],    find: [],    get: [],    create: [],    update: [],    patch: [],    remove: []  }};
```

```javascript
const validator = require('./posts.validators');const { registerNewModel } = require('feathers-mongoose-casl');module.exports = function (app) {  const mongooseClient = app.get('mongooseClient');  // Register the validator  const { Schema } = mongooseClient;  const posts = new Schema(registerNewModel.getModelFromJoi(app, validator), {    timestamps: true  });  registerNewModel.setModel(posts);  // This is necessary to avoid model compilation errors in watch mode  // see https://github.com/Automattic/mongoose/issues/1251  try {    return mongooseClient.model('posts');  } catch (e) {    return mongooseClient.model('posts', posts);  }};
```

```javascript
// Initializes the `posts` service on path `/posts`const {  Posts } = require('./posts.class');const createModel = require('./posts.model');const hooks = require('./posts.hooks');const { registerValidator } = require('feathers-mongoose-casl');const validator = require('./posts.validators');module.exports = function (app) {  const Model = createModel(app);  // Register the validator  registerValidator(app, 'posts', validator);  const paginate = app.get('paginate');  const options = {    Model,    paginate,    serviceRules: [      { 'actions': ['manage'], 'roles': ['admin'] },    ],    dashboardConfig: {      sideBarIconName: 'table',      i18n: {        'heIL': {          serviceName: 'posts',          serviceNameMany: 'posts',          serviceNameOne: 'posts',          fields: {            '_id': 'מזהה',            'updatedAt': 'תאריך עדכון',            'createdAt': 'נוצר בתאריך',          }        }      }    }  };  // Initialize our service with any options it requires  app.use('/posts', new  Posts(options, app));  // Get our initialized service so that we can register hooks  const service = app.service('posts');  service.hooks(hooks);};const { Joi } = require('feathers-mongoose-casl');
```

```javascript
const getJoiObject = function (withRequired) {  const required = withRequired ? 'required' : 'optional';  return Joi.object({    author: Joi.objectId().meta({      type: 'ObjectId',      ref: 'users',      displayKey: 'email'    })[required](),    title: Joi.string().min(5)[required]().meta({      dashboard: {        label: 'Post title',        inputProps: JSON.stringify({ style: { background: 'red' } })      }    }),    body: Joi.string()[required](),    rating: Joi.number().max(5).meta({      dashboard: {        hideOnUpdate: true,        hideOnCreate: true,      }    }),    image: Joi.objectId().meta({      type: 'ObjectId',      ref: 'files',      displayKey: 'name'    })  });};module.exports = getJoiObject;
```

```

```

Done.
{% endtab %}
{% endtabs %}

Hooks in the service:

* **hook.authenticate** [@feathersjs/authentication](https://github.com/feathersjs/authentication) - Feathers local, token, and OAuth authentication over REST and Websockets using JSON Web Tokens \(JWT\) with PassportJS.
* **validateAbilities** This is a wrapper of Casl, in this hook, we will define abilities and block client without the ability to run this request Casl will add to mongoose query object a relevant key value before making the request, and validate Abilities will remove fields from user request by id abilities
* **validateSchema** This hook will use JOI to validate request data follow the scheme
* **sanitizedData** This hook will remove data from response follow the user abilities

### 7. Commit changes

```text
git add .git commit -m "create posts service"
```

{% hint style="info" %}
## dashboard: 

#### Now you can see the posts service inside the dashboard [https://feathersjs-mongoose-casl-admin.herokuapp.com/ ](install-feathers-mongoose-casl.md)Anyone can read the posts title User can create/update only if he the author Only admin user can delete posts

#### Try to create a new posts from the dashboard
{% endhint %}



