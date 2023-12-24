const MarketingAjax = (() => {

    // Function to send a POST request to /marketing/nekretnine
    function novoFiltriranje(nekretnineIds) {
       
    fetch('/marketing/nekretnine', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ nizNekretnina: nekretnineIds }),
    })
    .then(response => {
        if (response.ok) {
            console.log('Successfully sent nekretnine request');
        } else {
            console.error('Failed to send nekretnine request');
        }
    })
    .catch(error => {
        console.error('Error sending nekretnine request:', error);
    });
    }

    function klikNekretnina(id) {
       
        fetch(`/marketing/nekretnina/${id}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
        })
        .then(response => {
            if (response.ok) {
                console.log(`Successfully sent nekretnina request for id: ${id}`);
            } else {
                console.error(`Failed to send nekretnina request for id: ${id}`);
            }
        })
        .catch(error => {
            console.error(`Error sending nekretnina request for id: ${id}`, error);
        });
    }

    function updateCountsUI(sessionCounts, type) {
        sessionCounts.forEach(({ id, pretrage, klikovi }) => {
          const pretrageElement = document.getElementById(`pretrage-${id}`);
          if (pretrageElement) {
            pretrageElement.textContent = `Pretrage: ${pretrage}`;
          }
          
    
          const klikoviElement = document.getElementById(`klikovi-${id}`);
          if (klikoviElement) {
            klikoviElement.textContent = `Klikovi: ${klikovi}`;
          }
        });
      }

      let isFirstCall = true;

      // Function to send a POST request to /marketing/nekretnine
      function osvjeziPretrage(divNekretnine) {
      
        // Extract IDs from divNekretnine
        const nekretninaIds = Array.from(divNekretnine.querySelectorAll('.nekretnina'))
       .map(nekretninaElement => nekretninaElement.dataset.id); 

    
        fetch('/marketing/osvjezi', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: isFirstCall ? JSON.stringify({ nizNekretnina: nekretninaIds }) : JSON.stringify({}),
        })
          .then(response => response.json())
          .then(data => {
            //console.log("preee: ". data.nizNekretnina);
            // Update UI with new counts
            updateCountsUI(data.nizNekretnina, 'pretrage');
          })
          .catch(error => {
            console.error('Error updating pretrage counts:', error);
          })
          .finally(() => {
            // After the first call, set isFirstCall to false
            isFirstCall = false;
            // Schedule the next call after 500ms
            setTimeout(() => osvjeziPretrage(divNekretnine), 500);
          });
      }
      let isFirstCallK = true;

      // Function to send a POST request to /marketing/nekretnine
      function osvjeziKlikove(divNekretnine) {
        
        // Extract IDs from divNekretnine
        const nekretninaIds = Array.from(divNekretnine.querySelectorAll('.nekretnina'))
       .map(nekretninaElement => nekretninaElement.dataset.id); 
    
 
        fetch('/marketing/osvjezi', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: isFirstCallK ? JSON.stringify({ nizNekretnina: nekretninaIds }) : JSON.stringify({}),
        })
          .then(response => response.json())
          .then(data => {
          
            // Update UI with new counts
            updateCountsUI(data.nizNekretnina, 'klikovi');
          })
          .catch(error => {
            console.error('Error updating klikovi counts:', error);
          })
          .finally(() => {
            // After the first call, set isFirstCall to false
            isFirstCallK = false;
            // Schedule the next call after 500ms
            setTimeout(() => osvjeziKlikove(divNekretnine), 500);
          });
      }
    

    return {
        klikNekretnina,
        novoFiltriranje,
        osvjeziPretrage,
        osvjeziKlikove
        
    };
})();