//Filter3-Radio
filter3auswahl = "";
// EventDispatcher für globale Kommunikation
const eventDispatcher3 = new EventTarget(); //Zentrale Event-Steuerung für alle Komponenten
// Nach Auswahl den Wert abfragen 
 function initFilter3Listeners() {
  // Event-Listener registrieren
  eventDispatcher3.addEventListener('filter3auswahl', (event) => {
    filter3auswahl = event.detail.wert;
    hauptverarbeitung();
  });
  // Radio-Buttons erstellen und einfügen

  // Initialwert setzen
  eventDispatcher3.dispatchEvent(
    new CustomEvent('filter3auswahl', {
      detail: { wert: filterjson.filter3.option[0].optwert } // Sinnvoller Startwert?
    })
  );
}

function anzeigefilter3() {
    // 1. Container-DIV erstellen
    const radioDiv = document.createElement('div');
    radioDiv.id = 'Radioauswahl3';
    radioDiv.classList.add('container');
    // 2. Gruppen-Label erstellen
    const groupLabel = document.createElement('label');
    //groupLabel.textContent = 'Bitte wählen Sie eine Option:';
    groupLabel.textContent = filterjson.filter3.filtername;
    groupLabel.style.display = 'block';
    groupLabel.style.marginBottom = '10px';
    /*groupLabel.style.fontWeight = 'bold';*/
    radioDiv.appendChild(groupLabel);
    // 3. Radio-Optionen erstellen
    const options = filterjson.filter3.option.map((item, index) => ({
          id: 'filter3opt' + (index + 1),
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
        radioInput.name = 'radioGroup3'; // Wichtig: gleicher Name für Gruppe
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
              eventDispatcher3.dispatchEvent(
                  new CustomEvent('filter3auswahl', { 
                  detail: { wert: this.value }
                  }
                )
              );
            }
          }
        );

        // Elemente zusammenbauen
        optionContainer.appendChild(radioInput);
        optionContainer.appendChild(radioLabel);
        radioDiv.appendChild(optionContainer);
    });
     return radioDiv;
}
