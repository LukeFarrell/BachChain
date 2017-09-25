var credentials = require('./fileStorage-credentials');
var ObjectStorage = require('bluemix-objectstorage').ObjectStorage;
var fs = require('fs');
var path = require('path');

var mp3Database = new ObjectStorage(credentials);

class FileStorageManager {
  constructor() {
  }
  downloadFile(fileName, res, callback) {
    var objStorageObj;
    mp3Database.getContainer('test')
    .then(function(container) {
      return container.getObject(fileName);
    })
    .then(function(object) {
      objStorageObj = object;
      return object.load(false, true);
    })
    .then(function(content) {
      var contentType = objStorageObj.getContentType();
      console.log(content);
      // Save a copy of the mp3 file locally
      fs.writeFile("/tmp/" + fileName, content, function(err) {
        if (err) {
          console.log(err);
        } else {
          console.log("successfully saved a local copy");
          callback();
        }
      });
      res.header('Content-Type', contentType);
      res.status(200).send(content);
    })
    .catch(function(err) {
      if (err.name === 'ResourceNotFoundError') {
        res.status(404).send(err.message);
      }
      else {
        res.status(500).send(err.message);
      }
    });
  }

  uploadFile(fileName, data, res) {
    mp3Database.getContainer('test')
    .then(function(container) {
      return container.createObject(fileName, data, true);
    })
    .then(function() {
      console.log("Successfully uploaded file to file storage");
      res.status(200).send();
    })
    .catch(function(err) {
      res.status(500).send(err.message);
    });
  }

}

module.exports = FileStorageManager;
