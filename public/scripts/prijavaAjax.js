document.addEventListener("DOMContentLoaded", function() {
    let prijavaElement;

    prijavaElement = document.getElementById("prijava");

    prijavaElement.addEventListener("click", function (event) {
        event.preventDefault(); // Prevent the form from submitting
        const username = document.getElementById("username").value;
        const password = document.getElementById("password").value;
        PoziviAjax.postLogin(username, password, function(err){
            if(err)
                alert("Neispravan username ili password");
            else
                window.open("../meni.html", "_top");
        });
    });
});
