# Run the server

To run the sever type in the command line:

```text
npm run dev
```

#### If you want to see feathers-mongoose-casl logs then update dev script to

```text
"dev": "cross-env DEBUG=feathers-mongoose-casl nodemon src/"
```

#### If you want to see mongoose request

Open src/mongoose.js and add this line 

```text
mongoose.set('debug', true);
```

  
Now you server run on:  
[http://localhost:3030](http://localhost:3030)

You can see docs in this url:  
[http://localhost:3030/docs/](http://localhost:3030/docs/)

### You can open this dashboard to your app: [feathersjs-mongoose-casl-admin](https://feathersjs-mongoose-casl-admin.herokuapp.com)

And to work with the api in postman  
[![Run in Postman](https://run.pstmn.io/button.svg)](https://app.getpostman.com/run-collection/648e29eb55b4a26be732)  
  


### You're doing a great job so far, We have not finished yet, there are a few more steps left 



