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

  // Middleware to check if the user is logged in
app.use((req, res, next) => {
    res.locals.user = req.session.username;
    next();
  });

  app.post('/meni.html', (req, res) => {
    const loggedIn = req.session.loggedIn || false;
    res.json({loggedIn: loggedIn});  
  });

app.get('/:page', (req, res) => {
const page = req.params.page || 'meni.html';
res.sendFile(path.join(__dirname, 'public','html', page));
});

app.post('/login', (req, res) =>{

    let body = '';

    req.on('data', (chunk) => {
            body += chunk;
    });
    req.on('end', () => {
        const { username, password } = querystring.parse(body);

    const user = users.find((user) => user.username === username);

    if (user) {
      
      bcrypt.compare(password, user.password, (err, result) => {
        if (result) {          
            req.session.loggedIn = true;
            req.session.username = username; 
          //  return res.status(200).json({ poruka: 'Uspješna prijava' });
            res.redirect("/meni.html");
        } else {
          return res.status(401).json({ greska: 'Neuspješna prijava' });
          
        }
      });
    } else {
      return res.status(401).json({ greska: 'Neuspješna prijava' });
    }
    });
});

app.post('/logout', (req, res) => {
  console.log("bla");
  // Check if the user is logged in
  if (req.session.loggedIn) {
      // Clear user session data
      req.session.loggedIn = false;
      req.session.username = null;
      res.status(200).json({ poruka: 'Uspješno ste se odjavili' });
  } else {
      // If the user is not logged in, return unauthorized access error
      res.status(401).json({ greska: 'Neautorizovan pristup' });
  }
});



app.get('/korisnik', (req, res)=>{
  const user = users.find((user) => user.username === req.session.username);
  if (user) {
    const userData = {
      id: user.id,
      ime: user.ime,
      prezime: user.prezime,
      username: user.username
  };
  res.status(200).json(userData);
} else 
    // If the user is not logged in, return unauthorized access error
    res.status(401).json({ greska: 'Neautorizovan pristup' });
});

app.post('/upit', (req, res) => {
  // Check if the user is logged in
  if (req.session.loggedIn) {
      // Get data from the request body
      const { nekretnina_id, tekst_upita } = req.body;

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
              res.status(200).json({ poruka: 'Upit je uspješno dodan' });
          } else {
              // If the property is not found, return an error
              res.status(400).json({ greska: `Nekretnina sa id-em ${nekretnina_id} ne postoji` });
          }
      
  } else {
      // If the user is not logged in, return unauthorized access error
      res.status(401).json({ greska: 'Neautorizovan pristup' });
  }
});

app.put('/korisnik', (req, res) => {
  // Check if the user is logged in
  if (req.session.loggedIn) {
      // Get data from the request body
      const { ime, prezime, username, password } = req.body;

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
            res.status(200).json({ poruka: 'Podaci su uspješno ažurirani' });
          } 
      
  } else {
      // If the user is not logged in, return unauthorized access error
      res.status(401).json({ greska: 'Neautorizovan pristup' });
  }
});

app.get('/nekretnine', (req, res)=>{ 
  res.status(200).json(nekretnine);
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
