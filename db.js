const Sequelize = require("sequelize");
const path = require('path');
const sequelize = new Sequelize("wt24","root","password",{host:"127.0.0.1",dialect:"mysql",logging:false});
const db={};

db.Sequelize = Sequelize;  
db.sequelize = sequelize;

//import modela
db.korisnik = require(path.join(__dirname, '/korisnik.js'))(sequelize, Sequelize.DataTypes)
//db.korisnik = sequelize.import(__dirname+'/korisnik.js');
db.nekretnina = require(path.join(__dirname, '/nekretnina.js'))(sequelize, Sequelize.DataTypes)
//db.nekretnina = sequelize.import(__dirname+'/nekretnina.js');
db.upit = require(path.join(__dirname, '/upit.js'))(sequelize, Sequelize.DataTypes)
//db.upit = sequelize.import(__dirname+'/upit.js');

db.korisnik.hasMany(db.upit, { as: 'korisnikUpiti' });
db.nekretnina.hasMany(db.upit, { as: 'nekretninaUpiti' });

module.exports=db;