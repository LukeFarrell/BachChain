var request = require('superagent');
var json = require('./../purchases.json');

class Nessie {
  constructor() {
  }

  getDate() {
    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth() + 1;
    var yyyy = today.getFullYear();

    return yyyy + "-" + mm + "-" + dd;
  }


  payLabel(userId, labelId, priceOfSong) {
    var body = {
      "merchant_id": labelId,
      "medium": "balance",
      "purchase_date": this.getDate(),
      "amount": priceOfSong,
      "description": "Payment to Record Label for purchase of song"
    }

    request.post('http://api.reimaginebanking.com/accounts/' + userId + '/purchases?key=' + json.apiKey, body).end(function(err, res) {
      if (!err) {
        console.log("Label was paid by user.");
      }
    });
  }

  payArtist(userId, artistId, priceOfSong, callback) {
    var body = {
      "merchant_id": artistId,
      "medium": "balance",
      "purchase_date": this.getDate(),
      "amount": priceOfSong,
      "description": "Payment to Record Label for purchase of song"
    }

    request.post('http://api.reimaginebanking.com/accounts/' + userId + '/purchases?key=' + json.apiKey, body).end(function(err, res) {
      if (!err) {
        callback();
        console.log("Artist was paid by user.");
      } else {
        console.log(err);
      }
    });
  }

  //No implementation, just a saved request
  getAccountsByUserId(userId) {
    request.get('http://api.reimaginebanking.com/customers/' + userId +  '/accounts?key=' + json.apiKey).end(function(err, res) {
      if (!err) {
        console.log(res.body);
      } else {
        console.log(err);
      }
    });
  }

  //Possible implementation, saved request
  checkBalance(userId) {
    request.get('http://api.reimaginebanking.com/accounts/' + userId + '?key=' + json.apiKey).end(function (err, res) {
      if (err) {
        console.log(err);
      } else {
        console.log("Account Balance: $", res.body.balance);
      }
    });
  }
}

module.exports = Nessie;
