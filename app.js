var express   = require('express');
var request   = require("request")
var mongoose  = require('mongoose');

var app = express();
var port = process.env.PORT || 5694;
var mongoURI = process.env.MONGOLAB_URI || "mongodb://heroku_53f0ml6l:qj1jq2e7593ark11281m0thq52@ds011369.mlab.com:11369/heroku_53f0ml6l";

app.use(express.static('public'));
mongoose.connect(mongoURI);

var phSchema = new mongoose.Schema({
  dt       : Number,
  simadi   : Number,
  date     : Number
}),

PriceHistory = mongoose.model('PriceHistory', phSchema);


app.get('/history',function(req,res){

  PriceHistory.find().sort({date:-1}).limit(49).exec(function (err, history) {
    res.json(history.reverse());
  })
})

app.get('/savePrice',function(req,res){
  res.set('Content-Type', 'application/json');
  var url = "https://ddzcb7dwlckfq.cloudfront.net/custom/rate.js"

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
          console.log('saved successfully:', userObj);
        }
      });

    }
  })
})


app.get('/dolar', function (req, res) {
  console.log("GET /dolar");

  var url = "https://ddzcb7dwlckfq.cloudfront.net/custom/rate.js"

  request(url, function (error, response, body) {

    if (!error && response.statusCode === 200) {

      var obj = JSON.parse(body.replace("var dolartoday = \n",""))
      var rate = obj.EURUSD.rate
      var dt = obj.USD.dolartoday
      var sm = obj.USD.sicad2
      var petroleo = parseFloat(obj.MISC.petroleo)
      var epoch = Number(obj._timestamp.epoch)

      var losNombres = ["Dolar Today", "SIMADI","Barril Petróleo"];
      var losPrecios = [dt,sm,petroleo];

      var precios = []
      for (var i = 0; i < losNombres.length; i++){
        precios.push({nombre:losNombres[i],precio:losPrecios[i]})
      }

      var obj = {rate:rate,date:epoch,precios:precios}
      res.json(obj);
    }
    else{
      res.json({error:true,msg:"Problema cargando Dolar Today"})
    }
  })

});

app.use(function(req, res, next) {
  res.status(404).sendFile("/public/404.html", { root : __dirname});
});

app.listen(port, function () {
  console.log('Example app listening on port ' + port);
});
