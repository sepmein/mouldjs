/**
 * Created by Spencer on 15/12/27.
 */
'use strict';
const is = require('is-js');
const Collection = require('./node_modules/mongodb/lib/collection');
const Db = require('mongodb').Db;

class Schema {
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

    applyTo(db, collection, cb) {
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
        if(is.function(cb)){
            db.command(validationCmd, cb);
        } else {
            return db.command(validationCmd);
        }
    }
}

module.exports = Schema;