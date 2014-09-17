MongooseObserver
=========

A small library that provides methods to listen changes in mongoose models.

## Installation

```shell
  npm install mongoose-observer
```

## Usage

In order to use this library, you have to create and register a model using mongoose. After that, you can
register listeners to create and update events using the following API:

```js
    mongooseObserver.register(modelName, event, callback)
```

Example:

```js
  var mongooseObserver = require('mongoose-observer')
  
  mongooseObserver.register('User', 'create', function(createdUser){
    // this callback will be executed when a new user is created
    // Do something here, for example, send a email to the created user
  });

  mongooseObserver.register('User', 'update', function(updatedUser){
    // this callback will be executed when a User record is updated
    // Do something here, for example, emit changes to client via socket.io
  });

```

## Tests

  npm test

## Contributing

Add unit tests for any new or changed functionality. Lint and test your code.

## Release History

* 0.1.1 Small changes to README.md
* 0.1.0 Initial release