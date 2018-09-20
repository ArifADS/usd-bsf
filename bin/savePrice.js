#!/usr/bin/env node
var axios = require("axios")
var mongoose = require('mongoose');
const { PriceHistory } = require("../server/models/")
const { DATA_URL, MONGOLAB_URI } = process.env;

mongoose.connect(MONGOLAB_URI, { useNewUrlParser: true });

savePrice().catch(e => console.error(e));

async function savePrice() {
  let { data } = await axios(DATA_URL);
  let obj = JSON.parse(data.replace("var dolartoday = \n", ""))
  var dt = obj.USD.dolartoday
  var sm = obj.USD.sicad2

  var price1 = new PriceHistory({ dt: dt, date: new Date().getTime() / 1000, simadi: sm })
  await price1.save();
  console.log('saved successfully:');
  mongoose.connection.close()
}
