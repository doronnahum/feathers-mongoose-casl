# Sign File After Populate

When a collection point to other collection of private files  
and you want to populate the file and get a sign file url,  
you need to add in the collection hook that handle the sign of the file  after the request  
  
example of use:  
------------------------------

let say  post is point to admin that point to user that point to profile that point to logo  
logo is collection of private files  
  
the request :  
-----------------------------

```javascript
app.service('posts').find({query:{
  $populate: {
    path: 'admin',
    populate: {
      path: 'user',
      populate: {
        path: 'profile',
        populate: {
          path: 'logo'
        }
      }
    }
  }
}})
```

### in the posts.hooks.js:

```javascript
const {hooks} = require('feathers-mongoose-casl');
const {singFileAfterPopulate} = hooks;

module.exports = {
  after: {
    find: [
      singFileAfterPopulate({
        path: 'admin.user.profile.logo',
        fileKeyName: 'file',
        singUrlKeyName:'file'
      })
    ],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  }
  ....
  }
```



{% hint style="info" %}
when you populate a file field and you use select, to sign file with singFileAfterPopulate you need this fields are required \['\_id','storage','fileId',\[fileKeyName\]\]
{% endhint %}

