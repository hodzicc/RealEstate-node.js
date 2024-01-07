// spojiUpite.js

document.addEventListener('DOMContentLoaded', function () {
   
    const postaviUpitDiv = document.getElementById('postavi-upit');
    const tekstUpitaInput = document.getElementById('tekst-upita');
    const postaviUpitBtn = document.getElementById('postavi-upit-btn');
   

    PoziviAjax.getKorisnik(function (err, data) {
        if (!data) {
            postaviUpitDiv.style.display = 'none';
        } else {
            postaviUpitDiv.style.display = 'block';

            postaviUpitBtn.addEventListener('click', function () {
                const urlParams = new URLSearchParams(window.location.search);
                const nekretninaId = urlParams.get('id');
                const tekstUpita = tekstUpitaInput.value;

                PoziviAjax.postUpit(nekretninaId, tekstUpita, function (err, response) {
                    if (err) {
                        console.error('Greška prilikom slanja upita:', err);
                    } else {
                        const detaljiUrl = `detalji.html?id=${nekretninaId}`;
                        window.location.href = detaljiUrl;
                    }
                });
            });

        }
    });


});
