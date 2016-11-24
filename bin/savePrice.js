#!/usr/bin/env node
var request   = require("request")
var mongoose  = require('mongoose');

var url = "https://ddzcb7dwlckfq.cloudfront.net/custom/rate.js"
var mongoURI = process.env.MONGOLAB_URI || "mongodb://heroku_53f0ml6l:qj1jq2e7593ark11281m0thq52@ds011369.mlab.com:11369/heroku_53f0ml6l";

mongoose.connect(mongoURI);

var phSchema = new mongoose.Schema({
  dt       : Number,
  simadi   : Number,
  date     : Number
}),

PriceHistory = mongoose.model('PriceHistory', phSchema);

request(url, function (error, response, body) {

  if (!error && response.statusCode === 200) {

    var obj = JSON.parse(body.replace("var dolartoday = \n",""))
    var dt = obj.USD.dolartoday
    var sm = obj.USD.sicad2

    var price1 = new PriceHistory({dt:dt,date: new Date().getTime() / 1000,simadi: sm})

    console.log(price1)

    price1.save(function (err, userObj) {
      if (err) {
        console.log(err);
      } else {
        console.log('saved successfully:');
      }
      mongoose.connection.close()
    });

  }
})
