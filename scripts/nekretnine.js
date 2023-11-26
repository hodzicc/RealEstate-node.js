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
    const nekretninaElement = createElement('div', 'property', null);

    const imgElement = createElement('img', null, null);
    imgElement.src = nekretnina.slika;
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
  divReferenca.innerHTML = ''; // Clear the content
  divReferenca.appendChild(h2Element);
  divReferenca.appendChild(containerElement);
}
