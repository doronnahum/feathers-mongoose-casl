# $Populate

### 1- You need to allow $populate at service level

```javascript
  module.exports = function (app) {
    const Model = createModel(app);
    const paginate = app.get('paginate');
    const options = {
      Model,
      paginate,
      whitelist: '$populate',
    }
  }
```

### 2- You need to allow $populate at rule level

```javascript
  const options = {
    Model,
    paginate,
    whitelist: '$populate',
    serviceRules: [
      {
        'actions': ['manage'],
        'roles': ['admin'],
        'populateWhitelist': ['categories'] // Alow admin to populate categories
      },
    ],
  };
```

### 3 - deep populate 

from "versions": "1.9.0"

you can  controlled deep populate from rule.populateWhitelist

#### rule example:

```javascript
  const options = {
    Model,
    paginate,
    whitelist: '$populate',
    serviceRules: [
      // rule example that allow the user to populate posts and post tags
      {
        actions: ['read'],
        populateWhitelist: ['post', 'post.tags']
      },
      // rule example that allow the user to populate and post tags but select only the tag name
      {
        actions: ['read'],
        populateWhitelist: ['post', {path: 'post.tags', select: ['name']}]
      },
    ],
  };
```

#### '$populate' examples:

```javascript
$populate: ['post','tag'];
$populate: [{path: 'post', select: 'name', populate: 'tag'}];
$populate: [{path: 'post', select: 'name', populate: {path: 'tag', select: 'name'}];
```

#### request example:

```javascript
const {callingParamsPersistUser} = require('feathers-mongoose-casl');

// We use callingParamsPersistUser to persist user abilities when the request call from the server

// in this user get response with the populate post, and each tag inside the post will be populate but he
// will get only the name fields
// user will not be populate , it is now allowed by the populateWhitelist
const res = await context.app.service('some-service').find(callingParamsPersistUser(context.params, {
  query: {
    '$populate':
    [{
      path: 'post',
      'populate': {
        path: 'tags',
        select: 'name, rating'
      }
    },
    'user'
    ]
  }
}));
```

### 

#### simple Request example

[http://localhost:3030/products?$limit=5&$populate=categories,c](http://localhost:3030/trainings?$limit=5&$populate=players,trainers)olors

### 4- Optional - Dashboard configuration-

To populate filed inside  dashboard screen add this:

```javascript
  // Inside product service
  const options = {
    Model,
    paginate,
    serviceRules: [
      {
        'actions': ['manage'],
        'roles': ['admin'],
        'populateWhitelist': ['categories'] // Alow admin to populate categories
      },
    ],
    dashboardConfig: {
      populate: ['categories'] // add categories to dashboard populate query
    },
  };
```

{% hint style="danger" %}
Important - security issue in version before 1.9.0  
When you enable $populate your service is not full secure,  
for now we did't handle security for populate as object,  
for example:

request with this query fill fetch users

```javascript
$populate: {
          path: 'posts',
          select: 'gates',
          populate: {
            path: 'users',
            populate: {
              path: 'office'
            }
          }
}
```
{% endhint %}

{% hint style="info" %}
Need to populate collection of private files ?  
check this guide:  


{% page-ref page="upload-files/sign-file-after-populate.md" %}
{% endhint %}

