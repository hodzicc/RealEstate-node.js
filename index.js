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

let klikoviMap = new Map();
let pretrageMap = new Map();

  app.use(express.static(path.join(__dirname, 'public')));

 
app.use((req, res, next) => {
    res.locals.user = req.session.username;
    next();
  });

  app.post('/meni.html', (req, res) => {
    const loggedIn = req.session.loggedIn || false;
    res.json({loggedIn: loggedIn});  
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


app.post('/upit', (req, res) => {
  // Check if the user is logged in
  if (req.session.loggedIn) {
      // Get data from the request body
      let body = req.body;

      const nekretnina_id = body['nekretnina_id'];
      const tekst_upita = body['tekst_upita']
      // Find the user in your data
      const user = users.find((user) => user.username === req.session.username);

          // Find the property in nekretnine.json
          const nekretnina = nekretnine.find((property) => property.id === nekretnina_id);

          // If the property is found, add a new query
          if (nekretnina) {
              // Create a new query object
              const newQuery = {
                  id_korisnika: user.id,
                  tekst_upita: tekst_upita
              };

              // Add the new query to the property's queries array
              nekretnina.upiti.push(newQuery);

              // Return success message
              return res.status(200).json({ poruka: 'Upit je uspješno dodan' });
          } else {
              // If the property is not found, return an error
              return res.status(400).json({ greska: `Nekretnina sa id-em ${nekretnina_id} ne postoji` });
          }
      
  } else {
      // If the user is not logged in, return unauthorized access error
      return res.status(401).json({ greska: 'Neautorizovan pristup' });
  }
});

app.put('/korisnik', (req, res) => {
  // Check if the user is logged in
  if (req.session.loggedIn) {
      // Get data from the request body
      let body = req.body;

      const ime = body['ime'];
      const prezime = body['prezime'];
      const username = body['username'];
      const password = body['password'];
      // Find the user in your data
      const user = users.find((user) => user.username === req.session.username);
          // If the property is found, add a new query
          if (user) {
            if (ime) user.ime = ime;
            if (prezime) user.prezime = prezime;
            if (username) user.username = username;
            if (password) {
                // Hash and update the password
                bcrypt.hash(password, 10, function(err, hash) {
                    if (err) {
                        return res.status(500).json({ greska: 'Greška prilikom ažuriranja lozinke' });
                    }
                    user.password = hash;
                   
                });
            }
              // Return success message
           return res.status(200).json({ poruka: 'Podaci su uspješno ažurirani' });
          } 
      
  } else {
      // If the user is not logged in, return unauthorized access error
      return res.status(401).json({ greska: 'Neautorizovan pristup' });
  }
});
  
app.post('/marketing/nekretnine', (req, res)=>{
  const bod = req.body;
  const nizNekretnina = bod['nizNekretnina'];

  if (!nizNekretnina || !Array.isArray(nizNekretnina)) {
    return res.status(400).send('Invalid request body');
}

nizNekretnina.forEach(idNekretnine => {
    const pretrage = pretrageMap.get(idNekretnine) || 0;
    pretrageMap.set(idNekretnine, pretrage + 1);
});
return res.status(200);

});

app.post('/marketing/nekretnina/:id', (req, res)=>{
   const id = req.params.id;

  const klikovi = klikoviMap.get(id) || 0;
  klikoviMap.set(id, klikovi + 1);
  
  return res.status(200);

});

app.post('/marketing/osvjezi', (req, res) => {
  const bod = req.body;
  const nizNekretnina = bod['nizNekretnina'];

  // Function to retrieve detailed information for a nekretnina
  const getNekretninaInfo = (id) => ({
      id,
      pretrage: pretrageMap.get(id) || 0,
      klikovi: klikoviMap.get(id) || 0,
  });

  if (nizNekretnina && Array.isArray(nizNekretnina) && nizNekretnina.length > 0) {
      // Non-empty req.body, update session data
      req.session.nekretnineDetails = nizNekretnina.map(getNekretninaInfo);
  }
  // Use session data to fetch IDs
  let sessionNekretnine = req.session.nekretnineDetails || [];

  const updatedNekretnine = sessionNekretnine
  .map(({ id, pretrage, klikovi }) => {
      const currentPretrage = pretrageMap.get(parseInt(id, 10)) || 0;
      const currentKlikovi = klikoviMap.get(id) || 0;

      // Check if the values have changed
      const pretrageChanged = pretrage !== currentPretrage;
      const klikoviChanged = klikovi !== currentKlikovi;

      // Return data only if there's a change
      if (pretrageChanged || klikoviChanged) {
          return { id, klikovi: currentKlikovi, pretrage: currentPretrage };
      }

      return null;
  })
  .filter(Boolean);

  

      req.session.nekretnineDetails = sessionNekretnine
      .map(({ id, pretrage, klikovi }) => {
        
          const currentPretrage = pretrageMap.get(parseInt(id, 10)) || 0;
          const currentKlikovi = klikoviMap.get(id) || 0;

          
          return { id, klikovi: currentKlikovi, pretrage: currentPretrage };
        
      });

      sessionNekretnine = req.session.nekretnineDetails || [];
      
   
 return res.status(200).json({ nizNekretnina: updatedNekretnine });
});


app.get('/:page', (req, res) => {
  const page = req.params.page || 'meni.html';
  res.sendFile(path.join(__dirname, 'public','html', page));
  });

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
