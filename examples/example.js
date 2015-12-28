var MongoClient = require('mongodb').MongoClient
    , assert = require('assert')
    , DbClass = require('./node_modules/mongodb/lib/db')
    , DbC = require('mongodb').Db;

console.log('is db exposed', (DbClass === DbC));

// Connection URL
var url = 'mongodb://localhost:27017/myproject';
// Use connect method to connect to the Server
MongoClient.connect(url, function(err, db) {
    assert.equal(null, err);
    console.log("Connected correctly to server");

    console.log('db instanceof DbClass', db instanceof DbClass);
    console.log('db instanceof DbC', db instanceof DbC);

    db.close();
});