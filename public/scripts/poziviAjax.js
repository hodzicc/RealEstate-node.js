const PoziviAjax = (() => {
    // fnCallback se u svim metodama poziva kada stigne odgovor sa servera putem Ajax-a
    // svaki callback kao parametre ima error i data,
    // error je null ako je status 200 i data je tijelo odgovora
    // ako postoji greška, poruka se prosljeđuje u error parametru callback-a, a data je tada null
    function posaljiAjax(metoda, stranica, podaci, fnCallback){
        let ajax = new XMLHttpRequest();
    
        ajax.onreadystatechange = function() {
            if (ajax.readyState == 4 && ajax.status == 200)
                fnCallback(null, JSON.parse(ajax.responseText));
            else if (ajax.readyState == 4)
                fnCallback(ajax.statusText, null);
        }
        
        ajax.open(metoda, "http://localhost:3000/" + stranica, true);
        ajax.setRequestHeader("Content-Type", "application/json");
        ajax.send(podaci);
    }

    function impl_getKorisnik(fnCallback) {
        posaljiAjax("GET", "korisnik", null, fnCallback);
    }

    function impl_putKorisnik(noviPodaci, fnCallback) {
        posaljiAjax("PUT", "korisnik", JSON.stringify(noviPodaci), fnCallback);
    }

    function impl_postUpit(nekretnina_id, tekst_upita, fnCallback) {
        posaljiAjax("POST", "upit", JSON.stringify({nekretnina_id: nekretnina_id, tekst_upita: tekst_upita}), fnCallback);
    }

    function impl_getNekretnine(fnCallback) {
        posaljiAjax("GET", "nekretnine", null, fnCallback);
    }

    function impl_postLogin(username, password, fnCallback) {
        posaljiAjax("POST", "login", JSON.stringify({username: username, password: password}), fnCallback);
    }

    function impl_postLogout(fnCallback) {
        posaljiAjax("POST", "logout", null, fnCallback);
    }

    return {
        postLogin: impl_postLogin,
        postLogout: impl_postLogout,
        getKorisnik: impl_getKorisnik,
        putKorisnik: impl_putKorisnik,
        postUpit: impl_postUpit,
        getNekretnine: impl_getNekretnine
    };
})();