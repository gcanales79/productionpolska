var db = require("../models");

module.exports = function (app) {
  // Load index page
  app.get("/", function (req, res) {
    res.status(200);
    db.Daimler.findAll({
      limit: 6,
      order: [["createdAt", "DESC"]],

    })
      .then(function (dbDaimler) {
        res.render("index", {
          title: "home",
          active_home: {
            Register: true,
          },
          etiqueta: dbDaimler,
        });
      });
  });

  //Esto sirve para cambiar el CSS cuando entras a consulta, con el actvie_consulta
  app.get("/consulta", function (req, res) {
    res.status(200);
    res.render("consulta", {
      title: "consulta",
      active_consulta: {
        Register: true,
      },
    })
  });

  //Este te permite ver los datos de una etiqueta en particular
  app.get("/consulta/:serie", function (req, res) {
    db.Daimler.findAll({
      
      where: {
        $or:{
        serial: req.params.serie,
        etiqueta_remplazada: req.params.serie,
        }
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

  //Cargar la tabla de registros
  app.get("/tabla/:registros", function (req, res) {
    db.Daimler.findAll({
      limit: parseInt(req.params.registros),
      order: [["createdAt", "DESC"]],

    })
      .then(function (dbDaimler) {
        res.render("tabla", {
          title: "tabla",
          active_consulta: {
            Register: true,
          },
          etiqueta: dbDaimler,
          
        });
        //console.log(dbDaimler)
      });
    
  });

  // Carga la pagina tabla
  app.get("/tabla", function (req, res) {
    res.status(200);
    res.render("tabla", {
      title: "tabla",
      active_consulta:{
        Register:true,
      },
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
