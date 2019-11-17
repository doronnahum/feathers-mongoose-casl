# Create a new service

### 1- feathers generate service

```text
$ feathers generate service
    ? What kind of service is it? Mongoose
    ? What is the name of the service? comments
    ? Which path should the service be registered on? /comments
    ? Does the service require authentication? No
```

{% hint style="warning" %}
? Does the service require authentication? No  
We authentication all the services from app.hook
{% endhint %}

### 2- Create validator file

inside validators create  comments.validators.js with this contnet

{% code title="comments.validators.js" %}
```javascript
const {Joi} = require('feathers-mongoose-casl');

const getJoiObject = function(withRequired){
  const required = withRequired ? 'required' : 'optional';
  return Joi.object({
    post: Joi.objectId().meta({ type: 'ObjectId', ref: 'roles' })[required](),
    text: Joi.string()[required](),
  });
};

module.exports = getJoiObject;
```
{% endcode %}

### 3- Update comments.model.js

{% code title="src/models/comments.model.js" %}
```javascript
// comments-model.js - A mongoose model
// 
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.

const commentsValidators = require('../validators/comments.validators.js');
const {createModelFromJoi} = require('feathers-mongoose-casl');

module.exports = function (app) {
  return createModelFromJoi(app, 'comments', commentsValidators);
};

```
{% endcode %}

{% hint style="info" %}
Need to create a native mongos schema?

  
createModelFromJoi\(app, 'comments', commentsValidators, mongooseSchema\);
{% endhint %}

### 4- comments.service.js

replace feathers-mongoose with createService from feathers-mongoose-casl  
feathers-mongoose-casl.createService is a wrapper of feathers-mongoose but we add  [mongoose-to-swagger](https://www.npmjs.com/package/mongoose-to-swagger) to let you see the schema inside swagger docs and we handle validation with joi



**Before**

```text
 const createService = require('feathers-mongoose')
```

**After**

```text
const {createService} = require('feathers-mongoose-casl');
```

{% hint style="info" %}
You can add to options serviceRules to allow "Admin" or any other roles to manage this new service  


```text
serviceRules: [
  {'actions': ['manage'], 'roles': ['admin']},
  {'actions': ['read'], anonymousUser: true},
]
```
{% endhint %}

{% code title="src\\services\\comments\\comments.service.js" %}
```javascript
// Initializes the `comments` service on path `/comments`
const {createService} = require('feathers-mongoose-casl');
const createModel = require('../../models/comments.model');
const hooks = require('./posts.hooks');

module.exports = function (app) {
  const Model = createModel(app);
  const paginate = app.get('paginate');

  const options = {
    Model,
    paginate,
    serviceRules: [
      {'actions': ['manage'], 'roles': ['admin']},
      {'actions': ['read'], anonymousUser: true},
    ]
  };

  // Initialize our service with any options it requires
  app.use('/comments', createService(options));

  // Get our initialized service so that we can register hooks
  const service = app.service('comments');

  service.hooks(hooks);
};

```
{% endcode %}

### 



