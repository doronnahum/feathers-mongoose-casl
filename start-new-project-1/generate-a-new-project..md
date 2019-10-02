---
description: 'https://docs.feathersjs.com/guides/basics/generator.html'
---

# Generate a new project.



* [ ] **Install @feathersjs/cli**

  ```javascript
  npm install -g @feathersjs/cli
  ```

* [ ] **Generate a new project  
  \*** feathers cli will ask you some question, you can confirm all.

  ```javascript
  mkdir my-new-app
  cd my-new-app/
  feathers generate app


  ? Do you want to use JavaScript or TypeScript? JavaScript
  ? Project name YOUR_PROJECT_NAME
  ? Description 
  ? What folder should the source files live in? src
  ? Which package manager are you using (has to be installed globally)? npm
  ? What type of API are you making? (Press <space> to select, <a> to toggle all, 
  <i> to invert selection)REST, Realtime via Socket.io
  ? Which testing framework do you prefer? Mocha + assert
  ? This app uses authentication Yes
  ? What authentication strategies do you want to use? (See API docs for all 180+ 
  supported oAuth providers) (Press <space> to select, <a> to toggle all, <i> to i
  nvert selection)Username + Password (Local)
  ? What is the name of the user (entity) service? users
  ? What kind of service is it? Mongoose
  ? What is the database connection string? YOUR_DB_URL
  ```

* [ ] **Update port from env \*we need this to deploy to heroku Open** src/index.js replace const port =  app.get\('port'\); with const port = process.env.PORT \|\| app.get\('port'\);
* [ ] **Git push**

  ```javascript
  git init
  git add .
  git commit -m "Create new feathers app"
  ```

