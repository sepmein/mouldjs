/**
 * Created by Spencer on 15/12/27.
 */
'use strict';
class Validator {
    constructor(db, collection, validator) {

    }
}

class Schema {
    constructor(db, collectionName, options, validator) {
        this.db = db;
        this.collectionName = collectionName;
        this.options = options;
        this.validator = validator;
    }

    createCollection() {
        this.collection = this.db.collection(this.collection, options);
        return this.collection;
    }

    addValidator() {
        return this.db.command(this.validator);
    }

    exec(resolve, reject) {
        let collection = this.createCollection();
        this.addValidator()
            .then( result => {
                if (result.ok) {
                    resolve(collection);
                } else {
                    reject(new Error('some Error'));
                }
            })
            .catch(error => reject(error));
    }
}

module.exports = Schema;