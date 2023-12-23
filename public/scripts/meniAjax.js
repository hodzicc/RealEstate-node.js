let prijavaElement, odjavaElement, profilElement, nekretnineElement, detaljiElement;
window.onload=function(){

    prijavaElement = document.getElementById("prijava");
    odjavaElement = document.getElementById("odjava");
    profilElement = document.getElementById("profil");
    nekretnineElement = document.getElementById("nekretnine");
    detaljiElement = document.getElementById("detalji");

    meniAjax(prikaziMeni);

    odjavaElement.addEventListener("click", function (event) {       
        event.preventDefault();         
        PoziviAjax.postLogout(function(err){
            if(err)
                alert("Neautorizovan pristup");
            else
                window.open("../meni.html", "_top");
        });
    });
}
function prikaziMeni(isLoggedIn) {
    if (isLoggedIn) {
        prijavaElement.style.display = "none";
        odjavaElement.style.display = "inline-block";
        profilElement.style.display = "inline-block";
        nekretnineElement.style.display = "inline-block";
        detaljiElement.style.display = "inline-block";
    } else {
        prijavaElement.style.display = "inline-block";
        odjavaElement.style.display = "none";
        profilElement.style.display = "none";
        nekretnineElement.style.display = "inline-block";
        detaljiElement.style.display = "inline-block";
    }
}

function meniAjax(fnCallback) {
    PoziviAjax.getKorisnik(function (err, data) {
        if (data.id==null) {
            fnCallback(false); // Assume not logged in on error
        } else {
            fnCallback(true);
        }
    });
}
