function populateDetaljiPage() {
    const urlParams = new URLSearchParams(window.location.search);
    const nekretninaId = urlParams.get('id');

    // Fetch nekretnina details
    PoziviAjax.getNekretninaById(nekretninaId, function (err, detalji) {
        if (err) {
            console.error("Error fetching nekretnina details:", err);
            // Handle error, e.g., display an error message
            return;
        }

        // Use the retrieved data to populate the page elements
        document.getElementById('osnovno').innerHTML = `
            <div class="slika">
                <img src="https://as1.ftcdn.net/v2/jpg/03/30/29/42/1000_F_330294238_BpmguQA2WyNHg4mWvQjnlRNEULz3IGvK.jpg" alt="${detalji.naziv}">
            </div>
            <div class="info">
                <p><strong>Naziv: </strong>${detalji.naziv}</p>
                <p><strong>Kvadratura: </strong>${detalji.kvadratura} m2</p>
                <p><strong>Cijena: </strong>${detalji.cijena} KM</p>
            </div>
        `;

        document.getElementById('detalji').innerHTML = `
            <div id="lijevo">
                <p><strong>Tip grijanja: </strong>${detalji.tip_grijanja}</p>
                <p><strong>Lokacija: </strong>${detalji.lokacija}</p>
            </div>
            <div id="desno">
                <p><strong>Godina izgradnje: </strong>${detalji.godina_izgradnje}</p>
                <p><strong>Datum objave: </strong>${detalji.datum_objave}</p>
            </div>
            <div id="ispod">
                <p><strong>Opis: </strong>${detalji.opis}</p>
            </div>
        `;

        populateUpitiSection(detalji.upiti);
        
    
    });
}

// Call the function when the DOM is ready
document.addEventListener('DOMContentLoaded', function () {
    populateDetaljiPage();
});

function populateUpitiSection(upiti) {
    const upitiList = document.getElementById('upiti');
    upitiList.innerHTML = "";

    upiti.forEach(upit => {
        const upitElement = document.createElement('li');
        upitElement.classList.add('upit');

        upitElement.innerHTML = `
            <p class="username">${upit.username}</p>
            <p class="sadrzajupita">${upit.tekst}</p>
        `;

        upitiList.appendChild(upitElement);
    });
}