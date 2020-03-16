var request = require('request');
var cheerio = require('cheerio');
const axios = require("axios");

request('https://www.kitco.com/market/', function (err, resp, html) {
    if (!err) {
        const $ = cheerio.load(html);
        //console.log(html); 
        let pricePD = parseFloat($("#PD-bid").text());
        let priceRH = parseFloat($("#RH-bid").text());
        console.log(pricePD);
        console.log(priceRH)
        axios.post("https://polskakpi.com/metalesporhora", {
            palladium: pricePD,
            rhodium: priceRH
        }).then(function (response) {
            console.log(response.statusText)
        }).catch(function (err) {
            console.log(err)
        })

    }
});