var db = require("../models");

db.Goal.create({
    daily_hr10: "400",
    daily_br10:"0",
    daily_hr16:"0",
    wk_hr10:"1600",
    wk_br10:"0",
    wk_hr16:"0",
  },
  ).then(data => {

    console.log("Datos creados")
    })
  .catch(function (err) {
    console.log(err);
  });