# Service Configuration

### dashboardConfig - Inside you service options:

all the configuration is optional



* **sideBarIconName -** string  
  allow you to change the default icon on the dashboard sidebar

  [ant.design](https://ant.design/components/icon/) icon name  


  ```javascript
  dashboardConfig: {  sideBarIconName: 'user',}

  ```

* **defaultFieldsToDisplay** - array  
  default value is \['\_id','createdAt','updatedAt'\]  


  ```javascript
  // Example - hide updatedAt fielddashboardConfig: {  defaultFieldsToDisplay: ['_id','createdAt'],}
  ```

* **docLayout** -  array  
  to change the layout of the document  
  by default the input will be render one under the other  
  with docLayout you can force other layout  
  if you are passing a docLayout, only fields inside the docLayout will be render to the screen  


  ```javascript
  // Example - To hide updatedAtdashboardConfig: {  docLayout: [  ['name','color'] // render fields in the same row  'tags',  'type',  {    when: {      field: 'type',      equalTo: 'other',      then: ['otherType','info'], // render this fields only when       otherwise: ['info']    }  }  ],}
  ```

* **docTitleField -** string The field to display as page title when edit a document 
* **populate** - array  
  Use populate When you want the table to populate fields  


  ```javascript
  // Example - hide updatedAt fieldconst options = {  dashboardConfig: {    populate: ['users'],  }}
  ```

  This property only adds the populate to client request,   
  you still need to handle the ability, read this  


  {% page-ref page="../populate.md" %}

