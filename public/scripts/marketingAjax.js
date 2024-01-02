const MarketingAjax = (() => {
  let prviPozivPretrage = true;
  let prviPozivKlikovi = true;
  let trenutniNiz = [];

  function osvjeziPretrage(divNekretnine){
      setInterval(() => {
      let ajax = new XMLHttpRequest();
  
      ajax.onreadystatechange = function() {
          if (ajax.readyState == 4 && ajax.status == 200){
              let nizNekretnina = JSON.parse(ajax.responseText);

              for(let i = 0; i < nizNekretnina.length; i++){
                  let pretrage = document.getElementById(`pretrage-${nizNekretnina[i].id}`);                 
                  pretrage.textContent = `Pretrage: ${nizNekretnina[i].pretrage}`
              }
          }
      }
      
      ajax.open("POST", "http://localhost:3000/marketing/osvjezi", true);
      ajax.setRequestHeader("Content-Type", "application/json");
      if(prviPozivPretrage){
          prviPozivPretrage = false;
          ajax.send(JSON.stringify({ nizNekretnina: trenutniNiz}));
      } else 
      ajax.send();
  }, 500);
  }

  function osvjeziKlikove(divNekretnine){
      setInterval(() => {
      let ajax = new XMLHttpRequest();
  
      ajax.onreadystatechange = function() {
          if (ajax.readyState == 4 && ajax.status == 200){
              let nizNekretnina = JSON.parse(ajax.responseText);

              for(let i = 0; i < nizNekretnina.length; i++){
                  let klikovi = document.getElementById(`klikovi-${nizNekretnina[i].id}`);
                  klikovi.textContent = `Klikovi: ${nizNekretnina[i].klikovi}`;
              }
          }
      }
      
      ajax.open("POST", "http://localhost:3000/marketing/osvjezi", true);
      ajax.setRequestHeader("Content-Type", "application/json");
      if(prviPozivKlikovi){
          prviPozivKlikovi = false;
          ajax.send(JSON.stringify({ nizNekretnina: trenutniNiz}));
      } else 
      ajax.send();
      }, 500);
  }

  function novoFiltriranje(listaFiltriranihNekretnina){
      let ajax = new XMLHttpRequest();
  
      let nizIdeva = listaFiltriranihNekretnina.map(item => item.id);

      ajax.onreadystatechange = function(){
          if (ajax.readyState == 4 && ajax.status == 200){
              trenutniNiz = nizIdeva;
              prviPozivPretrage = true;
              prviPozivKlikovi = true;
          }
      };
      
      ajax.open("POST", "http://localhost:3000/marketing/nekretnine", true);
      ajax.setRequestHeader("Content-Type", "application/json");
      ajax.send(JSON.stringify({nizNekretnina: nizIdeva}));
  }

  function klikNekretnina(idNekretnine){
      let ajax = new XMLHttpRequest();

      ajax.onreadystatechange = function(){
          if (ajax.readyState == 4 && ajax.status == 200){
              trenutniNiz = [idNekretnine];
              prviPozivPretrage = true;
              prviPozivKlikovi = true;
          }
      };

      ajax.open("POST", `http://localhost:3000/marketing/nekretnina/${idNekretnine}`, true);
      ajax.setRequestHeader("Content-Type", "application/json");
      ajax.send();
  }
  return {
      osvjeziPretrage: osvjeziPretrage,
      osvjeziKlikove: osvjeziKlikove,
      novoFiltriranje: novoFiltriranje,
      klikNekretnina: klikNekretnina
  };
})();