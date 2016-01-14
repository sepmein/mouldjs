var MongoClient = require('mongodb').MongoClient
    , assert = require('assert')
    , DbClass = require('../node_modules/mongodb/lib/db')
    , DbC = require('mongodb').Db
    , Schema = require('../index');

console.log('is db exposed', (DbClass === DbC));

// Connection URL
var url = 'mongodb://localhost:27017/myproject';
// Use connect method to connect to the Server
MongoClient.connect(url, function(err, db) {
    assert.equal(null, err);
    console.log("Connected correctly to server");

    console.log('db instanceof DbClass', db instanceof DbClass);
    console.log('db instanceof DbC', db instanceof DbC);

    var UserSchema = new Schema({
        username: {
            $exists: false,
            $type: 'string'
        },
        password: {
            $exists: true,
            $type: 'string'
        }
    });

    Schema.isMongoVersionSupported(db)
        .then((result) => {
            console.log(result);
        })
        .catch((err) => {
            console.error(err);
        });

    //console.log(UserSchema);
    UserSchema.applyTo(db, 'user1')
        .then((result)=> {
            console.log(result);
            db.close();
        })
        .catch((err) => {
            console.log(err.stack);
            db.close();
        });
});