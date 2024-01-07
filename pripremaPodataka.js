const db = require('./db.js')
db.sequelize.sync({force:true}).then(function(){
    inicializacija().then(function(){
        console.log("Gotovo kreiranje tabela i ubacivanje pocetnih podataka!");
        process.exit();
    });
});
function inicializacija(){
    var korisniciListaPromisea=[];
    var nekretnineListaPromisea=[];
    var upitiListaPromisea=[];
    return new Promise(function(resolve,reject){
   
    upitiListaPromisea.push(
        db.upit.create({tekst:'tekstUpita1'}).then(function(b){
            return new Promise(function(resolve,reject){resolve(b);});                   
        })
    );
    upitiListaPromisea.push(
        db.upit.create({tekst:'tekstUpita2'}).then(function(b){
            return new Promise(function(resolve,reject){resolve(b);});                   
        })
    );
    Promise.all(upitiListaPromisea).then(function(upiti){
        var u1=upiti.filter(function(a){return a.tekst==='tekstUpita1'})[0];
        var u2=upiti.filter(function(a){return a.tekst==='tekstUpita2'})[0];

        nekretnineListaPromisea.push(
            db.nekretnina.create({
            tip_nekretnine: "Stan",
            naziv: "Useljiv stan Sarajevo",
            kvadratura: 58,
            cijena: 232000,
            tip_grijanja: "plin",
            lokacija: "Novo Sarajevo",
            godina_izgradnje: 2019,
            datum_objave: "01.10.2023.",
            opis: "Sociis natoque penatibus."})
            .then(function(k){
                return k.setNekretninaUpiti([u1]).then(function(){
                return new Promise(function(resolve,reject){resolve(k);});
            });
            })
        );
        nekretnineListaPromisea.push(
            db.nekretnina.create({
            tip_nekretnine: "Poslovni prostor",
            naziv: "Mali poslovni prostor",
            kvadratura: 20,
            cijena: 70000,
            tip_grijanja: "struja",
            lokacija: "Centar",
            godina_izgradnje: 2005,
            datum_objave: "20.08.2023.",
            opis: "Magnis dis parturient montes."})
            .then(function(k){
                return k.setNekretninaUpiti([u2]).then(function(){
                return new Promise(function(resolve,reject){resolve(k);});
            });
            })
        );       
        Promise.all(nekretnineListaPromisea).then(function(nekretnine){
            
          
            korisniciListaPromisea.push(db.korisnik.create({ime: "Neko", prezime: "Nekic", username: "username1", password: "$2b$10$m.YLcseHcp8R7adDExc5/OX4hbDWoi6WGjJhL9ppGpVf2XytdRx.m"})
            .then(function(k){
                return k.setKorisnikUpiti([u1]).then(function(){
                return new Promise(function(resolve,reject){resolve(k);});
                });
            })
            );
            korisniciListaPromisea.push(db.korisnik.create({ime: "Neko2", prezime: "Nekic2", username: "username2", password: "$2b$10$WRGnx4mXQ87AFxCMbTAKa.iAbjrBLHEnugz/Bow.GXOp8M29jjgmu"})
            .then(function(k){
                return k.setKorisnikUpiti([u2]).then(function(){
                return new Promise(function(resolve,reject){resolve(k);});
            });
            }));
         
            Promise.all(korisniciListaPromisea).then(function(b){resolve(b);}).catch(function(err){console.log("korisnici greska "+err);});
        }).catch(function(err){console.log("nekretnine greska "+err);});
    }).catch(function(err){console.log("upiti greska "+err);});   
    });
}