---
description: We need to add authentication to app.configure
---

# Verify user

configure feathers-mongoose-casl authentication

We need to add authentication to app.configur

 authentication is a wrapper of @feathersjs/authentication​

1- Open src\app.js file

2 - add app.configure\(authentication\)

```javascript
const {authentication} = require('feathers-mongoose-casl').services; // ADD THIS LINE​// app.configure(middleware); // this line already there​app.configure(authentication); // 2 - Add this line (Before services)​//app.configure(services);git add .git commit -m "Use feathers-mongoose-casl authentication"
```

