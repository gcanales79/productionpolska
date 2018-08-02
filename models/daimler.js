module.exports = function (sequelize, DataTypes) {
  var Daimler = sequelize.define("Daimler", {
    serial: DataTypes.STRING,
    repetida: {
      type: DataTypes.BOOLEAN,
      defaultValue:false,
    },
    nueva_etiqueta: DataTypes.STRING,
    
  });


  return Daimler;
};
