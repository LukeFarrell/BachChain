var express = require("express");
var app = express();
var cfenv = require("cfenv");
var bodyParser = require("body-parser");
var util = require("util");
var fs = require("fs");
var request = require("request");
var fileUpload = require('express-fileupload');
var CloudantManager = require("./controllers/cloudantManager");
var FileStorageManager = require("./controllers/fileStorage");
var constants = require("./helpers/constants");
var cloudantCredentials = require("./controllers/credentials");
var Blockchain = require("./controllers/blockchain.js");
var Nessie = require("./controllers/nessie");

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({
  extended: false
}))
// parse application/json
app.use(bodyParser.json());
app.use(fileUpload());

var cloudantManager = new CloudantManager();
var fileStorageManager = new FileStorageManager();
var blockchain = new Blockchain();
var payment = new Nessie();

app.get("/", function(req, res) {
  res.sendFile("views", {root: __dirname });
});

app.post("/upload", function(req, res) {
  if (!req.files) {
    return res.status(400).send("File could not be uploaded.");
  }
  var file = req.files.audioFile;
  var fileName = req.files.audioFile.name;
  var fileData = req.files.audioFile.data;
  var userId = req.body.userId;
  var walletAddress = req.body.walletAddress;
  var price = req.body.price;
  var tempFilePath = "/tmp/" + fileName;
  // upload file locally to use for python hash
  file.mv(tempFilePath, function(err) {
    if (err) {
      console.log(err);
      return;
    }
  });
  var hashValue = null;
  var python = require('child_process').spawn(
    'python',
    ["mp3-hash.py", tempFilePath]);
    python.stdout.on('data', function(data){
      hashValue = data.toString('utf8');
      hashValue = hashValue.substring(0, hashValue.length - 1);
      fs.unlinkSync(tempFilePath);
      var data = {
        _id: hashValue,
        title: fileName,
        price: price,
        timeStamp: new Date().getTime()
      }
      cloudantManager.uploadFile(data, function(err, reply) {
        if (err) {
          if (err.headers.statusCode == 409) {
            res.end("File collision detected.");
          }
        } else {
          fileStorageManager.uploadFile(hashValue + ".mp3", fileData);
          res.end("File successfully uploaded.");
        }
      });
      blockchain.writeChain(userId, [hashValue, null, walletAddress, price], function(res) {
        if (res) {
          console.log('Successfully wrote to blockchain', res);
        }
      });
    });
  });

  app.get("/songs", function(req, res, next) {
    var options = {
      url: constants.cloundantBasePath + "/songs/_all_docs",
      auth: {
        username: cloudantCredentials.account,
        password: cloudantCredentials.password
      }
    };
    var options2 = {
      url: constants.cloundantBasePath + "/songs/",
      auth: {
        username: cloudantCredentials.account,
        password: cloudantCredentials.password
      }
    };
    var songHashes = new Array();
    var songData = new Array();
    request(options, function(err, response, body) {
      if (err) {
        res.end(err);
      }
      var json = JSON.parse(response.body);
      json.rows.forEach(function(document) {
        songHashes.push(document.id);
        options2.url = constants.cloundantBasePath + "/songs/" + document.id;
        request(options2, function(err, innerRes, body) {
          if (err) {
            res.end(err);
          }
          var json = JSON.parse(innerRes.body);
          songData.push(json);
          if (songData.length == songHashes.length) {
            res.json(songData);
          }
        });
      });
    });
  });

  app.get("/download", function(req, res) {
    var fileName = req.query.hashValue + ".mp3";
    var userId = req.query.userId;
    var walletAddress = req.query.walletAddress;
    var hashValue = req.query.hashValue;
    var dataArray = blockchain.readChain(userId, hashValue, function(res) {
      var dataArray = res.split('. ');
      var artistWallet = dataArray[1];
      var price = Number(dataArray[2]);
      payment.payArtist(walletAddress, artistWallet, price, function() {
        console.log('hello')
        });
      blockchain.writeChain(userId, [hashValue, walletAddress, artistWallet, price.toString()], function(res) {
        if (res) {
          console.log('Successfully wrote to blockchain', res);
        }
      });
    });
    // console.log(dataArray);
    fileStorageManager.downloadFile(fileName, function(res){}, function() {
      res.sendFile("/tmp/" + fileName);
    });
  });

  //serve static file (index.html, images, css)
  app.use(express.static(__dirname + '/views'));

  //Setting up ports
  var port = process.env.PORT || 3000
  app.listen(port, function() {
  });
