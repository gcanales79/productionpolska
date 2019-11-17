module.exports = function (sequelize, DataTypes) {
  var Polska = sequelize.define("Polska", {
    line_br10: DataTypes.STRING,
    line_hr10_lp1: DataTypes.STRING,
    line_hr10_lp2: DataTypes.STRING,
    line_hr16_lp1: DataTypes.STRING,
    line_stf3:DataTypes.STRING,
    turno:DataTypes.STRING,
    dia: DataTypes.STRING,
  });

  return Polska;
};
