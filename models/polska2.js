module.exports = function (sequelize, DataTypes) {
    var Polska2 = sequelize.define("Polska2", {
        ws2_hr16: {
            type: DataTypes.STRING,
            defaultValue:"0"
        },
        ws3a_cell1:  {
            type: DataTypes.STRING,
            defaultValue:"0"
        },
        ws3a_cell2:  {
            type: DataTypes.STRING,
            defaultValue:"0"
        },
        ws3b_hr10det:  {
            type: DataTypes.STRING,
            defaultValue:"0"
        },
        ws3b_hr10gpf:  {
            type: DataTypes.STRING,
            defaultValue:"0"
        },
        ws4_br10ed:  {
            type: DataTypes.STRING,
            defaultValue:"0"
        },
        ws4_br10bja:  {
            type: DataTypes.STRING,
            defaultValue:"0"
        },
        ws4_br10gpf:  {
            type: DataTypes.STRING,
            defaultValue:"0"
        },
        stf3_hr10: {
            type: DataTypes.STRING,
            defaultValue:"0"
        },
        stf3_br10:  {
            type: DataTypes.STRING,
            defaultValue:"0"
        },
        stf3_hr16:  {
            type: DataTypes.STRING,
            defaultValue:"0"
        },
        stf4_hr10:  {
            type: DataTypes.STRING,
            defaultValue:"0"
        },
        stf4_br10:  {
            type: DataTypes.STRING,
            defaultValue:"0"
        },
        stf4_hr16: {
            type: DataTypes.STRING,
            defaultValue:"0"
        },
        turno: 
        {
            type: DataTypes.STRING,
        },
        dia: 
        {
            type: DataTypes.STRING,
        },
        fecha:  {
            type: DataTypes.DATE,
           
        },
    });

    return Polska2;
};
