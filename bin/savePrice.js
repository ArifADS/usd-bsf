#!/usr/bin/env node
var axios = require("axios")
var mongoose = require('mongoose');
const { PriceHistory } = require("./server/models/")

var url = "https://ddzcb7dwlckfq.cloudfront.net/custom/rate.js"
var mongoURI = process.env.MONGOLAB_URI || "mongodb://heroku_53f0ml6l:qj1jq2e7593ark11281m0thq52@ds011369.mlab.com:11369/heroku_53f0ml6l";

mongoose.connect(mongoURI);

axios(url).then(({ data }) => {
  let obj = JSON.parse(data.replace("var dolartoday = \n", ""))

  var dt = obj.USD.dolartoday
  var sm = obj.USD.sicad2

  var price1 = new PriceHistory({ dt: dt, date: new Date().getTime() / 1000, simadi: sm })

  return price1.save()
})
.then(obj=>{
  console.log('saved successfully:');
  mongoose.connection.close()
})
.catch(console.error)
