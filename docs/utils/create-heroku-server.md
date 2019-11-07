---
description: Create a new heroku server with mongodb DB at mLab
---

# Create heroku server

This step is optional but you need a MongoDB server to continue

### **1 - Create a new app** [https://dashboard.heroku.com](https://dashboard.heroku.com/new-app)

![](../../.gitbook/assets/ovgmuuya6r.gif)

### **2 - Add Mlab Add-ons**

inside heroku, go to resources tab and add a new Add-ons, look for mLab MongoDB

![](../../.gitbook/assets/screen-shot-2019-01-18-at-9.46.51.png)

### **3 - Create a new DB user**

open mlab from heroku and create a new DB user

![](../../.gitbook/assets/screen-shot-2019-01-18-at-9.49.28.png)

### **4 -Update "mongodb" url inside config file**

open config\default.json  
update  "mongodb":  "[mongodb://&lt;dbuser&gt;:&lt;dbpassword&gt;@ds223685.mlab.com:62685/heroku\_djwq7vg7](mongodb://<dbuser>:<dbpassword>@ds223685.mlab.com:23685/heroku_dbwq7vg7)"  
\* don't forget to replace &lt;dbuser&gt; and &lt;dbpassword"

```text
git add .git commit -m "Update mongodb url"
```

​​ 

