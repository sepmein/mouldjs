/**
 * Created by Spencer on 15/12/27.
 */
'use strict';
class Validator {
    constructor(db, collection, validator) {

    }
}

class Schema {
    constructor(validator) {
        this.validator = validator;
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
    }

    applyTo(db, collection) {
        db.command({
            collMod: collection
        });
    }
}

module.exports = Schema;