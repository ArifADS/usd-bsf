var express = require('express');
var app = express();
var request = require("request")
var port = process.env.PORT || 5000;


app.use(express.static('public'));

app.get('/sendPush',function(req,res){
  res.sendFile("/public/sendMensajePush.html", { root : __dirname});
})

app.get('/dolar', function (req, res) {

  res.set('Content-Type', 'application/json');

  var url = "https://ddzcb7dwlckfq.cloudfront.net/custom/rate.js"

  request(url, function (error, response, body) {

    if (!error && response.statusCode === 200) {

      var obj = JSON.parse(body.replace("var dolartoday = \n",""))
      var rate = obj.EURUSD.rate
      var dt = obj.USD.dolartoday
      var sm = obj.USD.sicad2



      var losNombres = ["Dolar Today", "SIMADI"];
      var losPrecios = [dt,sm];

      var precios = []



      for (var i = 0; i < losNombres.length; i++)
      {
        precios.push({nombre:losNombres[i],precio:losPrecios[i]})
      }

      var obj = {rate:rate,precios:precios}
      res.send(JSON.stringify(obj,null,2))
    }
  })

});

app.listen(port, function () {
  console.log('Example app listening on port ' + port);
});
