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


    if (req.user.role === "produccion" || req.user.role === "admin") {
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
    /*var hora = new Date().getHours();
    var turno;
    //console.log(typeof(hora));
    if (hora >= 6 && hora < 14) {
      turno = 1
    }
    if (hora >= 14 && hora < 22) {
      turno = 2
    }
    if ((hora >= 22 && hora < 24) || (hora >= 0 && hora < 6)) {
      turno = 3
    }*/
    //console.log("El turno es "+ turno)
    /*var dia = new Date().getDay();*/
    //console.log("El dia es " + dia)
    db.Polska.create({
      line_br10: req.body.line_br10,
      line_hr10_lp1: req.body.line_hr10_lp1,
      line_hr10_lp2: req.body.line_hr10_lp2,
      line_hr16_lp1: req.body.line_hr16_lp1,
      line_stf3: req.body.lines_stf3,
      turno: req.body.shift,
      dia: moment(req.body.date,"DD-MM-YYYY").day(),
      fecha: moment(req.body.fecha).format("YYYY-MM-DD"),
    }).then(function (dbPolska) {
      res.json(dbPolska)
    })
      .catch(function (error) {
        res.json(error)
      })
  })

  //Get data for day shift
  app.get("/produccionhoradia/:fechainicial/:fechafinal/", function (req, res) {
    let fechainicial = moment.unix(req.params.fechainicial).format("YYYY-MM-DD HH:mm:ss")
    let fechafinal = moment.unix(req.params.fechafinal).format("YYYY-MM-DD HH:mm:ss")
    //console.log(fechainicial)
    //console.log(fechafinal)
    //console.log(req.params.fechafinal)
    db.Polska.findAll({
      where: {
        fecha: {
          [Op.gte]: fechainicial,
          [Op.lte]: fechafinal
        },
        turno: {
          [Op.eq]: 1
        }
      },
      order:[
        ["dia","ASC"]
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
    db.Polska.findAll({
      where: {
        fecha: {
          [Op.gte]: fechainicial,
          [Op.lte]: fechafinal
        },
        turno: {
          [Op.eq]: 2
        }
      },
      order:[
        ["dia","ASC"]
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
    db.Polska.findAll({
      where: {
        fecha: {
          [Op.gte]: fechainicial,
          [Op.lte]: fechafinal
        },
        turno: {
          [Op.eq]: 3
        }
      },
      order:[
        ["dia","ASC"]
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
    db.Polska.findAll({
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



};

