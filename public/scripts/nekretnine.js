function createElement(tag, className, content) {
  const element = document.createElement(tag);
  if (className) {
    element.classList.add(className);
  }
  if (content) {
    element.textContent = content;
  }
  return element;
}

function spojiNekretnine(divReferenca, instancaModula, tip_nekretnine) {
  // pozivanje metode za filtriranje
  const filtriraneNekretnine = instancaModula.filtrirajNekretnine({ tip_nekretnine: tip_nekretnine });

  const h2Element = createElement('h2', null, tip_nekretnine);

  // Create a container element
  const containerElement = createElement('div', 'container');

  filtriraneNekretnine.forEach(nekretnina => {
    // Kreiranje HTML elementa za prikaz nekretnine
    const nekretninaElement= document.createElement('div');
     
    if(tip_nekretnine=="Stan")
    nekretninaElement.classList.add("property", "stan");
  else if( tip_nekretnine=="Kuća")
   nekretninaElement.classList.add("property", "kuca");
  else if (tip_nekretnine=="Poslovni prostor")
  nekretninaElement.classList.add("property", "pp");

    const imgElement = createElement('img', null, null);
    imgElement.src = "https://www.apartments.com/blog/sites/default/files/styles/x_large_hq/public/image/2023-06/ParkLine-apartment-in-Miami-FL.jpg?itok=kQmw64UU";
    imgElement.alt = tip_nekretnine;
    

    const propertyInfoElement = createElement('div', 'property-info', null);

    const lijevoElement = createElement('div', 'lijevo', null);
    lijevoElement.appendChild(createElement('p', null, `Naziv nekretnine: ${nekretnina.naziv}`));
    lijevoElement.appendChild(createElement('p', null, `Kvadratura: ${nekretnina.kvadratura} m2`));

    const desnoElement = createElement('div', 'desno', null);
    desnoElement.appendChild(createElement('p', null, `Cijena: ${nekretnina.cijena} KM`));

    propertyInfoElement.appendChild(lijevoElement);
    propertyInfoElement.appendChild(desnoElement);

    nekretninaElement.appendChild(imgElement);
    nekretninaElement.appendChild(propertyInfoElement);
    nekretninaElement.appendChild(createElement('button', 'detalji-button', 'Detalji'));

    // Dodavanje elementa u container
    containerElement.appendChild(nekretninaElement);
  });

  // Append the container element to divReferenca
  if(divReferenca){
  divReferenca.appendChild(h2Element);
  divReferenca.appendChild(containerElement);
  }
}

const divStan = document.getElementById("stan");
const divKuca = document.getElementById("kuca");
const divPp = document.getElementById("pp");

// Fetch nekretnine from the server
PoziviAjax.getNekretnine((err, data) => {
  if (err) {
      console.error("Error fetching nekretnine:", err);
      return;
  }

  // Initialize the module with fetched data
  let nekretnine = SpisakNekretnina();
  nekretnine.init(data, []);

  // Display properties
  spojiNekretnine(divStan, nekretnine, "Stan");
  spojiNekretnine(divKuca, nekretnine, "Kuća");
  spojiNekretnine(divPp, nekretnine, "Poslovni prostor");
});