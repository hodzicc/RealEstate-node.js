let prijavaElement;
window.onload = function () {

    prijavaElement = document.getElementById("prijava");
   
    prijavaElement.addEventListener("click", function (event) {
        
        event.preventDefault(); // Prevent the form from submitting
        const username = document.getElementById("username").value;
        const password = document.getElementById("password").value;
        loginAjax(username, password, function(err){
        if(err)
            alert("Neispravan username ili password");
        else
        window.open("../meni.html", "_top");
        } );
    })
}


function loginAjax(username, password, fnCallback) {
 
    let ajax = new XMLHttpRequest();
    ajax.onreadystatechange = function () {
        if (ajax.readyState==4 && ajax.status == 200) {
            fnCallback(false);
        } else if (ajax.status == 401) {
            fnCallback(true);
        }
    }
    ajax.open("POST", "http://localhost:3000/login", true);
    ajax.setRequestHeader("Content-Type", "application/json");
    const requestBody = JSON.stringify({ username: username, password: password });
    ajax.send(requestBody);
}
