// Hauptverarbeitung
let anzfileshinzu = 0; 
let anzfiles = 0;  
let anzfilesgesamt = 0;
let anzfilesgefiltert = 0;
let anzdokumente = "";
let anzdokumentehinzu = "";
let dokumente_add = "";
let filterjson = null;
//Menüfunktion 
function showContent(sectionId) {
  if (sectionId === "logout") { logout();}
    // Alle Inhalte ausblenden  
    document.querySelectorAll('.content, .handbuch').forEach(div => div.classList.remove('active'));
    // Nur das geklickte anzeigen
    document.getElementById(sectionId).classList.add('active');
    ladenFilterparameter();
   
    // hinzugefügte Dokumente auf leer setzen
    //anzdokumente = "Anzahl: " + anzfiles;
    if (sectionId === "addDokumente" ) {
      dokumente_add = "";
      anzdokumentehinzu = "";
      anzfileshinzu = 0;
      document.getElementById('anzdoksadd').innerHTML = anzdokumentehinzu;
      document.getElementById('dokadd').innerHTML = dokumente_add;
    }
}
function toggleSubmenu() {
  document.getElementById("mySubmenu").classList.toggle("show");
}
// Schließt das Untermenü, wenn außerhalb geklickt wird
window.onclick = function(event) {
    if (!event.target.matches('.menu-icon')) {
        var submenu = document.getElementById("mySubmenu");
        if (submenu.classList.contains('show')) {
            submenu.classList.remove('show');
        }
    }
}
function logout() {
  window.open('', '_self', '');
  window.close();
  window.location.href = "about:blank";
}

filteraufbau();
function filteraufbau() {
// Aufbau der DIV,s innerhalb des Containers id="filter-wraper"
    // Sicherstellen, dass das DOM bereit ist (obwohl am Ende von body meist ok)
    document.addEventListener('DOMContentLoaded', () => {
        // Definition Wrapper  - "Verpackung"
        const filterWrapper = document.getElementById('filter-wrapper');
        // Prüfen, ob der Wrapper gefunden wurde (wichtig!)
        if (filterWrapper) {
          // Filter 1: Funktion anzeigefilter1 gibt das radioDiv zurück
          const filter1Div = anzeigefilter1(); // Funktion muss divElement zurückgeben
          if (filter1Div) filterWrapper.appendChild(filter1Div);
          // Filter 2: Funktion anzeigefilter2 gibt das radioDiv zurück
          const filter2Div = anzeigefilter2();
          if (filter2Div) filterWrapper.appendChild(filter2Div);
          // Event-Listener für Filter 2 initialisieren (falls nötig und nicht in anzeigefilter2)
          initFilter2Listeners();
          // Filter 3: Funktion anzeigefilter3 gibt das radioDiv zurück
          const filter3Div = anzeigefilter3();
          if (filter3Div) filterWrapper.appendChild(filter3Div);
          // Event-Listener für Filter 3 initialisieren (falls nötig und nicht in anzeigefilter3)
          initFilter3Listeners();
    
        } else {
          console.error("Filter-Wrapper Element nicht gefunden!");
        }
      });
  }
// Filter Basisvariante
const filterjsoninit = {
    "filter1": {
      "filtername": "Dokumenten-Art",
      "option":[{
        "optname": "alles anzeigen",
        "optwert": ""},
        {
        "optname": "Ausweis",
        "optwert": "ausweis"},
        {
        "optname": "Auto",
        "optwert": "auto"},
          {
        "optname": "Gesundheit",
        "optwert": "gesund"},
        {
        "optname": "Urkunde",
        "optwert": "urkunde"},
        {
        "optname": "Vorsorge",
        "optwert": "vorsorge"}
        ]
    },
    "filter2": {
      "filtername": "Personen",
      "option":[{
        "optname": "alle anzeigen",
        "optwert": ""},
        {
        "optname": "Winfried",
        "optwert": "winfried"}
        ]
    },
    "filter3": {
      "filtername": "Dokumenten-Format",
      "option":[{
        "optname": "alle anzeigen",
        "optwert": ""},
        {
        "optname": "Bilder-jpg",
        "optwert": "jpg"},
        {
        "optname": "Schriftstücke-pdf",
        "optwert": "pdf"}
        ]
    }
};
let alertzaehlerfilterparameter = 0;
ladenFilterparameter();
function ladenFilterparameter() {
    if (localStorage.getItem("dokumenteFilterparameter") === null) {
      if (alertzaehlerfilterparameter === 0) {
        alert ("In deinem Browser sind keine Filterparameter gespeichert! \n" + 
            "Sie wurden mit der Basisvariante aufgebaut. \n" +
            "Bearbeite die Filterparameter nach deinen persönlichen Vorstellungen! \n" +
            "Führe anschließend ein Backup der Filterparameter durch!"
        ) ;
        alertzaehlerfilterparameter = alertzaehlerfilterparameter + 1;
        }
        workingCopy = filterjsoninit;
        originalFilters = filterjsoninit;
        filterjson = filterjsoninit;
    } else {
        workingCopy = JSON.parse(localStorage.getItem("dokumenteFilterparameter"));
        originalFilters = workingCopy;
        filterjson = workingCopy;
    } 
}
let ersetzenlöschen = "nein"; // Anzeigen der Button Erstezen, Löschen 
let filter1auswahl = "";
let filter2auswahl = "";
let filter3auswahl = "";
function hauptverarbeitung() {  
    let filterprotokoll = "gesetzte Filter: " + filter1auswahl + " " + filter2auswahl + " " + filter3auswahl;  
    document.getElementById('filter-output').innerHTML = filterprotokoll;
    ladenFilterparameter();
    renderItemsFilter();
}
// Anzeigen "Ersetzen/Löschen" JA / NEIN
document.addEventListener('DOMContentLoaded', function() {
        const radioButtons = document.querySelectorAll('input[name="fortfahren"]');
        radioButtons.forEach(radio => {
            radio.addEventListener('change', function() {
                if (this.value === 'ja') {
                    ersetzenlöschen = "ja";
                    hauptverarbeitung();
                } else {
                    ersetzenlöschen = "nein";
                    hauptverarbeitung();
                }
            });
        });
    }); 

