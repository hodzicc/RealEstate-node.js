document.addEventListener('DOMContentLoaded', function () {
    // Fetch the current user data
    PoziviAjax.getKorisnik(function (err, korisnik) {
        if (err) {
            console.error('Greška prilikom dobijanja podataka o trenutnom korisniku:', err);
            return;
        }

        // Display the current user data
        document.getElementById('ime').value = korisnik.ime;
        document.getElementById('prezime').value = korisnik.prezime;
        document.getElementById('username').value = korisnik.username;
   
    });

    // Add event listener for the modify button
    document.getElementById('modify-btn').addEventListener('click', function () {
        // Get the modified user data
        const modifiedData = {
            ime: document.getElementById('ime').value,
            prezime: document.getElementById('prezime').value,
            username: document.getElementById('username').value
        };

        // Call the method for modifying user data
        PoziviAjax.putKorisnik(modifiedData, function (err, response) {
            if (err) {
                console.error('Greška prilikom modifikacije korisnika:', err);
                return;
            }

            // Optionally, you can display a success message or perform any other actions
            console.log('Korisnik uspješno modificiran:', response);
        });
    });
});
