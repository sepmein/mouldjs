# Mould.js
## Define Schema on Database level. 
[Document validation](https://docs.mongodb.org/v3.2/core/document-validation/) has been introduced to [MongoDb](http://mongodb.org) since version 3.2 . Before that, we could only define schema on application level.

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
let Schema = require('mouldjs')
let userSchema = new Schema({
    name  : {$type: 'string', $exists: true},
    age   : {$type: 'int', $lt: 200},
    email : {$regex: \"^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$"\} 
    sex   : {$in: ['male','female','unknown']}
});
```
>check full [schema lists](/#schema-lists).

- **Apply To Db**
```javascript
//with callback
userSchema.applyTo(db, collection, function(done){
    if(done.ok) {...}
});
//with promise
userSchema.applyTo(db, collection).then(...);
```
>[api docs](/#apis)

---
### Api
### Examples
