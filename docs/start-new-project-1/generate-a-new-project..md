---
description: 'https://docs.feathersjs.com/guides/basics/generator.html'
---

# Generate a new project.



### **1 - Install @feathersjs/cli**

{% hint style="warning" %}
feathers-mongoose-casl &gt;= 2.0.0  
support only feathers &gt;= 4.3.3  
  
Before you generate a new app please check that your @feathersjs/cli version &gt;= 4.1.1  
  
To check run:

$ feathers -v
{% endhint %}

```javascript
npm install -g @feathersjs/cli
```

### **2 - Generate a new project**

```javascript
mkdir my-new-appcd my-new-app/feathers generate app
```

{% hint style="info" %}
```bash
? Do you want to use JavaScript or TypeScript?    JavaScript? Project name    YOUR_PROJECT_NAME? Description ? What folder should the source files live in?    src? Which package manager are you using (has to be installed globally)?    npm? What type of API are you making? (Press <space> to select, <a> to toggle all, <i> to invert selection)REST, Realtime via Socket.io? Which testing framework do you prefer?     Mocha + assert? This app uses authentication     Yes? What authentication strategies do you want to use? (See API docs for all 180+ supported oAuth providers) (Press <space> to select, <a> to toggle all, <i> to invert selection)Username + Password (Local)? What is the name of the user (entity) service?    users? What kind of service is it?    Mongoose? What is the database connection string?    YOUR_DB_URL
```
{% endhint %}

### **3 - Update port from env**

**\* needed when deploy to heroku**  
Open ****src/index.js  
replace  
const port =  app.get\('port'\);  
with  
const port = process.env.PORT \|\| app.get\('port'\);

### **4 - Git push**

```javascript
git initgit add .git commit -m "Create new feathers app"
```

