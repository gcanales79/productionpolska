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
  // Changes the status of the label that was repeated
  app.post("/api/repetido", function (req, res) {
    db.Daimler.update({
      repetida: true,
    }, {
        where: {
          serial: req.body.serial
        }

      }).then(function (dbDaimler) {
        res.json(dbDaimler);
      })
  });

  //Creates the registry of the repeated label
  app.post("/api/crearregistro/repetido", function (req, res) {
    //console.log("Entro al api de repetido");
    db.Daimler.create({
      serial: req.body.serial,
      repetida: true,
    }).then(function (dbDaimler) {
      res.json(dbDaimler);
    })
  });

  app.post("/message", function (req, res) {
    var telefonos = [process.env.GUS_PHONE, process.env.OMAR_PHONE,
    process.env.TAMARA_PHONE, process.env.ANGEL_PHONE, process.env.GABRIEL_PHONE, process.env.CHAVA_PHONE];

    //* Send messages thru SMS
    for (var i = 0; i < telefonos.length; i++) {
      client.messages.create({
        from: process.env.TWILIO_PHONE, // From a valid Twilio number
        body: "Salio una pieza con serial repetido. El serial es " + req.body.serial,
        to: telefonos[i],  // Text this number

      })
        .then(function (message) {
          console.log("Mensaje de texto: " + message.sid);
          res.json(message);
        });
    }

    //* Send messages thru Whatsapp
    for (var i = 0; i < telefonos.length; i++) {
      console.log("whatsapp:" + telefonos[i]);
      client.messages.create({
        from: "whatsapp:+14155238886",
        body: "Salio una pieza con serial repetido. El serial es " + req.body.serial,
        to: "whatsapp:" + telefonos[i],  // Text this number

      })
        .then(function (message) {
          console.log("Whatsapp:" + message.sid);
          res.json(message);
        });
    }
  });

  //* This is to create the label registry once it has been changed
  app.post("/api/cambioetiqueta", function (req, res) {
    db.Daimler.create({
      serial: req.body.serial,
      etiqueta_remplazada: req.body.etiqueta_remplazada,
      repetida: false,
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

  //To show the last 6 scan labels
  app.get("/api/all/tabla/seisetiquetas", function (req, res) {
    db.Daimler.findAll({
      limit: 6,
      order: [["createdAt", "DESC"]],
    }).then(function (dbDaimler) {
      res.json(dbDaimler);
      //console.log(dbDaimler)

    });
  });


};

