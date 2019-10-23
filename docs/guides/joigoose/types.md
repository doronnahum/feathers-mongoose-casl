# Types

* **String**

  ```jsx
    someField:  Joi.string()
  ```

* **Unique string**

  ```jsx
    someField: Joi.string()[required]().meta({unique: true}),
  ```

* **String with enums**

  ```jsx
    someField: Joi.string().valid('private', 'public','blocked'),
  ```

* **Number**

  ```jsx
    someField:  Joi.number()
  ```

* **Pointer**

  ```jsx
  someField: Joi.objectId().meta({
              type: 'ObjectId',
              ref: 'users',
              displayKey: 'email'
            }),
  ```

* **Date**

  ```jsx
    someField:  Joi.date()
  ```

* **Boolean**

  ```jsx
    someField:  Joi.boolean()
  ```

* **Arrays**

  ```jsx
    someField:  Joi.array()
  ```

* **Arrays of String**

  ```jsx
    someField:  Joi.array().items(Joi.string())
  ```

* **Arrays of Reference**

  ```jsx
    someField:  Joi.array().items(Joi.string().meta({ type: 'ObjectId', ref: 'rules', displayKey: 'name' })),
  ```

* **Object**

  ```jsx
    someField:  Joi.object({
       user: Joi.objectId().meta({
        type: 'ObjectId',
        ref: 'users',
        displayKey: 'email'
      }),
       rules: Joi.array().items(Joi.string().meta({ type: 'ObjectId', ref: 'users', displayKey: 'name'})),
       blockAll: Joi.boolean()
       })
  ```

### Allow null?

```jsx
verifyExpires: Joi.date().allow(null)
```

### Default Value?

```jsx
status: Joi.string().meta({ default: 'pending'})
```

