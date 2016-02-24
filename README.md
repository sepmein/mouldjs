# Mould.js
## Define Schema on Database level.
[Document validation](https://docs.mongodb.org/v3.2/core/document-validation/) has been introduced to [MongoDb](http://mongodb.org) since version 3.2 . Before that, we could only define schema on application level.
With Mould.js, we could easily define schemas on the database level, which means once the schema validator applied to collections at the bootstrap step, the document will always be validated first whenever it is inserted or modified and the validation will be connection or application independent. 

### Differences between Mould.js and Mongoose

Feature      |Mongoose      | Mould.js
:-----------:|:-----------: | :-------------:
Schema Level |Application   | Database
Features     |Full          | Minimal

### Get Started with Database Level Schema Validation
>**Attention**: `mongodb` version >= 3.2 required

- **Installation**
```
npm install mouldjs --save
```
- **Define Schema**

```javascript
let Mould = require('mouldjs')
let User = new Mould({
    name  : {$type: 'string', $exists: true},
    age   : {$type: 'int', $lt: 200},
    email : {$regex: \"^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$"\}
    sex   : {$in: ['male','female','unknown']}
});
```
>*check full [schema lists](/#schema-lists).*

- **Apply To Db**
```javascript
//with promise
User.applyTo(db, collection)
    .then(...)
    .catch(...);
```
>*[api docs](#api)*

---
### **Api**
#### Class Mould Constructor
#### .applyTo(db, collection)
Apply the `Mould` to specified collection of `db`. 
`db` is an instance of [node-mongodb-native-driver](http://mongodb.github.io/node-mongodb-native/) `Db` class.
If the collection is not found in the `db`, the method will create collection for you, then apply the mould.
If the collection is existed and already has some data, the method will success as well.
But later on, any data inserted will be tested against the Schema. 

*Parameters*:
- db: The specified db you want to apply the `Mould`.
-- type : should be an instance of [node-mongodb-native-driver](http://mongodb.github.io/node-mongodb-native/) `Db` class.
- collection: The specified collection you want to apply `Mould`.
-- type : could be a `String` which matches the collection name;
          could also be a `collection` instance of [node-mongodb-native-driver](http://mongodb.github.io/node-mongodb-native/)

*Return*:

Return a `Promise` contains information which indicates whether the application is succeeded or failed.
- type: Promise
-- resolve: {ok:1} if success
-- reject: error

###### Example

#### .setValidationLevel
#### .setValidationAction
#### static checkCollectionExists
#### static getCollectionValidator
#### static isMongoVersionSupport
### Examples
Check the examples folder
### Types
Types: https://docs.mongodb.org/v3.2/reference/operator/query/type/#document-type-available-types
### Validators
Validator: https://docs.mongodb.org/v3.2/core/document-validation/

---
TODO
- add validator
