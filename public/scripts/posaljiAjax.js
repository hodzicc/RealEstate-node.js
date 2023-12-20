let prijavaElement, odjavaElement, profilElement, nekretnineElement, detaljiElement;
window.onload=function(){
    prijavaElement = document.getElementById("prijava");
    odjavaElement = document.getElementById("odjava");
    profilElement = document.getElementById("profil");
    nekretnineElement = document.getElementById("nekretnine");
    detaljiElement = document.getElementById("detalji");
    meniAjax(null,prikaziMeni);
    odjavaElement.addEventListener("click",function (event) {       
        event.preventDefault();         
        logoutAjax(function(err){
        if(err)
            alert("Neautorizovan pristup");
        else
        window.open("../meni.html", "_top");
        } );
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
        // User is not logged in
        prijavaElement.style.display = "inline-block";
        odjavaElement.style.display = "none";
        profilElement.style.display = "none";
        nekretnineElement.style.display = "inline-block";
        detaljiElement.style.display = "inline-block";
        
    }
}


function meniAjax(loggedIn,fnCallback){
   let ajax = new XMLHttpRequest();
   ajax.onreadystatechange = function() {// Anonimna funkcija
       if (ajax.readyState == 4 && ajax.status == 200){
           var jsonRez = JSON.parse(ajax.responseText);
           fnCallback(jsonRez.loggedIn);           
       }
       else if (ajax.readyState == 4)
           fnCallback(ajax.statusText,null);
   }
   ajax.open("POST","http://localhost:3000/meni.html",true);
   ajax.setRequestHeader("Content-Type", "application/json");
   ajax.send(JSON.stringify({loggedIn:loggedIn}));
}

function logoutAjax(fnCallback){
 
   let ajax = new XMLHttpRequest();
   ajax.onreadystatechange = function() {// Anonimna funkcija
       if(ajax.readyState==4 && ajax.status == 200){
           fnCallback(false);
       }
       else if (ajax.status == 401)
           fnCallback(true);
   }
   ajax.open("POST","http://localhost:3000/logout",true);
   ajax.send();
   
}