let prijavaElement, odjavaElement, profilElement, nekretnineElement, detaljiElement;
window.onload=function(){
    prijavaElement = document.getElementById("prijava");
    odjavaElement = document.getElementById("odjava");
    profilElement = document.getElementById("profil");
    nekretnineElement = document.getElementById("nekretnine");
    detaljiElement = document.getElementById("detalji");
    meniAjax(null,prikaziMeni);
    odjavaElement.addEventListener("click",function(){logoutAjax(prikaziMeni);})
}
function prikaziMeni(isLoggedIn) {
    if (isLoggedIn) {
        // User is logged in
        prijavaElement.style.visibility = "collapse";
        odjavaElement.style.visibility = "visible";
        profilElement.style.visibility = "visible";
        nekretnineElement.style.visibility = "visible";
        detaljiElement.style.visibility = "visible";


    } else {
        // User is not logged in
        prijavaElement.style.visibility = "visible";
        odjavaElement.style.visibility = "collapse";
        profilElement.style.visibility = "collapse";
        nekretnineElement.style.visibility = "visible";
        detaljiElement.style.visibility = "visible";
        
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
       if (ajax.readyState == 4 && ajax.status == 200){
           fnCallback(false);
       }
       else if (ajax.readyState == 4)
           fnCallback(ajax.statusText,null);
   }
   ajax.open("POST","http://localhost:3000/logout",true);
   ajax.setRequestHeader("Content-Type", "application/json");
   ajax.send(JSON.stringify({loggedIn:false}));
   
}