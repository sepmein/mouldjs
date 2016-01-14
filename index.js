/**
 * Created by Spencer on 15/12/27.
 */
'use strict';
const is = require('is-js');
const Collection = require('./node_modules/mongodb/lib/collection');
const Db = require('mongodb').Db;

class Mould {
    constructor(validator) {
        this.validator = validator;
        this.validationLevel = 'strict';
        this.validationAction = 'error';
    }

    setValidationLevel(level) {
        let levels = ['strict', 'moderate', 'off'];
        let match;
        for (let l of levels) {
            if (l === level) {
                match = level;
            }
        }
        if (match) {
            this.validationLevel = match;
        } else {
            throw(new Error('[mongo-schema-native] #validation level ' +
                'should be one of ( strict / moderate / off )'));
        }
        return this;
    }

    setValidationAction(action) {
        let actions = ['warn', 'error'];
        let match;
        for (let a of actions) {
            if (a === action) {
                match = action;
            }
        }
        if (match) {
            this.validationAction = match;
        } else {
            throw(new Error('[mongo-schema-native] #validation action ' +
                'should be one of ( warn / error )'));
        }
        return this;
    }

    applyTo(db, collection) {
        let coll, validationCmd;
        if (is.string(collection)) {
            coll = collection;
        } else if (collection instanceof Collection) {
            coll = collection.collectionName;
        } else {
            throw(new Error('[mongo-schema-native] #applyTo ' +
                'collection should be a string or mongodb Collection instance'));
        }
        if(!(db instanceof Db)) {
            throw(new Error('[mongo-schema-native] #applyTo ' +
                'db should be an instance of mongodb connection'));
        }
        //construct validation
        validationCmd = {
            collMod: coll,
            validator : this.validator,
            validationLevel: this.validationLevel,
            validationAction: this.validationAction
        };
        //make commands
        return new Promise((resolve, reject) => {
            Mould.checkCollectionExists(db, coll)
                .then((result)=> {
                    if (!result) {
                        db.createCollection(coll)
                            .then(()=> {
                                db.command(validationCmd).then((result) =>resolve(result));
                            });
                    } else {
                        db.command(validationCmd).then((result) => resolve(result));
                    }
                })
                .catch((err) => {
                    reject(err);
                });
        });
    }

    /**
     * @method
     * @param {Object} db
     * @param {String} collectionName
     * @return {Promise}
     * */
    static checkCollectionExists(db, collectionName) {
        let filter = {
            name: collectionName
        };
        return new Promise((resolve, reject) => {
            db.listCollections(filter).toArray((err, items) => {
                if (err) {
                    reject(err);
                } else if (items.length === 0) {
                    resolve(false);
                } else {
                    resolve(true);
                }
            });
        });
    }

    /**
     * @method
     * @param {Object} db
     * @param {String} collectionName
     * @return {Promise} then(0-no collection found | )
     * @resolve {0 - no collection found | undefined - no mould found | object - mould}
     * @reject {err}
     * */
    static getCollectionValidator(db, collectionName) {
        let filter = {
            name: collectionName
        };
        return new Promise((resolve, reject) => {
            db.listCollections(filter).toArray((err, items) => {
                if (err) {
                    reject(err);
                } else if (items.length === 0) {
                    resolve(0);
                } else if (!(items[0].options.validator)) {
                    resolve(undefined);
                } else {
                    resolve(items[0].options.validator);
                }
            });
        });
    }

    /*todo add validator*/
    validator() {

    }

    /**
     * @return {Promise}
     * */
    static isMongoVersionSupported(db) {
        return new Promise((resolve, reject)=> {
            db.admin().serverInfo(function (err, result) {
                if (err) {
                    reject(err);
                } else {
                    let version = result.versionArray;
                    if (version[0] >= 3 && version[1] >= 2) {
                        resolve(true);
                    } else {
                        reject(new Error('Schema Validation is only supported on mongodb >= 3.2.0\n' +
                            'The installed version is ' + result.version));
                    }
                }
            });
        })
    }
}

module.exports = Mould;