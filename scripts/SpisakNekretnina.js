let SpisakNekretnina = function () {
    
    let listaNekretnina = [];
    let listaKorisnika = [];
    
    let init = function (listaNekretnina1, listaKorisnika1) {
        listaKorisnika=listaKorisnika1;
        listaNekretnina=listaNekretnina1;
    }

    function zadovoljavaKriterije(nekretnina, kriterij) {
        if (kriterij.tip_nekretnine && nekretnina.tip_nekretnine !== kriterij.tip_nekretnine) {
            return false;
        }
    
        if (kriterij.min_kvadratura && nekretnina.kvadratura < kriterij.min_kvadratura) {
            return false;
        }
    
        if (kriterij.max_kvadratura && nekretnina.kvadratura > kriterij.max_kvadratura) {
            return false;
        }
    
        if (kriterij.min_cijena && nekretnina.cijena < kriterij.min_cijena) {
            return false;
        }
    
        if (kriterij.max_cijena && nekretnina.cijena > kriterij.max_cijena) {
            return false;
        }
    
        // Ako nijedan od gorenavedenih uvjeta nije ispunjen, nekretnina zadovoljava kriterije
        return true;
    }
    
    
    let filtrirajNekretnine = function (kriterij) {
       
        // Asumiramo da postoji neki niz nekretnina (nekretnine) koji želimo filtrirati
        let filtriraneNekretnine = listaNekretnina.filter(listaNekretnina => zadovoljavaKriterije(listaNekretnina, kriterij));
    
        // Vraćamo filtrirane nekretnine
        return filtriraneNekretnine;

    }

    let ucitajDetaljeNekretnine = function (id) {

        for(let i=0; i<listaNekretnina.length; i++)
        {
                if(listaNekretnina[i].id==id){
                    return listaNekretnina[i];
                }
        }
        return null;
    }


    return {
        init: init,
        filtrirajNekretnine: filtrirajNekretnine,
        ucitajDetaljeNekretnine: ucitajDetaljeNekretnine
    }
};