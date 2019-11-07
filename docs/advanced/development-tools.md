# Development  tools

### 1- Install Feathers profile

Log feathers service calls and gather profile information on them. 

```bash
npm install feathers-profiler --save
```

Add to app.js

```javascript
const { profiler } = require('feathers-profiler');

// app.configure(services); // This already there
// Add this line under the services
app.configure(profiler({ stats: 'detail' }));
```

### 2 - Add log service

On Heroku, you can use the free "papertrailapp". It very easy to add it from the Heroku dashboard  


