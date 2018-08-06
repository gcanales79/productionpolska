const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require("twilio")(accountSid, authToken);
var db = require("../models");

module.exports = function (app) {
  // Get all examples
  app.get("/api/:serial", function (req, res) {
    db.Daimler.findOne({
      where: {
        serial: req.params.serial
      }
    }).then(function (dbDaimler) {
      res.json(dbDaimler);
      //console.log(dbDaimler);
    });
  });

  // Create a new serial
  app.post("/api/serial", function (req, res) {
    db.Daimler.create(req.body).then(function (dbDaimler) {
      res.json(dbDaimler);

    });
  });

  app.post("/api/repetido", function (req, res) {
    db.Daimler.update({
      repetida: true,
    }, {
        where: {
          serial: req.body.serial
        }

      })


  });

  app.post("/message", function (req, res) {
    var telefonos = [process.env.GUS_PHONE];

    for (var i = 0; i < telefonos.length; i++) {
      client.messages.create({
        from: process.env.TWILIO_PHONE, // From a valid Twilio number
        body: "Salio una pieza con serial repetido. El serial es " + req.body.serial,
        to: telefonos[i],  // Text this number
        
      })
        .then((message) => console.log(message.sid))
        .done();
    }
  });

  app.post("/api/cambioetiqueta",function (req,res){
    db.Daimler.create({
      serial: req.body.serial,
      etiqueta_remplazada: req.body. etiqueta_remplazada,
      repetida:true,
    }).then(function (dbDaimler) {
      res.json(dbDaimler);

    });
  })

  app.get("/api/all/:serial", function (req, res) {
    db.Daimler.findAll({
      where: {
        serial: req.params.serial
      }
    }).then(function (dbDaimler) {
      res.json(dbDaimler);
      //console.log(dbDaimler);
    });
  });

  
  



};

