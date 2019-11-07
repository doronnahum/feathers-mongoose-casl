# Add mongoose

{% hint style="warning" %}
You can skip this step if you  find in your project this file:

src/mongoose.js

 if not,   
This step is important and do not skip it , even if you don't need posts collection, we need to create at least one mongoose service for feathers cli connect mongoDB and mongoose to our app
{% endhint %}

```text
$ feathers generate service   ? What kind of service is it? Mongoose   ? What is the name of the service? posts   ? Which path should the service be registered on? /posts   ? Does the service require authentication? Yes        
```

Update your mongo db url at the config file

```text
git add .git commit -m "Generate posts service"
```

