---
description: 'https://docs.feathersjs.com/guides/basics/generator.html'
---

# Generate a new project.

Generate a new project. [https://docs.feathersjs.com/guides/basics/generator.html](https://docs.feathersjs.com/guides/basics/generator.html) ​

### Install @feathersjs/cli

 `npm install -g @feathersjs/cli`

### Generate a new project

* feathers cli will ask you some question, you can confirm all.

```text
mkdir my-new-app
cd my-new-app/
feathers generate app
    ? Project name my-new-app
    ? Description
    ? What folder should the source files live in? src
    ? Which package manager are you using (has to be installed globally)? npm
    ? What type of API are you making? (Press <space> to select, <a> to toggle all, <i> to invert selection)REST,
    Realtime via Socket.io
    ? Which testing framework do you prefer? Mocha + assert
```

### Update port from env

\*we need this to deploy to heroku

Open src/index.js

```text

replace
const port =  app.get('port');
with
const port = process.env.PORT || app.get('port');

```



### Git push

 `git init git add . git commit -m "Create new feathers app"` 

