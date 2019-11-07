# Update posts service

### 

Update posts service Now we want to add JOI and CASL to posts service.

with JOI we going to: 

1- validate user request  
2- generate a mongoose schema  
3- generate a dashboard screen  
4- generate a swaager doc

with CASL we going to handle user abilities

We do this by create a validators file and by replace the createService from feathers-mongoose with .createService from feathers-mongoose-casl

### 1 - Inside the src/validators folder create this file posts.validators.js

```javascript
const {Joi} = require('feathers-mongoose-casl');
​
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

### 2 - Update Posts model

open src &gt; models &gt; posts.models.js

```text
// posts-model.js - A mongoose model
// 
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.
​
const postsValidators = require('../validators/posts.validators.js');
const {createModelFromJoi} = require('feathers-mongoose-casl');
​
module.exports = function (app) {
  return createModelFromJoi(app, 'posts', postsValidators);
};
```

### 3 - Update posts.service

open src &gt; services &gt; posts &gt; posts.service.js and replace createService from feathers-mongoose with createService from feathers-mongoose-casl

Before

 `const createService = require('feathers-mongoose')`

After

 `const {createService} = require('feathers-mongoose-casl');`

###  Add serviceRules to service options

```text
const options = {  
      serviceRules: [
      {'actions': ['read'], 'anonymousUser': true, fields: ['title']}, // anonymousUser can read posts
      {'actions': ['create','read','update'], 'conditions': { 'author': '{{ user._id }}' }}, // user can CRUD only his own posts
      { 'actions': ['manage'], 'roles': ['admin']}, // admin can manage all posts
      ],
```



### Remove authenticate from posts.hooks

```text
// before
module.exports = {
  before: {
    all: [ authenticate('jwt') ],
​
// after
module.exports = {
  before: {
    all: [],
```

we use a global authenticate then we didn't need this hook,

src\services\posts\posts.hooks.js

