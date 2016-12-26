var mongooseObserver = require('../index.js');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
require('should');

function registerUserModel(){
    mongoose.model('User', new Schema({
        username: String,
        name: String
    }));
}

function getModel(){
    return mongoose.model('User');
}

function connectDatabase(done){
    mongoose.connect('mongodb://localhost/model_observer_test', function(){
        registerUserModel();
        done();
    });
}

function disconnectDatabase(done){
    mongoose.connection.db.dropDatabase(function(){
        mongoose.connection.close(done);
    });
}

describe('ModelObsever Tests', function(){

    before(function(done){
        connectDatabase(done);
    });

    after(function(done){
        disconnectDatabase(done);
    });

    it('should fire create event when a record is recently created', function(done){
        var User = getModel();

        mongooseObserver.register('User', 'create', function(doc){
            doc.username.should.equal('username');
            doc.name.should.equal('name');
            mongooseObserver.unregister('User', 'create');
            done();
        });

        User.create({ username: 'username', name: 'name' });

    });

    it('should fire update event when a record is updated', function(done){
        var User = getModel();

        mongooseObserver.register('User', 'create', function(doc){
            doc.username = 'updated username';
            doc.save();
        });

        mongooseObserver.register('User', 'update', function(doc){
            doc.username.should.equal('updated username');
            mongooseObserver.unregister('User', 'create');
            mongooseObserver.unregister('User', 'update');
            done();
        });

        User.create({ username: 'username', name: 'name' });
    });

    it('should fire remove event when a record is removed', function(done){
        
        var User = getModel();

        mongooseObserver.register('User', 'create', function(doc){
            doc.remove();
        });

        mongooseObserver.register('User', 'remove', function(doc){
            done();
        });

        User.create({ username: 'username', name: 'name' });
    });


});