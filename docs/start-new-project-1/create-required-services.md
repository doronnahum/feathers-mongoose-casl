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

{% code title="src\\services\\index.js" %}
```javascript
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
{% endcode %}



{% hint style="info" %}
If you want to customize a service copy the service folder to your app
{% endhint %}

## 

```
git add .
git commit -m "import feathers-mongoose-casl services"
```

