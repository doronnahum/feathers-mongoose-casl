# Import required services

### feathers-mongoose-casl services

### feathers-mongoose-casl is come with numbers of services:

* **users**

  mongoose service to manage users collection

* **me** allow the user to get and patch itself
* **authManagement** handle user verify password, reset and more,[ for more details](https://hackernoon.com/setting-up-email-verification-in-feathersjs-ce764907e4f2)
* **notifier**\(Not exposed to the client\) used by **authManagement** service to send the right email to the user to verify password, changed password message...
* **mailer**\(Not exposed to the client\) ****used by **notifier** to send mail to user
* **rules** mongoose service to manage rules collection OPTIONAL - if you didn't need dynamic rules then you didn't need to import this service
* **uploads**\(Not exposed to the client\) upload file to aws/google/local folder
* **files** mongoose service to manage files collection, upload the file with the **uploads service**
* **dashboard** A dashboard for managing your app
* **userAbilities** Provides user permissions information

## Import feathers-mongoose-casl services to your project

Open src &gt; services &gt;index.js  
  
Copy the content from the code snippet 

{% code-tabs %}
{% code-tabs-item title="src\\services\\index.js" %}
```javascript
const posts = require('./posts/posts.service.js');
const {services} = require('feathers-mongoose-casl');

// eslint-disable-next-line no-unused-vars
module.exports = function (app) {
  // feathers-mongoose-casl services
  app.configure(services.users); // mongoose service to manage users collection
  app.configure(services.me); // / allow the user to get and patch itself *must come after users
  app.configure(services.authManagement); // handle user verify password, reset and more
  app.configure(services.rules); // Optional - import only if you need dynamic rules,mongoose service to manage rules collection
  app.configure(services.mailer); // used by notifier to send emails (Not exposed to the client)
  app.configure(services.notifier); // used by authManagement service to send the right email to the user to verify password, changed password message.(Not exposed to the client)
  app.configure(services.uploads); // uploads file to aws/google or to local folder.(Not exposed to the client)
  app.configure(services.files); // mongoose service to manage files collection, uploads files with upload service
  app.configure(services.dashboard); // A dashboard for managing your app
  app.configure(services.userAbilities); // Provides user permissions information
  // Specific project services
  app.configure(posts);
};
```
{% endcode-tabs-item %}
{% endcode-tabs %}



{% hint style="info" %}
If you want to customize a service copy the service folder to your app and make any changes
{% endhint %}

## Create user Schema \(optional\)

Now, we want to create a user scheme, This is not required but in most cases you will want to add several fields to the user document

**1**- Create validators folder inside the src folder  
     src&gt;validators

2- Create  ****users.validators.js file inside the validators folder  
     src &gt; validators &gt; ****users.validators.js

3- Open this file **node\_modules/feathers-mongoose-casl/lib/src/services/users/users.validators.js**  


**4- Copy  file content and past into your new** users.validators.js file

5- In the same file, fix the  require path  
**replace** const Joi = require\('../../utils/joi'\);  
**with** const {Joi} = require\('feathers-mongoose-casl'\);

6- Add this to validators to services  
     Open src &gt; services &gt; index.js  
     And add this lines

```javascript
 const {services, setJoiInstance} = require('feathers-mongoose-casl');
  module.exports = function (app) {
  ...
  setJoiInstance(app, 'users', usersValidators); // customize user schema
```

src &gt; services &gt; index.js - full example:

```javascript
const { services, setJoiInstance } = require('feathers-mongoose-casl');
const posts = require('./posts/posts.service.js');
const usersValidators = require('../validators/users.validators');

// eslint-disable-next-line no-unused-vars
module.exports = function (app) {
  setJoiInstance(app, 'users', usersValidators); // customize user schema
  // feathers-mongoose-casl services
  app.configure(services.users); // mongoose service to manage users collection
  app.configure(services.me); // / allow the user to get and patch itself *must come after users
  app.configure(services.authManagement); // handle user verify password, reset and more
  app.configure(services.rules); // mongoose service to manage rules collection
  app.configure(services.mailer); // used by notifier to send emails (Not exposed to the client)
  app.configure(services.notifier); // used by authManagement service to send the right email to the user to verify password, changed password message.(Not exposed to the client)
  app.configure(services.uploads); // uploads file to aws/google or to local folder.(Not exposed to the client)
  app.configure(services.files); // mongoose service to manage files collection, uploads files with upload service
  app.configure(services.dashboard); // A dashboard for managing your app
  app.configure(services.userAbilities); // Provides user permissions information
  // Specific project services
  app.configure(posts);
};
```

{% hint style="info" %}
In any of the file services, we comment require from feathers-mongoose-casl, in this way you can always copy a service folder to your src folder, fix the require files and make changes
{% endhint %}

```
git add .
git commit -m "import feathers-mongoose-casl services"
```

