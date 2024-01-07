const Sequelize = require("sequelize");

module.exports = function(sequelize,DataTypes){
    const Nekretnina = sequelize.define("Nekretnina",{
        tip_nekretnine: Sequelize.STRING,
        naziv: Sequelize.STRING,
        kvadratura: Sequelize.FLOAT,
        cijena: Sequelize.FLOAT,
        tip_grijanja: Sequelize.STRING,
        lokacija: Sequelize.STRING,
        godina_izgradnje: Sequelize.INTEGER,
        datum_objave: Sequelize.DATE,
        opis: Sequelize.STRING,
        pretrage: Sequelize.INTEGER,
        klikovi: Sequelize.INTEGER
    })
    return Nekretnina;
};
