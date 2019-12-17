---
description: 'Inside your validators files, each field can get a dashboard configuration'
---

# Field configuration

### How to add fields with specific type ?

{% page-ref page="../../joigoose/" %}

## How to configuration field in dashboard screen ?

* **label** - string Change the label of the document input and the table title
* **hide** - boolean When is true the field won't be display in the table and the document
* **allowNull -** boolean This will allow null in the client validator
* **displayKey** - string Relevant to the reference field, the field to display instead of the \_id
* **list** - object configuration that relevant only to the table
  * **hide** - boolean When is true the field won't be display in the table
  * **label** - string Change the label of the document input and the table title
  * **width** - number Table column width
  * **type** - enums can be one of: \['link'\]
    * link -when equal to link, the field will be render inside [{value}](%7Bvalue%7D)
  * **options** - same as doc options, use it when you want to display a human text
  * **dateFormat** - pass a moment formatter to your date field
* **doc** - object configuration that relevant only to the document
  * **hide** - boolean When is true the field won't be display in the document
  * hideOnCreate - boolean When is true the field won't be display when you create a new document
  * **hideOnCreate** - boolean

    When is true the field won't be display when you edit a document

  * **inputProps** - stringify object - JSON.stringify\({}\) Props to pass the input

    ```jsx
    //  ExampleJoi.string().meta({   dashboard:  {inputProps:  JSON.stringify({style:  {background:  'red'}}) )}
    ```

  * **inputType** - enum can be one of: \['file','boxSelect','textArea'\]
    * file - Use to render file upload input
    * boxSelect - Use only on array fields to render boxes with multi select 
    * textArea - Use only on string field to render [TextArea](http://beta.ant.design/components/input/#components-input-demo-textarea) input
    * timePicker - unse on Date fields 
    * imageView - To display image when the ref is to file collection with a file field
  * **options** - array Use on array of string fields, to render multi select drop down

    ```jsx
    // Exmpaletype: Joi.string().valid(Object.values(BUILDINGS_TYPE)).meta({ dashboard:  {     doc:  {         inputType:  'boxSelect',         options:  [             {value:  BUILDINGS_TYPE['stadium'], label:  'Stadium'},             {value:  BUILDINGS_TYPE['gym'], label:  'Gym', i18nLabels: { heIL: 'חדר כושר' }},         ]     } }})
    ```

  * **initialValue -** any  The input initial value on creating a new document
  * **readOnly** - boolean When true the field will be in disabled mode

All the options:

```jsx
 // all the options are optionalJoi.string().meta({  dashboard: {    label: 'FieldName',    hide: 0,    allowNull: 0,    list: {      hide: 0,      label: null,      width: 100,      type: 'link'    },    doc: {      hide: 0,      hideOnCreate: 0,      hideOnUpdate: 0,      inputProps: JSON.stringify({ ...}),      inputType: 'file',      options: array      initialValue: 'David',      readOnly: false,      displayKey: string,      optionKey: string,    }  }})
```

**Meta on object**

We can't pass dashboard in the meta of an object, this is wrong:

```jsx
const getJoiObject = function (withRequired) {  const required = withRequired ? 'required' : 'optional';  return Joi.object({    someField: Joi.object().keys({      name: Joi.number(),      age: Joi.number()    }).meta({      dashboard: { list: { hide: 1 } }    })  })}
```

The solution is to pass a meta by the child, like this:

```jsx
const getJoiObject = function (withRequired) {  const required = withRequired ? 'required' : 'optional';  return Joi.object({    someField: Joi.object().keys({      name: Joi.number().meta({        parentDashboard: {          list: { hide: 1 }        }      }),      age: Joi.number(),    })  })}
```

### 

Example of use:

```jsx
const { BUILDINGS_TYPE } = require('../enums');const getJoiObject = function (withRequired) {  const required = withRequired ? 'required' : 'optional';  return Joi.object({    name: Joi.string()[required](),    type: Joi.string().valid(Object.values(BUILDINGS_TYPE)).meta({      dashboard: {        doc: {          inputType: 'boxSelect',          options: [            { value: BUILDINGS_TYPE['stadium'], label: 'Stadium' },            { value: BUILDINGS_TYPE['gym'], label: 'Gym' },          ]        }      }    })  })}
```



