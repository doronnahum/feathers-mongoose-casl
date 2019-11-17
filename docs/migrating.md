# Migrating

From version 2.0.0 we support only Feathers &gt; v4,  
to update your app to  Feathers  v4 please read [this guide](https://docs.feathersjs.com/guides/migrating.html)  
After that you can install feathers-mongoose-casl@2.0.1  
  
And then:

1- Please remove authenticate, validateAbilities, validateSchema, sanitizedData from  app.hook.js  
the result need to be  


{% page-ref page="start-new-project-1/update-app.hook.md" %}

2- Add this hooks to each one of your services  
like in this guide:

{% page-ref page="start-new-project-1/update-posts-model.md" %}



3 - Update you src/authentication.js  
like in this guide

{% page-ref page="start-new-project-1/use-feathers-mongoose-casl-authentication.md" %}

#### That's it  

