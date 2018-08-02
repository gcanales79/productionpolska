module.exports = function (sequelize, DataTypes) {
  var Daimler = sequelize.define("Daimler", {
    serial: DataTypes.STRING,
    repetida: {
      type: DataTypes.BOOLEAN,
      defaultValue:false,
    },
    etiqueta_remplazada: DataTypes.STRING,
    
  });


  return Daimler;
};
