const Sequelize = require("sequelize");

module.exports = function(sequelize,DataTypes){
    const Upit = sequelize.define("Upit",{
        tekst:Sequelize.STRING      
    })
    return Upit;
};