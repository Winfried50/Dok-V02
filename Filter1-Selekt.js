//Filter1-Selekt.js
function anzeigefilter1() {
    filter1auswahl = filterjson.filter1.option[0].optwert;
    let option = [];
    const divElement = document.createElement('div');
    divElement.id = 'Selektauswahl'; //DIV-Element erstellen
    divElement.classList.add('container');
    const label = document.createElement('label');
    label.htmlFor = 'auswahl'; // Verknüpfung mit dem Select-Element
    label.textContent = filterjson.filter1.filtername;
    /*label.style.fontWeight = 'bold';*/
    const selectElement = document.createElement('select');
    selectElement.id = 'auswahl'; //Select-Element erstellen
    selectElement.name = 'auswahl';
    //Optionen hinzufügen
    let anzoptionen = filterjson.filter1.option.length;
    for (let i = 0 ; i < anzoptionen ; i++) {
        //console.log ("let = i ", i );
        option[i] = document.createElement('option');
        option[i].textContent = filterjson.filter1.option[i].optname;
        option[i].value = filterjson.filter1.option[i].optwert; 
        selectElement.appendChild(option[i]);
        
    }
    divElement.appendChild(label);
    divElement.appendChild(selectElement);
    selectElement.addEventListener('input', function() {
        filter1auswahl = this.value;
    hauptverarbeitung();
    });
     return divElement; // <-- HINZUFÜGEN: Element zurückgeben
}
