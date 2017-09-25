var credentials = require('./credentials');
var async = require('async');
var Cloudant = require('cloudant')(credentials);

var database = Cloudant.use('songs');

class CloudantManager {
  constructor() {}

  uploadFile(data, callback) {
    database.insert(data, function(err, reply) {
      callback(err, reply);
    })
  }

  retrieveFile(fileHash, callback) {
    database.get(fileHash, function(err, data) {
      callback(err, data);
    })
  }
}

module.exports = CloudantManager;
