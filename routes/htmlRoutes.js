var db = require("../models");

module.exports = function (app) {
  // Load index page
  app.get("/", function (req, res) {

    res.render("index")
  });

  // Load example page and pass in an example by id
  app.get("/cambiar", function(req, res) {
    res.sendFile(path.join(__dirname, ".cambiar.html"));
  });

  // Render 404 page for any unmatched routes
  app.get("*", function (req, res) {
    res.render("404");
  });
};
