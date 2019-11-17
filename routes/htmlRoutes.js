var db = require("../models");
var isAuthenticated = require("../config/middleware/isAuthenticated");
const Sequelize = require('sequelize');
const Op = Sequelize.Op;



module.exports = function (app) {
  // Load index page
  app.get("/", function (req, res) {
    res.status(200);
    console.log(req.flash("message"))
    res.render("index", {
      title: "home",
      active_home: {
        Register: true
      }
    })

  });


  //Get produccion page
  app.get("/produccion", isAuthenticated, function (req, res) {
    //console.log(req.user)
    if (req.user.role === "admin" || req.user.role === "produccion") {
      res.status(200);
      res.render("produccion", {
        title: "produccion",
        active_home: {
          Register: true
        }
      })
    }
      
  });

  // Carga la pagina para dar de alta usuarios
  app.get("/alta", isAuthenticated, function (req, res) {
    //console.log(res.locals.sessionFlash)
    let message = res.locals.sessionFlash
    console.log(message)
    if (req.user.role === "admin") {
      //console.log(res.locals.sessionFlash)
      //res.status(200);
      res.render("alta", {
        sessionFlash: message,
        title: "alta",
        active_alta: {
          Register: true,
        },


      });
    }
    else {
      res.render("404")
    }
  });

  //Cambiar contraseña

  app.get("/reset/:token", function (req, res) {
    db.User.findOne({
      where: {
        resetPasswordToken: req.params.token,
        resetPasswordExpire: {
          [Op.gt]: Date.now()
        }

      }
    }).then(user => {
      if (!user) {
        req.flash("error", "El token para restablecer la contraseña se ha vencido")
        return res.redirect("/")
      }
      res.render("reset", {
        token: req.params.token
      })
    })
  })


  // Render 404 page for any unmatched routes
  app.get("*", function (req, res) {
    res.render("404");
  });




}
