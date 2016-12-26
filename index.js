var mongoose = require('mongoose');
var _ = require('underscore');

var observers = {};
var registered = {};

function registerPre(modelName){

    var schema = mongoose.model(modelName).schema;

    schema.pre('save', function(next){
        this.wasNew = this.isNew;
        next();
    });

    schema.post('save', function(doc){
        if(doc.wasNew)
            notify(modelName, 'create', doc);
        else
            notify(modelName, 'update', doc);
    });

    schema.post('remove', function(doc){
        notify(modelName, 'remove', doc);
    });

    registered[modelName] = true;

}

function register(modelName, method, callback){

    observers[modelName] = observers[modelName] || {};
    observers[modelName][method] = observers[modelName][method] || [];
    observers[modelName][method].push(callback);

    if(!_.has(registered, modelName))
        registerPre(modelName);

}

function unregister(modelName, method){
    if(_.has(registered, modelName)){
        delete observers[modelName][method];
    }
}

function notify(modelName, method, newDoc){
    _.each(observers[modelName][method], function(callback){
        callback(newDoc);
    });
}

module.exports = {
    register: register,
    unregister: unregister
};