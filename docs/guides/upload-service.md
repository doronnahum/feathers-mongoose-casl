---
description: >-
  Upload files to AWS s3 or to public folder service and save the new file url
  inside files collection
---

# Upload service

### feathers-mongoose-casl support 4 uploads options-

1. **local-public**- upload a file to public folder in the server 

2. **local-private** - upload a file to private folder in the server 

3. **s3** - upload a file to amazon s3 

4. **google-storage** - upload a file to google storage

{% hint style="info" %}
You can update in the config file api\_key to s3/google-storage if needed feathers-mongoose-casl cam with a built-in collection, the collection name files. by default, we upload to local-private, if you want to change this default the open config file and change "defaultFileService": "local-private" value
{% endhint %}

### Read this guide to understand uploads service

{% page-ref page="upload-files/" %}









  






