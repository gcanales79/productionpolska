var db = require("../models");

module.exports = function (app) {
  // Load index page
  app.get("/", function (req, res) {
    res.status(200);
    res.render("index", {
      title: "home",
      active_home: {
        Register: true,
      },
    })
  });

  app.get("/consulta", function (req, res) {
    res.status(200);
    res.render("consulta", {
      title: "consulta",
      active_consulta: {
        Register: true,
      },
    })
  });

  app.get("/consulta/:serie", function (req, res) {
    db.Daimler.findAll({
      where: {
        serial: req.params.serie
      },

    })
      .then(function (dbDaimler) {
        res.render("consulta", {
          title: "consulta",
          active_consulta: {
            Register: true,
          },
          etiqueta: dbDaimler,
        });
        //console.log(dbDaimler);
      });
  });








  // Load example page and pass in an example by id
  app.get("/cambiar", function (req, res) {
    res.sendFile(path.join(__dirname, ".cambiar.html"));
  });

  // Render 404 page for any unmatched routes
  app.get("*", function (req, res) {
    res.render("404");
  });
};
