const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require("twilio")(accountSid, authToken);
var passport = require("../config/passport");
var db = require("../models");
const moment = require('moment-timezone');
const { check, validationResult } = require('express-validator/check');
var async = require("async");
var nodemailer = require("nodemailer");
var crypto = require("crypto");
const Sequelize = require('sequelize');
const Op = Sequelize.Op;




module.exports = function (app) {

  // Using the passport.authenticate middleware with our local strategy.
  // If the user has valid login credentials, send them to the members page.
  // Otherwise the user will be sent an error
  app.post("/api/login", passport.authenticate("local", { failureRedirect: "/", badRequestMessage: "Por favor llena la forma", failureFlash: true }), function (req, res) {
    // Since we're doing a POST with javascript, we can't actually redirect that post into a GET request
    // So we're sending the user back the route to the members page because the redirect will happen on the front end
    // They won't get this or even be able to access this page if they aren't authed    


    if (req.user.role === "user" || req.user.role === "admin") {
      res.cookie("usuario", req.user.email)
      res.redirect("/produccion");

    }
    if (req.user.role === "inspector") {
      res.cookie("usuario", req.user.email)
      res.redirect("/gp12")
    }

  })

  app.post("/api/signup", [
    check("email").isEmail().withMessage("No es un correo valido"),
    check("password").isLength({ min: 5 }).withMessage("La contraseña debe tener 5 caracteres  ")
  ], (req, res) => {
    const errors = validationResult(req)
    //Revisa si hay errores
    let message = [];
    let errorsMessage = errors.array()
    if (!errors.isEmpty()) {
      for (let i = 0; i < errorsMessage.length; i++) {
        //console.log(errorsMessage)
        message.push({
          type: "alert alert-danger",
          message: errorsMessage[i].msg
        }),
          console.log(message)
      }
      req.session.sessionFlash = message,
        res.redirect("/alta")

    }
    else {
      db.User.create({
        email: req.body.email,
        password: req.body.password
      }).then(function (data) {
        req.session.sessionFlash = [{
          type: "alert alert-success",
          message: "Usuario agregado exitosamente"
        }]
        //console.log(req.flash("info"))
        res.redirect("/alta");
      }).catch(function (err) {
        console.log(err);
        res.json(err);
        // res.status(422).json(err.errors[0].message);
      });
    }
  });



  // Route for logging user out
  app.get("/logout", function (req, res) {
    req.logout();
    res.redirect("/");
  });

  //API to get the data from the email
  app.post("/api/production", function (req, res) {
    if (req.body.shift == 3) {
      db.Polska.create({
        line_br10: req.body.line_br10,
        line_hr10_lp1: req.body.line_hr10_lp1,
        line_hr10_lp2: req.body.line_hr10_lp2,
        line_hr16_lp1: req.body.line_hr16_lp1,
        line_stf3: req.body.line_stf3,
        turno: req.body.shift,
        dia: moment(req.body.date, "DD-MM-YYYY").subtract(1, "day").day(),
        fecha: moment(req.body.fecha).subtract(1, "day").format("YYYY-MM-DD"),
      }).then(function (dbPolska) {
        res.json(dbPolska)
      })
        .catch(function (error) {
          res.json(error)
        })
    }
    else {
      db.Polska.create({
        line_br10: req.body.line_br10,
        line_hr10_lp1: req.body.line_hr10_lp1,
        line_hr10_lp2: req.body.line_hr10_lp2,
        line_hr16_lp1: req.body.line_hr16_lp1,
        line_stf3: req.body.line_stf3,
        turno: req.body.shift,
        dia: moment(req.body.date, "DD-MM-YYYY").day(),
        fecha: moment(req.body.fecha).format("YYYY-MM-DD"),
      }).then(function (dbPolska) {
        res.json(dbPolska)
      })
        .catch(function (error) {
          res.json(error)
        })
    }
  })

  //API to get the data from the email (2nd Version)
  app.post("/api/produccion", function (req, res) {
    if (req.body.shift == 3) {
      db.Polska2.create({
        ws2_hr16: req.body.ws2_hr16,
        ws3a_cell1: req.body.ws3a_cell1,
        ws3a_cell2: req.body.ws3a_cell2,
        ws3b_hr10det: req.body.ws3b_hr10det,
        ws3b_hr10gpf: req.body.ws3b_hr10gpf,
        ws4_br10ed: req.body.ws4_br10ed,
        ws4_br10bja: req.body.ws4_br10bja,
        ws4_br10gpf: req.body.ws4_br10gpf,
        stf3_hr10: req.body.stf3_hr10,
        stf3_br10: req.body.stf3_br10,
        stf3_hr16: req.body.stf3_hr16,
        stf4_hr10: req.body.stf4_hr10,
        stf4_br10: req.body.stf4_br10,
        stf4_hr16: req.body.stf4_hr16,
        turno: req.body.shift,
        dia: moment(req.body.date, "DD-MM-YYYY").subtract(1, "day").day(),
        fecha: moment(req.body.fecha).subtract(1, "day").format("YYYY-MM-DD"),
      }).then(function (dbPolska2) {
        res.json(dbPolska2)
      })
        .catch(function (error) {
          res.json(error)
        })
    }
    else {
      db.Polska2.create({
        ws2_hr16: req.body.ws2_hr16,
        ws3a_cell1: req.body.ws3a_cell1,
        ws3a_cell2: req.body.ws3a_cell2,
        ws3b_hr10det: req.body.ws3b_hr10det,
        ws3b_hr10gpf: req.body.ws3b_hr10gpf,
        ws4_br10ed: req.body.ws4_br10ed,
        ws4_br10bja: req.body.ws4_br10bja,
        ws4_br10gpf: req.body.ws4_br10gpf,
        stf3_hr10: req.body.stf3_hr10,
        stf3_br10: req.body.stf3_br10,
        stf3_hr16: req.body.stf3_hr16,
        stf4_hr10: req.body.stf4_hr10,
        stf4_br10: req.body.stf4_br10,
        stf4_hr16: req.body.stf4_hr16,
        turno: req.body.shift,
        dia: moment(req.body.date, "DD-MM-YYYY").day(),
        fecha: moment(req.body.fecha).format("YYYY-MM-DD"),
      }).then(function (dbPolska2) {
        res.json(dbPolska2)
      })
        .catch(function (error) {
          res.json(error)
        })
    }
  })

  //Get data for day shift
  app.get("/produccionhoradia/:fechainicial/:fechafinal/", function (req, res) {
    let fechainicial = moment.unix(req.params.fechainicial).format("YYYY-MM-DD HH:mm:ss")
    let fechafinal = moment.unix(req.params.fechafinal).format("YYYY-MM-DD HH:mm:ss")
    //console.log(fechainicial)
    //console.log(fechafinal)
    //console.log(req.params.fechafinal)
    db.Polska2.findAll({
      where: {
        fecha: {
          [Op.gte]: fechainicial,
          [Op.lte]: fechafinal
        },
        turno: {
          [Op.eq]: 1
        }
      },
      order: [
        ["dia", "ASC"]
      ]
    }).then(data => {
      res.json(data)
    }).catch(function (err) {
      console.log(err)
    })
  });

  //Get data for afternoon shift
  app.get("/produccionhoratarde/:fechainicial/:fechafinal/", function (req, res) {
    let fechainicial = moment.unix(req.params.fechainicial).format("YYYY-MM-DD HH:mm:ss")
    let fechafinal = moment.unix(req.params.fechafinal).format("YYYY-MM-DD HH:mm:ss")
    //console.log(fechainicial)
    //console.log(fechafinal)
    //console.log(req.params.fechafinal)
    db.Polska2.findAll({
      where: {
        fecha: {
          [Op.gte]: fechainicial,
          [Op.lte]: fechafinal
        },
        turno: {
          [Op.eq]: 2
        }
      },
      order: [
        ["dia", "ASC"]
      ]
    }).then(data => {
      res.json(data)
    }).catch(function (err) {
      console.log(err)
    })
  });

  //Get data for night shift
  app.get("/produccionhoranoche/:fechainicial/:fechafinal/", function (req, res) {
    let fechainicial = moment.unix(req.params.fechainicial).format("YYYY-MM-DD HH:mm:ss")
    let fechafinal = moment.unix(req.params.fechafinal).format("YYYY-MM-DD HH:mm:ss")
    //console.log(fechainicial)
    //console.log(fechafinal)
    //console.log(req.params.fechafinal)
    db.Polska2.findAll({
      where: {
        fecha: {
          [Op.gte]: fechainicial,
          [Op.lte]: fechafinal
        },
        turno: {
          [Op.eq]: 3
        }
      },
      order: [
        ["dia", "ASC"]
      ]
    }).then(data => {
      res.json(data)
    }).catch(function (err) {
      console.log(err)
    })
  });

  //Get data for the production of all the week
  app.get("/produccionsemana/:fechainicial/:fechafinal/", function (req, res) {
    let fechainicial = moment.unix(req.params.fechainicial).format("YYYY-MM-DD HH:mm:ss")
    let fechafinal = moment.unix(req.params.fechafinal).format("YYYY-MM-DD HH:mm:ss")
    //console.log(fechainicial)
    //console.log(fechafinal)
    //console.log(req.params.fechafinal)
    db.Polska2.findAll({
      where: {
        fecha: {
          [Op.gte]: fechainicial,
          [Op.lte]: fechafinal
        },
      }
    }).then(data => {
      res.json(data)
    }).catch(function (err) {
      console.log(err)
    })
  });

  //Get the goals for each line of
  app.get("/goalslinea", (req, res) => {
    db.Goal.findAll({

    })
      .then(data => {
        res.json(data)
      }).catch((err) => {
        console.log(err)
      })
  })

  //Update the goal of a line
  app.put("/api/updategoal/:line", (req, res) => {
    switch (req.params.line) {
      case "1":
        //console.log("Entro")
        db.Goal.update({
          daily_hr10: req.body.newGoal,
        }, {
          where: {
            id: 1,
          }
        }
        ).then(function (data) {
          req.session.sessionFlash = [{
            type: "alert alert-success",
            message: "Goal Updated Successfully"
          }]
          if (data) {

            return res.status(200).send({ result: 'redirect', url: '/production-goals' })
          } else {
            return res.status(401).send({ error: "Something is wrong." })
          }
        })
        break;
      case "2":
        db.Goal.update({
          daily_br10: req.body.newGoal,
        }, {
          where: {
            id: 1,
          }
        }
        ).then(function (data) {
          req.session.sessionFlash = [{
            type: "alert alert-success",
            message: "Goal Updated Successfully"
          }]
          if (data) {

            return res.status(200).send({ result: 'redirect', url: '/production-goals' })
          } else {
            return res.status(401).send({ error: "Something is wrong." })
          }
        })
        break;
      case "3":
        db.Goal.update({
          daily_hr16: req.body.newGoal,
        }, {
          where: {
            id: 1,
          }
        }
        ).then(function (data) {
          req.session.sessionFlash = [{
            type: "alert alert-success",
            message: "Goal Updated Successfully"
          }]
          if (data) {

            return res.status(200).send({ result: 'redirect', url: '/production-goals' })
          } else {
            return res.status(401).send({ error: "Something is wrong." })
          }
        })
        break;
      case "4":
        db.Goal.update({
          wk_hr10: req.body.newGoal,
        }, {
          where: {
            id: 1,
          }
        }
        ).then(function (data) {
          req.session.sessionFlash = [{
            type: "alert alert-success",
            message: "Goal Updated Successfully"
          }]
          if (data) {

            return res.status(200).send({ result: 'redirect', url: '/production-goals' })
          } else {
            return res.status(401).send({ error: "Something is wrong." })
          }
        })
        break;
      case "5":
        db.Goal.update({
          wk_br10: req.body.newGoal,
        }, {
          where: {
            id: 1,
          }
        }
        ).then(function (data) {
          req.session.sessionFlash = [{
            type: "alert alert-success",
            message: "Goal Updated Successfully"
          }]
          if (data) {

            return res.status(200).send({ result: 'redirect', url: '/production-goals' })
          } else {
            return res.status(401).send({ error: "Something is wrong." })
          }
        })
        break;
      case "6":
        db.Goal.update({
          wk_hr16: req.body.newGoal,
        }, {
          where: {
            id: 1,
          }
        }
        ).then(function (data) {
          req.session.sessionFlash = [{
            type: "alert alert-success",
            message: "Goal Updated Successfully"
          }]
          if (data) {

            return res.status(200).send({ result: 'redirect', url: '/production-goals' })
          } else {
            return res.status(401).send({ error: "Something is wrong." })
          }
        })
        break;

    }
  })

  //*! SMS Produccion de la semana reporte Polonia
  app.post("/reportepolonia", function (req, res) {
    var telefonos = [process.env.GUS_PHONE]
    /*
    //* Send messages thru SMS

    for (var i = 0; i < telefonos.length; i++) {
      client.messages.create({
        from: process.env.TWILIO_PHONE, // From a valid Twilio number
        body: "The production report from last week: \n" +
          "HR10 Line: " + req.body.produccion_hr10 + ". Goal: 12,000. \n" +
          "BR10 Line: " + req.body.produccion_br10 + ". Goal: 5,500. \n" +
          "HR16 Line: " + req.body.produccion_hr16 + ". Goal: 7,500. \n",
        to: telefonos[i],  // Text this number

      })
        .then(function (message) {
          console.log("Mensaje de texto: " + message.sid);
          res.json(message);
        });
    }
    */

    //* Send message thry whatsapp
    for (var i = 0; i < telefonos.length; i++) {
      console.log("whatsapp:" + process.env.TWILIO_PHONE);
      client.messages.create({
        from: "whatsapp:" + process.env.TWILIO_PHONE, // From a valid Twilio number,
        body: "The production report from last week:\n" +
          "HR10 Line: " + "*" + req.body.produccion_hr10 + "*" + ". Goal: " + req.body.meta_hr10 + ".\n" +
          "BR10 Line: " + "*" + req.body.produccion_br10 + "*" + ". Goal: " + req.body.meta_br10 + ".\n" +
          "HR16 Line: " + "*" + req.body.produccion_hr16 + "*" + ". Goal: " + req.body.meta_hr16 + ".",
        to: "whatsapp:" + telefonos[i],  // Text this number
        //La producción de la linea de Daimler del turno de {{1}} fue de: {{2}}

      })
        .then(function (message) {
          console.log("Whatsapp:" + message.sid);
          res.json(message);
        })
        .catch(function (error) {
          res.json(error)
        });
    }

  });

  //*! SMS Produccion diaro reporte Polonia
  app.post("/reportediariopolonia", function (req, res) {
    var telefonos = [process.env.GUS_PHONE]

    /*
    //* Send messages thru SMS

    for (var i = 0; i < telefonos.length; i++) {
      client.messages.create({
        from: process.env.TWILIO_PHONE, // From a valid Twilio number
        body: "The production report from yesterday: \n" +
        "HR10 Line: " + req.body.produccion_hr10 + ". Goal: 2,400. \n" + 
        "BR10 Line: " + req.body.produccion_br10 + ". Goal: 1,100. \n" + 
        "HR16 Line: " + req.body.produccion_hr16 + ". Goal: 1,500. \n",
        to: telefonos[i],  // Text this number

      })
        .then(function (message) {
          console.log("Mensaje de texto: " + message.sid);
          res.json(message);
        });
    }*/



    //* Send message thru whatsapp
    for (var i = 0; i < telefonos.length; i++) {
      console.log("whatsapp:" + telefonos[i]);
      client.messages.create({
        from: "whatsapp:" + process.env.TWILIO_PHONE, // From a valid Twilio number,
        body: "The production report from yesterday:\n" +
          "HR10 Line: " + "*" + req.body.produccion_hr10 + "*" + ". Goal: " + req.body.meta_hr10 + ".\n" +
          "BR10 Line: " + "*" + req.body.produccion_br10 + "*" + ". Goal: " + req.body.meta_br10 + ".\n" +
          "HR16 Line: " + "*" + req.body.produccion_hr16 + "*" + ". Goal: " + req.body.meta_hr16 + ".",
        to: "whatsapp:" + telefonos[i],  // Text this number
        /*
      The production report from yesterday: 
      HR10 Line: {{1}}. Goal: {{2}}. 
      BR10 Line: {{3}}. Goal: {{4}}. 
      HR16 Line: {{5}}. Goal: {{6}}.  
        */

      })
        .then(function (message) {
          console.log("Whatsapp:" + message.sid);
          res.json(message);
        })
        .catch(function (error) {
          res.json(error)
        });
    }

  });



  //*! SMS Produccion de la semana reporte Mexico
  app.post("/reportemexico", function (req, res) {
    var telefonos = [process.env.GUS_PHONE, process.env.CARLOS_PHONE]
    /*
    //* Send messages thru SMS
    
        for (var i = 0; i < telefonos.length; i++) {
          client.messages.create({
            from: process.env.TWILIO_PHONE, // From a valid Twilio number
            body: "The production of HR10 line for last week was: " + req.body.produccion + ". The contracted capacity "+
            "per week is 9,000 pcs",
            to: telefonos[i],  // Text this number
    
          })
            .then(function (message) {
              console.log("Mensaje de texto: " + message.sid);
              res.json(message);
            });
        }
  
    */

    //* Send message thru whatsapp
    for (var i = 0; i < telefonos.length; i++) {
      console.log("whatsapp:" + telefonos[i]);
      client.messages.create({
        from: "whatsapp:" + process.env.TWILIO_PHONE, // From a valid Twilio number,
        body: "The production report from last week:\n" +
        "HR10 Line: " + "*" + req.body.produccion_hr10 + "*" + ". Goal: " + req.body.meta_hr10 + ".\n" +
        "BR10 Line: " + "*" + req.body.produccion_br10 + "*" + ". Goal: " + req.body.meta_br10 + ".\n" +
        "HR16 Line: " + "*" + req.body.produccion_hr16 + "*" + ". Goal: " + req.body.meta_hr16 + ".",
        to: "whatsapp:" + telefonos[i],  // Text this number
        /*La producción de la linea de Daimler del turno de {{1}} fue de: {{2}}*/

      })
        .then(function (message) {
          console.log("Whatsapp:" + message.sid);
          res.json(message);
        })
        .catch(function (error) {
          res.json(error)
        });
    }
  });

  //*! SMS Produccion diaro reporte Mexico
  app.post("/reportediariomexico", function (req, res) {
    var telefonos = [process.env.GUS_PHONE, process.env.CARLOS_PHONE]
    /*
    //* Send messages thru SMS

    for (var i = 0; i < telefonos.length; i++) {
      client.messages.create({
        from: process.env.TWILIO_PHONE, // From a valid Twilio number
        body: "The production of HR10 line for yesterday was: " + req.body.produccion + ". The goal is 2,400.",
        to: telefonos[i],  // Text this number

      })
        .then(function (message) {
          console.log("Mensaje de texto: " + message.sid);
          res.json(message);
        });
    }

    */

    //* Send message thru whatsapp
    for (var i = 0; i < telefonos.length; i++) {
      console.log("whatsapp:" + telefonos[i]);
      client.messages.create({
        from: "whatsapp:" + process.env.TWILIO_PHONE, // From a valid Twilio number,
        body: "The production report from yesterday:\n" +
          "HR10 Line: " + "*" + req.body.produccion_hr10 + "*" + ". Goal: " + req.body.meta_hr10 + ".\n" +
          "BR10 Line: " + "*" + req.body.produccion_br10 + "*" + ". Goal: " + req.body.meta_br10 + ".\n" +
          "HR16 Line: " + "*" + req.body.produccion_hr16 + "*" + ". Goal: " + req.body.meta_hr16 + ".",
        to: "whatsapp:" + telefonos[i],  // Text this number
        /*La producción de la linea de Daimler del turno de {{1}} fue de: {{2}}*/

      })
        .then(function (message) {
          console.log("Whatsapp:" + message.sid);
          res.json(message);
        })
        .catch(function (error) {
          res.json(error)
        });
    }
  });




  //Route to restablish user password
  app.post('/forgot', function (req, res, next) {
    async.waterfall([
      function (done) {
        //console.log("entro 1")
        crypto.randomBytes(20, function (err, buf) {
          var token = buf.toString('hex');
          //console.log("El token es " + token)
          done(err, token);
        });
      },
      function (token, done) {
        //console.log("entro 2")
        db.User.findOne({
          where: {
            email: req.body.email
          }
        }).then(data => {
          //console.log(data)
          if (!data) {
            req.flash("error", "No hay cuenta con ese correo")
            return res.redirect("/")
          }
          db.User.update({
            resetPasswordToken: token,
            resetPasswordExpire: Date.now() + 3600000, // 1 hora
          },
            {
              where: {
                email: req.body.email
              }

            }).then(function (user, err) {
              //console.log(user)
              //console.log(err)
              done(err, token, data)
            })
        })
      },
      function (token, data, done) {
        //console.log("Entro 3")
        var smtpTransport = nodemailer.createTransport({
          service: 'Gmail',
          auth: {
            type: "OAuth2",
            user: 'netzwerk.mty@gmail.com',
            clientId: process.env.clientId,
            clientSecret: process.env.clientSecret,
            refreshToken: process.env.refreshToken,
            accessToken: process.env.accessToken
          }
        });
        var mailOptions = {
          to: data.email,
          from: 'netzwerk.mty@gmail.com',
          subject: 'Restablecer contraseña',
          text: 'Estas recibiendo este mensaje porque tu (o alguien mas) ha pedido restablecer tu contraseña de tu cuenta.\n\n' +
            ' Por favor dale click en el siguiente link, o pega el link en tu navegador para completar el proceso:\n\n' +
            'http://' + req.headers.host + '/reset/' + token + '\n\n' +
            'Si tu no pediste restablecer tu contraseña, por favor ignora este correo y tu password no sufrira cambio.\n'
        };
        smtpTransport.sendMail(mailOptions, function (err) {
          console.log('mail sent');
          req.flash('success', 'Un e-mail se ha mandado a ' + data.email + ' con las instrucciones a seguir.');
          done(err, 'done');
          //return res.redirect("/")
        });
      }
    ], function (err) {
      //console.log("Hubo error")
      if (err) return next(err);
      res.redirect('/');
    });
  });

  //Route to establish new password

  app.post('/reset/:token', function (req, res) {
    async.waterfall([
      function (done) {
        db.User.findOne({
          where: {
            resetPasswordToken: req.params.token,
            resetPasswordExpire: {
              [Op.gt]: Date.now()
            }
          }
        }).then(user => {
          if (!user) {
            req.flash("error", "El token para restablecer la contraseña ha expirado o es inválido")
            return res.redirect("/")
          }
          if (req.body.password.length > 4) {
            if (req.body.password === req.body.confirm) {
              db.User.update({
                resetPasswordToken: null,
                resetPasswordExpire: null,
                password: req.body.password
              },
                {
                  where: {
                    resetPasswordToken: req.params.token
                  },
                  individualHooks: true
                }).then(function (data, err) {
                  done(err, user)
                })
            }
            else {
              req.flash("error", "Las contraseñas no coinciden")
              return res.redirect("back")
            }
          }
          else {
            req.flash("error", "La contraseña debe tener minimo 5 caracteres")
            return res.redirect("back")
          }

        })
      },
      function (user, done) {
        var smtpTransport = nodemailer.createTransport({
          service: 'Gmail',
          auth: {
            type: "OAuth2",
            user: 'netzwerk.mty@gmail.com',
            clientId: process.env.clientId,
            clientSecret: process.env.clientSecret,
            refreshToken: process.env.refreshToken,
            accessToken: process.env.accessToken
          }
        });
        var mailOptions = {
          to: user.email,
          from: 'netzwerk.mty@gmail.com',
          subject: 'Tu contraseña ha cambiado',
          text: 'Hola,\n\n' +
            'Esta es una confirmación de que la contraseña de tu cuenta ' + user.email + ' ha cambiado.\n'
        };
        smtpTransport.sendMail(mailOptions, function (err) {
          req.flash('success', 'Contraseña actualizada correctamente.');
          done(err);
        });
      }
    ], function (err) {
      res.redirect('/');
    });
  });

  //* SMS precio de los Metales por Hora
  app.post("/metalesporhora", function (req, res) {
    var telefonos = [process.env.BERE_PHONE]

    //* Send messages thru SMS

    /*for (var i = 0; i < telefonos.length; i++) {
      client.messages.create({
        from: process.env.TWILIO_PHONE, // From a valid Twilio number
        body: "The price of Palladium is: " + req.body.palladium + " USD/oz. The original price was " +
          "960 USD/oz. The price of Rhodium is: " + req.body.rhodium + " USD/oz. The original price was " +
          "2,436 USD/oz.",
        to: telefonos[i],  // Text this number

      })
        .then(function (message) {
          console.log("Mensaje de texto: " + message.sid);
          res.json(message);
        });
    }*/



    //* Send message thru whatsapp
    for (var i = 0; i < telefonos.length; i++) {
      console.log("whatsapp:" + telefonos[i]);
      client.messages.create({
        from: "whatsapp:" + process.env.TWILIO_PHONE, // From a valid Twilio number,
        body: "The price of Palladium is: " + req.body.palladium + " USD/oz. The original price was " +
          "960 USD/oz. The price of Rhodium is: " + req.body.rhodium + " USD/oz. The original price was " +
          "2,436 USD/oz.",
        to: "whatsapp:" + telefonos[i],  // Text this number


      })
        .then(function (message) {
          console.log("Whatsapp:" + message.sid);
          res.json(message);
        })
        .catch(function (error) {
          res.json(error)
        });
    }
  });

  //* SMS precio del Paladio Arriba del Target
  app.post("/metalesprice", function (req, res) {
    var telefonos = [process.env.GUS_PHONE, process.env.CARLOS_PHONE]

    //* Send messages thru SMS

    /*for (var i = 0; i < telefonos.length; i++) {
      client.messages.create({
        from: process.env.TWILIO_PHONE, // From a valid Twilio number
        body: "The price of Palladium is over the target of 1,647 USD/oz. " +
        "The price of Palladium is: " + req.body.palladium + " USD/oz. The original price was " +
          "960 USD/oz. The price of Rhodium is: " + req.body.rhodium + " USD/oz. The original price was " +
          "2,436 USD/oz",
        to: telefonos[i],  // Text this number

      })
        .then(function (message) {
          console.log("Mensaje de texto: " + message.sid);
          res.json(message);
        });
    }*/



    // Send message thru whatsapp
    for (var i = 0; i < telefonos.length; i++) {
      console.log("whatsapp:" + telefonos[i]);
      client.messages.create({
        from: "whatsapp:" + process.env.TWILIO_PHONE, // From a valid Twilio number,
        body: "The price of Palladium is over the target of 1,750 USD/oz. The price of Palladium is: " + req.body.palladium + " USD/oz. The original price was 960 USD/oz. The price of Rhodium is: " + req.body.rhodium + " USD/oz. The original price was 2,436 USD/oz. ",
        to: "whatsapp:" + telefonos[i],  // Text this number



      })
        .then(function (message) {
          console.log("Whatsapp:" + message.sid);
          res.json(message);
        })
        .catch(function (error) {
          res.json(error)
        });
    }
  });




};

