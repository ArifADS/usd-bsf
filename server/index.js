require('dotenv').config();
var express = require('express');
var cors = require('cors')
var axios = require("axios")
var mongoose = require('mongoose');
const { PriceHistory } = require("./models")
var app = express();
const { PORT, MONGOLAB_URI, DATA_URL } = process.env;

app.use(cors())
app.use(express.static('./client/build'));
mongoose.connect(MONGOLAB_URI, { useNewUrlParser: true });


app.get('/history/:size', async (req, res) => {
    try {
        let size = req.params.size * 1 || 50
        let history = await PriceHistory.find().sort({ date: -1 }).limit(size);
        res.json(history.reverse());
    }
    catch (e) {
        console.error(e);
        res.status(e.status || 500).send(e.message)
    }
})

app.get("/dolar", async (req, res) => {
    console.log("GET /dolar");
    try {
        let { data } = await axios(DATA_URL);
        let obj = JSON.parse(data.replace("var dolartoday = \n", ""))
        let rate = obj.EURUSD.rate
        let dt = obj.USD.dolartoday
        let sm = obj.USD.sicad2
        let petroleo = parseFloat(obj.MISC.petroleo)
        let date = Number(obj._timestamp.epoch)

        var losNombres = ["Dolar Today", "SIMADI", "Barril Petróleo"];
        var losPrecios = [dt, sm, petroleo];

        var precios = []
        for (var i = 0; i < losNombres.length; i++) {
            precios.push({ nombre: losNombres[i], precio: losPrecios[i] })
        }

        res.json({
            rate,
            precios,
            date
        })
    }
    catch (e) {
        console.error(e);
        res.status(e.status || 500).send(e.message)
    }
})

app.use((req, res, next) => {
    res.status(404).sendFile("/public/404.html", { root: __dirname });
})

app.listen(PORT, () => {
    console.log('Dolar Server listening on port ' + PORT);
})
