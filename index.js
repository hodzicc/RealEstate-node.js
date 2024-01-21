const express = require('express');
const path = require('path');
const app = express();
const bodyParser = require('body-parser');
const db = require('./db.js')
const bcrypt = require('bcrypt');
const querystring = require('querystring');
const session = require('express-session');
const fs = require('fs');
const { prependListener } = require('process');

const PORT = 3000;



app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(
    session({
      secret: 'your-secret-key',
      resave: false,
      saveUninitialized: true,
    })
  );

app.use(express.static(path.join(__dirname, 'public')));

 
app.use((req, res, next) => {
    res.locals.user = req.session.username;
    next();
  });
  

app.get('/korisnik', async (req, res) => {
  if (req.session.loggedIn) {
      //const user = users.find((user) => user.username === req.session.username);
      const user = await db.korisnik.findOne({
        where: { username: req.session.username },
      });
      if (user) {
          return res.status(200).json(user);
      } else {
          return res.status(404).json({ greska: 'Korisnik nije pronađen' });
      }
  } else {
      return res.status(401).json({ greska: 'Neautorizovan pristup' });
  }
});

app.get('/nekretnine', async (req, res)=>{ 
    const nekretnine1 = await db.nekretnina.findAll();
  return res.status(200).json(nekretnine1);
});


app.use(bodyParser.urlencoded({ extended: true }));

app.post('/login', async (req, res) =>{

    let body = req.body;
    const username = body['username'];
    const password = body['password'];
    const user = await db.korisnik.findOne({ where: { username } });
   // const user = users.find((user) => user.username === username);
    if (user) {
      
      bcrypt.compare(password, user.password, (err, result) => {
        if (result) {          
            req.session.loggedIn = true;
            req.session.username = username; 
            return res.status(200).json({ poruka: 'Uspješna prijava' });
        } else {
          return res.status(401).json({ greska: 'Neuspješna prijava' });
          
        }
      });
    } else {
      return res.status(401).json({ greska: 'Neuspješna prijava' });
    }
   
});

app.post('/logout', async(req, res) => {

  if (req.session.loggedIn) {
   
      // Clear user session data
      req.session.loggedIn = false;
      req.session.username = null;
      return res.status(200).json({ poruka: 'Uspješno ste se odjavili' });
  } else {
      // If the user is not logged in, return unauthorized access error
      return res.status(401).json({ greska: 'Neautorizovan pristup' });
  }
});


app.put('/korisnik', async function (req, res) {
    if (!req.session.loggedIn) {
        return res.status(401).json({ greska: 'Neautorizovan pristup' });
    }

    let novoIme = req.body.ime;
    let novoPrezime = req.body.prezime;
    let noviUsername = req.body.username;
    let noviPassword = req.body.password;

    try {
        // Find the user in the database
        const user = await db.korisnik.findOne({ where: { username: req.session.username } });

        // Check if the user is found
        if (user) {
            // Update user information
            if (novoIme) user.ime = novoIme;
            if (novoPrezime) user.prezime = novoPrezime;
            if (noviUsername) {
                user.username = noviUsername;
                req.session.username = noviUsername;
            }
            if (noviPassword) {
                // Hash and update the password
                const hash = await bcrypt.hash(noviPassword, 10);
                user.password = hash;
            }

            // Save changes to the database
            await user.save();

            return res.status(200).json({ 'poruka': 'Podaci su uspješno ažurirani' });
        } else {
            return res.status(404).json({ greska: 'Korisnik nije pronađen' });
        }
    } catch (err) {
        console.error(err);
        return res.status(500).json({ greska: 'Greška prilikom ažuriranja korisnika' });
    }
});

