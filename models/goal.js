module.exports = function (sequelize, DataTypes) {
    var Goal = sequelize.define("Goal", {
        daily_hr10: {
            type: DataTypes.STRING,
            defaultValue:"0"
        },
        daily_br10: {
            type: DataTypes.STRING,
            defaultValue:"0"
        },
        daily_hr16: {
            type: DataTypes.STRING,
            defaultValue:"0"
        },
        wk_hr10: {
            type: DataTypes.STRING,
            defaultValue:"0"
        },
        wk_br10: {
            type: DataTypes.STRING,
            defaultValue:"0"
        },
        wk_hr16: {
            type: DataTypes.STRING,
            defaultValue:"0"
        },
        
    });

    return Goal;
};