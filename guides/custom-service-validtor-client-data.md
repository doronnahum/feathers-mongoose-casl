# Custom service validtor client data

### How to create custom service and register a JOI validator?

When you create a mongoose service with createModelFromJoi\(\)  
we set your JOI schema inside the app and then we find this instance from validateSchema hook,  
if you create a new custom service and don't use createModelFromJoi\(\)  
then use setJoiInstance\(app, serviceName, joiSchema\)

```javascript
const commentsValidators = require('../validators/comments.validators.js');
const {setJoiInstance} = require('feathers-mongoose-casl');

module.exports = function (app) {
  // your custom 'comments' service 
  setJoiInstance(app, 'comments', commentsValidators);
  services.configureServices(app);
};
```

{% hint style="warning" %}
setJoiInstance most to come before   
services.configureServices\(app\);
{% endhint %}

joiSchema example

```javascript
const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);

const getJoiObject = function(withRequired){
  const required = withRequired ? 'required' : 'optional';
  return Joi.object({
    author: Joi.objectId().meta({ type: 'ObjectId', ref: 'roles' })[required](),
    title: Joi.string()[required](),
    body: Joi.string()[required](),
    rating: Joi.number().max(5),
  });
};

module.exports = getJoiObject;
```

