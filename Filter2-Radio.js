//Filter2-Radio
filter2auswahl = "";
// EventDispatcher für globale Kommunikation
const eventDispatcher2 = new EventTarget(); //Zentrale Event-Steuerung für alle Komponenten
// Nach Auswahl den Wert abfragen 
function initFilter2Listeners() {
  // Event-Listener registrieren
  eventDispatcher2.addEventListener('filter2auswahl', (event) => {
  filter2auswahl = event.detail.wert;
  hauptverarbeitung();
  });
  // Radio-Buttons erstellen und einfügen
  // Initialwert setzen
  eventDispatcher2.dispatchEvent(
    new CustomEvent('filter2auswahl', {
      detail: { wert: filterjson.filter2.option[0].optwert } // Sinnvoller Startwert?
    })
  );
}

function anzeigefilter2() {
    // 1. Container-DIV erstellen
    const radioDiv = document.createElement('div');
    radioDiv.id = 'Radioauswahl2';
    radioDiv.classList.add('container');
     // 2. Gruppen-Label erstellen
    const groupLabel = document.createElement('label');
    groupLabel.textContent = filterjson.filter2.filtername;
    groupLabel.style.display = 'block';
    groupLabel.style.marginBottom = '10px';
    /*groupLabel.style.fontWeight = 'bold';*/
    radioDiv.appendChild(groupLabel);
    // 3. Radio-Optionen erstellen
    const options = filterjson.filter2.option.map((item, index) => ({
          id: 'filter2opt' + (index + 1),
          value: item.optwert,
          label: item.optname
        }
      )
    );
    
    options.forEach((option, index) => {
      // Container für jede Radio-Option
      const optionContainer = document.createElement('div');
      optionContainer.style.margin = '5px 0';
      // Radio-Button erstellen
      const radioInput = document.createElement('input');
      radioInput.type = 'radio';
      radioInput.id = option.id;
      radioInput.name = 'radioGroup2'; // Wichtig: gleicher Name für Gruppe
      radioInput.value = option.value;
      radioInput.checked = (index === 0); // Wichtig: Nur erste Option vorausgewählt
      // Label für Radio-Button
      const radioLabel = document.createElement('label');
      radioLabel.htmlFor = option.id;
      radioLabel.textContent = option.label;
      radioLabel.style.marginLeft = '5px';
      // Event-Listener Löst bei jeder Änderung ein Event aus
      radioInput.addEventListener('change', function() {
          if (this.checked) {
            // Custom Event auslösen
            eventDispatcher2.dispatchEvent(
                new CustomEvent('filter2auswahl', { 
                detail: { wert: this.value },
                }
              )
            );
          };
        }
      );
      // Elemente zusammenbauen
      optionContainer.appendChild(radioInput);
      optionContainer.appendChild(radioLabel);
      radioDiv.appendChild(optionContainer);
    });
    return radioDiv;
}
