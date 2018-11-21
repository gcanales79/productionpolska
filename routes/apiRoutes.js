const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require("twilio")(accountSid, authToken);
var passport = require("../config/passport");
var db = require("../models");
const moment = require('moment-timezone');

module.exports = function (app) {

  // Using the passport.authenticate middleware with our local strategy.
  // If the user has valid login credentials, send them to the members page.
  // Otherwise the user will be sent an error
  app.post("/api/login", passport.authenticate("local"), function(req, res) {
    // Since we're doing a POST with javascript, we can't actually redirect that post into a GET request
    // So we're sending the user back the route to the members page because the redirect will happen on the front end
    // They won't get this or even be able to access this page if they aren't authed
    if(req.user.role==="produccion" || req.user.role==="admin"){
    res.json("/produccion");
    }
    if(req.user.role==="inspector"){
      res.json("/gp12")
    }
    //console.log(req.user)
  });

  app.post("/api/signup", function(req, res) {
    console.log(req.body);
    db.User.create({
      email: req.body.email,
      password: req.body.password
    }).then(function() {
      res.redirect(307, "/api/login");
    }).catch(function(err) {
      console.log(err);
      res.json(err);
      // res.status(422).json(err.errors[0].message);
    });
  });

   // Route for logging user out
   app.get("/logout", function(req, res) {
    req.logout();
    res.redirect("/");
  });


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
    /*for (var i = 0; i < telefonos.length; i++) {
      console.log("whatsapp:" + telefonos[i]);
      client.messages.create({
        from: "whatsapp:+14155238886",
        body: `Your {{rechazo}} code is {${req.body.serial}}`,
        to: "whatsapp:" + telefonos[i],  // Text this number

      })
        .then(function (message) {
          console.log("Whatsapp:" + message.sid);
          res.json(message);
        });
    }*/


  });

  //* Api for labels not on the database
  app.post("/notfound", function (req, res) {
    var telefonos = [process.env.GUS_PHONE,process.env.TAMARA_PHONE, process.env.GABRIEL_PHONE];
    //console.log("Manda mensaje de no en base de datos")
    //* Send messages thru SMS
    for (var i = 0; i < telefonos.length; i++) {
      client.messages.create({
        from: process.env.TWILIO_PHONE, // From a valid Twilio number
        body: "Salio una pieza en GP12 que no estaba dada de alta en la base de datos. " +
          "El serial es " + req.body.serial,
        to: telefonos[i],  // Text this number

      })
        .then(function (message) {
          console.log("Mensaje de texto: " + message.sid);
          res.json(message);
        });
    }
  });

    //* Api for labels repeated in gp12
    app.post("/repeatgp12", function (req, res) {
      var telefonos = [process.env.GUS_PHONE,process.env.TAMARA_PHONE,process.env.GABRIEL_PHONE];

      //* Send messages thru SMS
      for (var i = 0; i < telefonos.length; i++) {
        client.messages.create({
          from: process.env.TWILIO_PHONE, // From a valid Twilio number
          body: "Salio una pieza en GP12 repetida. " +
            "El serial es " + req.body.serial,
          to: telefonos[i],  // Text this number

        })
          .then(function (message) {
            console.log("Mensaje de texto: " + message.sid);
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

    //To add the date it was inspected in GP-12
    app.put("/api/gp12/:serial",function(req,res){
      db.Daimler.update({
        fecha_gp12:Date.now()
      },
      {
      where:{
        serial:req.params.serial
      }}).then(data=>{
        res.json(data)
      }).catch(function(err){
        console.log(err)
      })
    })

    //To get the last 6 GP12 scan labels
    //To show the last 6 scan labels
    app.get("/api/all/tabla/gp12seisetiquetas", function (req, res) {
      db.Daimler.findAll({
        limit: 6,
        order: [["fecha_gp12", "DESC"]],
      }).then(function (dbDaimler) {
        res.json(dbDaimler);
        //console.log(dbDaimler)

      });
    });

    //Get data between hour
    app.get("/produccionhora/:fechainicial/:fechafinal",function(req,res){
      let fechainicial=moment.unix(req.params.fechainicial).format("YYYY-MM-DD HH:mm:ss")
      let fechafinal=moment.unix(req.params.fechafinal).format("YYYY-MM-DD HH:mm:ss")
      //console.log(fechainicial)
      //console.log(fechafinal)
      //console.log(req.params.fechafinal)
      db.Daimler.findAndCountAll({
        where:{
          createdAt:{ 
            $gte:fechainicial,
            $lte:fechafinal
          },
          
        },
        distinct:true,
          col:"serial"
      }).then(data=>{
        res.json(data)
      }).catch(function(err){
        console.log(err)
      })
    });

  //* SMS Produccion del turno
  app.post("/reporte", function (req, res) {
    var telefonos = [process.env.GUS_PHONE];

    //* Send messages thru SMS
    for (var i = 0; i < telefonos.length; i++) {
      client.messages.create({
        from: process.env.TWILIO_PHONE, // From a valid Twilio number
        body: "La producción del turno de " + req.body.turno + " fue de: " + req.body.piezasProducidas,
        to: telefonos[i],  // Text this number

      })
        .then(function (message) {
          console.log("Mensaje de texto: " + message.sid);
          res.json(message);
        });
    }
  });


  };