app.post('/upit', async function (req, res) {
    if (!req.session.loggedIn) {
        return res.status(401).json({ 'greska': 'Neautorizovan pristup' });
    }

    const id = req.body.nekretnina_id;
    const sadrzaj = req.body.tekst_upita;

    try {
        // Find the user in the database
        const user = await db.korisnik.findOne({ where: { username: req.session.username } });

        // Find the property in the database
        const nekretnina = await db.nekretnina.findByPk(id);

        // If the property is found, add a new query
        if (nekretnina) {
            // Create a new query object
            const newQuery = {
                tekst: sadrzaj ,
                NekretninaId: nekretnina.id,
                KorisnikId: user.id
            };

            const createdQuery = await db.upit.create(newQuery);
            
            // Return success message
            return res.status(200).json({ poruka: 'Upit je uspješno dodan' });
        } else {
            // If the property is not found, return an error
            return res.status(401).json({ greska: `Nekretnina sa id-em ${id} ne postoji` });
        }
    } catch (err) {
        console.error(err);
        return res.status(401).json({ greska: 'Greška prilikom dodavanja upita' });
    }
});


  
// Marketing nekretnine
app.post('/marketing/nekretnine', async function (req, res) {
    try {
        const novePretrage = req.body.nizNekretnina;

        for (let i = 0; i < novePretrage.length; i++) {
            const nekretnina = await db.nekretnina.findByPk(parseInt(novePretrage[i]));
            
            if (nekretnina) {
                await nekretnina.update({ pretrage: nekretnina.pretrage + 1 });
            }
        }

        return res.status(200).json();
    } catch (err) {
        console.error(err);
        return res.status(401).json({ greska: 'Greška prilikom ažuriranja pretraga' });
    }
});

// Marketing nekretnine by ID
app.post('/marketing/nekretnina/:id', async function (req, res) {
    try {
        const noviPrikaz = req.params.id;
        const nekretnina = await db.nekretnina.findByPk(parseInt(noviPrikaz));

        if (nekretnina) {
            // Update klikovi count in the database
            await nekretnina.update({ klikovi: nekretnina.klikovi + 1 });
        }

        return res.status(200).json();
    } catch (err) {
        console.error(err);
        return res.status(401).json({ greska: 'Greška prilikom ažuriranja broja klikova' });
    }
});

//marketing osvjezi
app.post('/marketing/osvjezi', async function (req, res) {
    if (req.body && req.body.nizNekretnina) {
        let nizIdeva = req.body.nizNekretnina;
        let nekretnine = [];

        for (let i = 0; i < nizIdeva.length; i++) {
            await db.nekretnina.findOne({ where: { id: nizIdeva[i] } }).then((nekretnina) => {
                nekretnine.push(nekretnina);
            });
        }

        req.session.nizNekretnina = nekretnine;
        return res.status(200).json(nekretnine);
    } else {
        const nizNekretnina = req.session.nizNekretnina;
        let promijenjeneNekretnine = [];

        for (let i = 0; i < nizNekretnina.length; i++) {
            await db.nekretnina.findOne({ where: { id: nizNekretnina[i].id } }).then((nekretnina) => {
                if (nekretnina.pretrage !== parseInt(nizNekretnina[i].pretrage) || nekretnina.klikovi !== parseInt(nizNekretnina[i].klikovi)){
                    nizNekretnina[i] = nekretnina;
                    promijenjeneNekretnine.push(nekretnina)
                    }
            });
        }

        req.session.nizNekretnina = nizNekretnina;

        return res.status(200).json(promijenjeneNekretnine);
    }
});

// Marketing nekretnine by ID
app.get('/nekretnina/:id', async function (req, res) {
   try{
        const id = req.params.id;
        const nekretnina = await db.nekretnina.findByPk(parseInt(id));
       const niz = [];
        if (nekretnina) {
            const upiti = await db.upit.findAll({
                where: { NekretninaId: nekretnina.id },
              });
           
            for (const u of upiti){
                const korisnik = await db.korisnik.findOne({
                    where: { id: u.KorisnikId }
                });
                niz.push({
                    username: korisnik.username,
                    tekst: u.tekst
                });

            }
            
            const response = {
                id: nekretnina.id,
                naziv: nekretnina.naziv,
                kvadratura: nekretnina.kvadratura,
                cijena: nekretnina.cijena,
                tip_grijanja: nekretnina.tip_grijanja,
                lokacija: nekretnina.lokacija,
                godina_izgradnje: nekretnina.godina_izgradnje,
                datum_objave: nekretnina.datum_objave,
                opis: nekretnina.opis,
                pretrage: nekretnina.pretrage,
                klikovi: nekretnina.klikovi,
                upiti: niz
            };
            return res.status(200).json(response);
        }

        return res.status(400).json({greska:`Nekretnina sa id-em ${id} ne postoji`});
    } catch (err) {
        console.error(err);
        return res.status(400).json({ greska: 'Greška prilikom pristupanja bazi' });
    }
});

app.get('/:page', async(req, res) => {
  const page = req.params.page || 'meni.html';
  res.sendFile(path.join(__dirname, 'public','html', page));
  });

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
