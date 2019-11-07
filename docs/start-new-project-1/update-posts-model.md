# Create a new Service with casl&Dashboard

### 1 - Create new service

```bash
 feathers generate service
   ? What kind of service is it? Mongoose
   ? What is the name of the service? posts
   ? Which path should the service be registered on? /posts
   ? Does the service require authentication? Yes    
```

### 2. Create Validator file

inside your new service folder create new file - \[YOUR\_SERVICE\_NAME\].validators.js

{% tabs %}
{% tab title="src\\validators\\posts.validators.js" %}
```javascript
const {Joi} = require('feathers-mongoose-casl');

const getJoiObject = function(withRequired){
  const required = withRequired ? 'required' : 'optional';
  return Joi.object({
    author: Joi.objectId().meta({
      type: 'ObjectId',
      ref: 'users',
      displayKey: 'email'
    })[required](),
    title: Joi.string().min(5)[required]().meta({
      dashboard: {
        label: 'Post title',
        inputProps: JSON.stringify({style: {background: 'red'}})
      }
    }),
    body: Joi.string()[required](),
    rating: Joi.number().max(5).meta({
      dashboard: {
        hideOnUpdate: true,
        hideOnCreate: true,
      }
    }),
    image: Joi.objectId().meta({
      type: 'ObjectId',
      ref: 'files',
      displayKey: 'name'
    })
  });
};

module.exports = getJoiObject;
```
{% endtab %}

{% tab title="Plain Text" %}
```

```
{% endtab %}
{% endtabs %}

### 3. Update Posts model

To connect the joi validator we use createModelFromJoi,

in this way we can validation the Mongoose models without the hassle of maintaining two schemas.  


open src &gt; models &gt; posts.models.js

{% tabs %}
{% tab title="src\\models\\posts.model.js" %}
```javascript
// posts-model.js - A mongoose model
// 
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.

const validator = require('./posts.validators.js');
const {createModelFromJoi} = require('feathers-mongoose-casl');

module.exports = function (app) {
  return createModelFromJoi(app, 'posts', validator);
};

```
{% endtab %}
{% endtabs %}

You can still use a Mongoose schema 

{% page-ref page="../guides/joigoose/mongoose-schema.md" %}

### 4. Define abilities and config dashboard

open src &gt; services &gt; posts &gt; posts.service.js  


```javascript
    const options = {
    ...,
    serviceRules: [
      {'actions': ['read'], 'anonymousUser': true, fields: ['title']},
      {'actions': ['create','read','update'], 'conditions': { 'author': '{{ user._id }}' }},
      { 'actions': ['manage'], 'roles': ['admin']},
    ],
    dashboardConfig: {
      sideBarIconName: 'table',
      i18n: {
        'heIL': {
          serviceName: 'פוסטים',
          serviceNameMany: 'פוסטים',
          serviceNameOne: 'פוסט',
          fields: {
            '_id': 'מזהה',
            'updatedAt': 'תאריך עדכון',
            'createdAt': 'נוצר בתאריך',
          }
        }
      }
    }
    }
```

### 6. Protect posts.hooks



```javascript
const {hooks} = require('feathers-mongoose-casl');
const {authenticate, validateAbilities, validateSchema, sanitizedData, } = hooks;


module.exports = {
  before: {
    all: [authenticate, validateAbilities],
    find: [],
    get: [],
    create: [validateSchema],
    update: [validateSchema],
    patch: [validateSchema],
    remove: []
  },

  after: {
    all: [sanitizedData],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  },

  error: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  }
};

```

   


* **hook.authenticate** This is wrapper of [@feathersjs/authentication](https://github.com/feathersjs/authentication) - Feathers local, token, and OAuth authentication over REST and Websockets using JSON Web Tokens \(JWT\) with PassportJS.
* **hooks.validateAbilities** This is a wrapper of Casl, in this hook, we will define abilities and block client without the ability to run this request Casl will add to mongoose query object a relevant key value before making the request, and validate Abilities will remove fields from user request by id abilities
* **hooks.validateSchema** This hook will use JOI to validate request data follow the scheme
* **hooks.sanitizedData** This hook will remove data from response follow the user abilities

### 7. Commit changes

```text
git add .
git commit -m "Added joi validtors to posts serives"
```

{% hint style="info" %}
## dashboard: 

#### Now you can see the posts service inside the dashboard [https://feathersjs-mongoose-casl-admin.herokuapp.com/ ](install-feathers-mongoose-casl.md)Anyone can read the posts title User can create/update only if he the author Only admin user can delete posts

#### Try to create a new posts from the dashboard
{% endhint %}



