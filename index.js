const express = require('express');
const path = require('path');
const app = express();
const bodyParser = require('body-parser');
const users = require('./public/data/korisnici.json');
const nekretnine = require('./public/data/nekretnine.json');
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
  

app.get('/korisnik', (req, res) => {
  if (req.session.loggedIn) {
      const user = users.find((user) => user.username === req.session.username);
      if (user) {
          return res.status(200).json(user);
      } else {
          return res.status(404).json({ greska: 'Korisnik nije pronađen' });
      }
  } else {
      return res.status(401).json({ greska: 'Neautorizovan pristup' });
  }
});

app.get('/nekretnine', (req, res)=>{ 
  return res.status(200).json(nekretnine);
});


app.use(bodyParser.urlencoded({ extended: true }));

app.post('/login', (req, res) =>{

    let body = req.body;
    const username = body['username'];
    const password = body['password'];

    const user = users.find((user) => user.username === username);
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

app.post('/logout', (req, res) => {

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



app.put('/korisnik', function (req, res) {
    if (!req.session.loggedIn) {
        return res.status(401).json({ greska: 'Neautorizovan pristup' });
    }

    let novoIme = req.body.ime;
    let novoPrezime = req.body.prezime;
    let noviUsername = req.body.username;
    let noviPassword = req.body.password;
    let userIndex = users.findIndex(user => user.username == req.session.username);

    if (novoIme) {
        users[userIndex].ime = novoIme
    }
    if (novoPrezime) {
        users[userIndex].prezime = novoPrezime;
    }
    if (noviUsername) {
        users[userIndex].username = noviUsername;
        req.session.username = noviUsername;
    }
    if (noviPassword) {
        bcrypt.hash(noviPassword, 10, function (err, hash) {
            if (!err)
                users[userIndex].password = hash;
        });
    }

    fs.writeFile("./public/data/korisnici.json", JSON.stringify(users, null, 2), 'utf8', (err) => {
        if (err) {
            throw err;
        }
        return res.status(200).json({ 'poruka': 'Upit je uspješno dodan' });
    });
});


app.post('/upit', function (req, res) {
    if (!req.session.loggedIn) {
        return res.status(401).json({ 'greska': 'Neautorizovan pristup' });
    }

    const id = req.body.nekretnina_id;
    const sadrzaj = req.body.tekst_upita;
    const user = users.find(user => user.username == req.session.username);
    const nekretninaIndeks = nekretnine.findIndex(nekretnina => nekretnina.id == id);

    if (nekretninaIndeks === -1) {
        return res.status(400).json({ 'greska': `Nekretnina sa id-em ${id} ne postoji` });
    }

    nekretnine[nekretninaIndeks].upiti.push({ korisnik_id: user.id, tekst_upita: sadrzaj });

    fs.writeFile("./public/data/nekretnine.json", JSON.stringify(nekretnine, null, 2), 'utf8', (err) => {
        if (err) {
            throw err;
        }
        return res.status(200).json({ 'poruka': 'Upit je uspješno dodan' });
    });
});

  
//makreting nekretnine
app.post('/marketing/nekretnine', function (req, res) {
  let novePretrage = req.body.nizNekretnina;
  fs.readFile('./public/data/marketing.json', 'utf8', (err, data) => {
      if (err) {
          return;
      }

      pretrage = JSON.parse(data);

      let indeks;
      for (let i = 0; i < novePretrage.length; i++) {
          indeks = pretrage.findIndex(pretraga => pretraga.id === parseInt(novePretrage[i]));
          if (indeks === -1) {
              indeks = pretrage.length;
              pretrage[indeks] = {
                  id: parseInt(novePretrage[i]),
                  pretrage: 0,
                  klikovi: 0
              };
          }
          pretrage[indeks].pretrage += 1;
      }

      fs.writeFile("./public/data/marketing.json", JSON.stringify(pretrage, null, 2), 'utf8', (err) => {
          if (err) {
              throw err;
          }
          return res.status(200).json();
      });
  });
});

//marketing nekretnine id
app.post('/marketing/nekretnina/:id', function (req, res) {
  let noviPrikaz = req.params.id;

  fs.readFile('./public/data/marketing.json', 'utf8', (err, data) => {
      if (err) {
          return;
      }

      pretrage = JSON.parse(data);

      let indeks = pretrage.findIndex(pretraga => pretraga.id === parseInt(noviPrikaz));
      if (indeks === -1) {
          indeks = pretrage.length;
          pretrage[indeks] = {
              id: parseInt(noviPrikaz),
              pretrage: 0,
              klikovi: 0
          };
      }
      pretrage[indeks].klikovi += 1;

      fs.writeFile("./public/data/marketing.json", JSON.stringify(pretrage, null, 2), 'utf8', (err) => {
          if (err) {
              throw err;
          }
          return res.status(200).json();
      });
  });
});

//marketing osvjezi
app.post('/marketing/osvjezi', function (req, res) {
  fs.readFile('./public/data/marketing.json', 'utf8', (err, data) => {
      if (err) {
          return;
      }

      pretrage = JSON.parse(data);

      if (req.body && req.body.nizNekretnina) {
          let nizIdeva = req.body.nizNekretnina;
          let nekretnine = [];

          for (let i = 0; i < nizIdeva.length; i++)
              nekretnine.push(pretrage.find(data => data.id === parseInt(nizIdeva[i])));

          req.session.nizNekretnina = nekretnine;
          return res.status(200).json(nekretnine);
      } else {
          const nizNekretnina = req.session.nizNekretnina;
          let promijenjeneNekretnine = [];

          for (let i = 0; i < nizNekretnina.length; i++) {
              let podaci = pretrage.find(data => data.id === parseInt(nizNekretnina[i].id));

              if (podaci && (podaci.klikovi !== parseInt(nizNekretnina[i].klikovi) || podaci.pretrage !== parseInt(nizNekretnina[i].pretraga)))
                  promijenjeneNekretnine.push(podaci);
          }
          return res.status(200).json(promijenjeneNekretnine);
      }
  });
});


app.get('/:page', (req, res) => {
  const page = req.params.page || 'meni.html';
  res.sendFile(path.join(__dirname, 'public','html', page));
  });

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
