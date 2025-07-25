/*indexeddb-manager.js*/
console.log("indexeddb_manager.js") 

const DB_NAME = "dokumente";
const DB_VERSION = 2;
const STORE_NAMES = ["pdfStore", "bildStore"];
let db; // Datenbank-Variable

datum = new Date();
backupname = "backup-" + DB_NAME + "-" + datum.getFullYear()
    + "-" + (datum.getMonth()+1).toLocaleString ()
    + "-" + datum.getDate().toLocaleString () + ".txt";
// Öffne die DB
function openDB() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, DB_VERSION);
        request.onsuccess = (event) => {
            db = event.target.result;
            console.log("Datenbank geöffnet.");
            resolve(db);
            renderItems(); // Anzeigen der vorhandenen Items nach dem Öffnen der DB
        };
        request.onerror = (event) => {
            console.error("Fehler beim Öffnen der Datenbank:", event.target.errorCode);
            reject("Fehler beim Öffnen der Datenbank: " + event.target.errorCode);
        };
        request.onupgradeneeded = (event) => {
            const db = event.target.result;
            console.log("onupgradeneeded wird ausgeführt.");
            STORE_NAMES.forEach(storeName => {
                if (!db.objectStoreNames.contains(storeName)) {
                    db.createObjectStore(storeName, { keyPath: "id", autoIncrement: true });
                    console.log(`Object Store "${storeName}" erstellt.`);
                }
            });
        };
    });
}
//Aktualisierung des DB-Satzes
async function insertItem(storeName, item) {
    if (!db) {
        await openDB();
    }
    return new Promise((resolve, reject) => {
        const transaction = db.transaction(storeName, "readwrite");
        const store = transaction.objectStore(storeName);
        const request = store.put(item); // 'put' aktualisiert oder fügt hinzu (mit autoIncrement)

        request.onsuccess = (event) => {
            resolve(event.target.result); // Gibt die generierte ID zurück
        };

        request.onerror = (event) => {
            reject("Fehler beim Einfügen des Items in Store '" + storeName + "': " + event.target.errorCode);
        };
    });
}

// backup
async function backupItems() {
    const dbName = DB_NAME;
    const dbVersion = DB_VERSION;
    const storeNames = STORE_NAMES;
    const backupData = {};
    try {
      const db = await new Promise((resolve, reject) => {
        const request = indexedDB.open(dbName, dbVersion);
        request.onsuccess = () => {
          resolve(request.result);
        };
        request.onerror = (event) => {
          reject("Fehler beim Öffnen der Datenbank: " + event.target.errorCode);
        };
        request.onupgradeneeded = (event) => {
          // Diese Funktion sollte idealerweise nur zum Erstellen/Ändern der Struktur verwendet werden.
          // Da wir nur lesen, sollte dies im Normalfall nicht aufgerufen werden.
          console.warn("Upgrade der Datenbank während des Backups.");
        };
      });
      for (const storeName of storeNames) {
        const items = await new Promise((resolve, reject) => {
          const transaction = db.transaction(storeName, "readonly");
          const store = transaction.objectStore(storeName);
          const allItems = [];
          const request = store.openCursor();
          request.onsuccess = (event) => {
            const cursor = event.target.result;
            if (cursor) {
              allItems.push(cursor.value);
              cursor.continue();
            } else {
              resolve(allItems);
            }
          };
          request.onerror = (event) => {
            reject("Fehler beim Lesen des Stores '" + storeName + "': " + event.target.errorCode);
          };
        });
        backupData[storeName] = items;
      }
      db.close();
      const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = backupname;
      a.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Fehler beim Backup aller Stores:", error);
      alert("Fehler beim Erstellen des Backups.");
    }
}

// restore
async function restoreItems(event) {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async () => {
        try {
            const backupData = JSON.parse(reader.result);
            if (typeof backupData !== 'object' || backupData === null) {
                throw new Error("Ungültiges Backup-Datei Format.");
            }
            await openDB(); // Sicherstellen, dass die Datenbank geöffnet ist
            for (const storeName of STORE_NAMES) {
                if (backupData.hasOwnProperty(storeName) && Array.isArray(backupData[storeName])) {
                    const transaction = db.transaction(storeName, "readwrite");
                    const store = transaction.objectStore(storeName);
                    await store.clear(); // Alten Daten im Store löschen
                    for (const item of backupData[storeName]) {
                        await new Promise((resolve, reject) => {
                            const request = store.put(item); // 'put' verwendet das vorhandene 'id' oder generiert ein neues
                            request.onsuccess = () => resolve();
                            request.onerror = (event) => reject("Fehler beim Wiederherstellen des Items: " + event.target.errorCode);
                        });
                    }
                    console.log(`Daten für Store "${storeName}" wiederhergestellt.`);
                } else {
                    console.warn(`Keine Daten oder ungültiges Format für Store "${storeName}" im Backup.`);
                }
            }
            renderItems(); // Anzeige nach Wiederherstellung aktualisieren
            alert("Daten erfolgreich wiederhergestellt.");
        } catch (error) {
            console.error("Fehler beim Wiederherstellen der Daten:", error);
            alert("Fehler beim Wiederherstellen der Daten: " + error.message);
        }
    };
    reader.readAsText(file);
}

function renderItems() {
    renderItemsFilter();
  }
// gefilterte Anzeige gemäß Filter 1, 2 und 3request.onupgradeneeded-Handlers
async function renderItemsFilter() {
    let storeName = "pdfStore";
    const items = await loadAndSortItems(storeName);
    const list = document.getElementById("itemList");
    list.innerHTML = "";
    anzfilesgesamt = 0;
    anzfilesgefiltert = 0;
    items.forEach(item => {
        anzfilesgesamt = anzfilesgesamt + 1;
        if (item.name.toLowerCase().includes(filter1auswahl.toLowerCase()) 
            && item.name.toLowerCase().includes(filter2auswahl.toLowerCase())
            && item.name.toLowerCase().includes(filter3auswahl.toLowerCase())
        ) {
    //console.log("renderItems() Dateiname: + ID " + item.name + " ID " + item.id);
        anzfilesgefiltert = anzfilesgefiltert + 1 ;
        const div = document.createElement("div");
        const link = document.createElement("a");
        link.href = "#";
        link.textContent = item.name;
        link.className = "dok-link";
        link.onclick = (e) => {
            e.preventDefault();
            openDataUrlInNewTab(item.data);
        };
        const replaceBtn = document.createElement("button");
            replaceBtn.textContent = "Ersetzen";
            replaceBtn.className = "dok-button";
            replaceBtn.onclick = () => triggerReplace(item.id, item.name, storeName); 
            const deleteBtn = document.createElement("button");
            deleteBtn.textContent = "Löschen";
            deleteBtn.className = "dok-button";
            deleteBtn.onclick = async () => {
            console.log("Aufruf await deleteItem(storeName, item.id)" + storeName + " , " + item.id)
                await deleteItem(storeName, item.id);
                renderItems(storeName);
            };
        //Download-Button
        const downloadBtn = document.createElement("button");
        downloadBtn.textContent = "Download";
        downloadBtn.className = "dok-button";
        downloadBtn.onclick = () => downloadDataUrlAsFile(item.data, item.name);

        div.appendChild(link);
        if (ersetzenlöschen === "ja") {
            div.appendChild(replaceBtn);
            div.appendChild(deleteBtn);
        }
        div.appendChild(downloadBtn);
        list.appendChild(div);
    }
    });
    anzdokumente = "Dokumente gesamt: " + anzfilesgesamt + " davon gefiltert: " + anzfilesgefiltert ;
    document.getElementById('anzdoks').innerHTML = anzdokumente;
}

window.addEventListener("DOMContentLoaded", async () => {
    await openDB(); // Datenbank öffnen, wenn die Seite geladen ist
    document.getElementById("restoreButton").addEventListener("change", restoreItems);
    document.getElementById("backup").addEventListener("click", backupItems);
    document.getElementById("fileInput").addEventListener("change", async (event) => {
        const files = event.target.files;
        const art = "pdfStore" ; 
        dokumente_add = "";
        anzfileshinzu = 0;
        anzdokumentehinzu = "";
        for (const file of files) {
            const reader = new FileReader();
            reader.onload = async (e) => {
                const newItem = { name: file.name, art: art, data: e.target.result };
                try {
                    const id = await insertItem(art, newItem);
                    console.log("Datei '" + file.name + "' in '" + art + "' gespeichert mit ID:", id);
                    if ( anzfileshinzu === 1) {
                        anzdokumentehinzu = anzfileshinzu + " Dokument hinzugefügt" ;
                    } else {
                    anzdokumentehinzu = anzfileshinzu + " Dokumente hinzugefügte" ;
                    }
                    document.getElementById('anzdoksadd').innerHTML = anzdokumentehinzu;
                    dokumente_add = dokumente_add + "<br>" + file.name;
                    document.getElementById('dokadd').innerHTML = dokumente_add;
                    renderItems(); // Anzeige aktualisieren                    
                } catch (error) {
                    console.error("Fehler beim Speichern von '" + file.name + "':", error);
                }
            };
            reader.readAsDataURL(file); // Liest die Datei als Data-URL (für einfache Speicherung)
            anzfileshinzu = anzfileshinzu + 1;
        }
        // Zurücksetzen des File-Inputs, um erneute Auswahl derselben Datei zu ermöglichen
        event.target.value = null;
    });
});
// Löschen eines Dokumentes
async function deleteItem(storeName, key) { // key ist die ID
    // ersetzt const db = await openDB();
    if (!db) {
        await openDB();
    }
    const tx = db.transaction(storeName, "readwrite");
    console.log ("deleteItem storeName " + storeName + " key " + key );
    try {
        tx.objectStore(storeName).delete(key); // Löscht den Satz 
        await tx.complete;
        console.log(key + `Element mit ID "<span class="math-inline">\{key\}" in Store "</span>{storeName}" gelöscht.`);
    } catch (error) {
        console.error(`Fehler beim Löschen von ID "<span class="math-inline">\{key\}" in Store "</span>{storeName}":`, error);
    } finally {
        //db.close();
    }
}

// Erstezen eines Dokumentes
function triggerReplace(id, name, storeName) {
    const namebisher = name;
    const input = document.createElement("input"); // Aufbau eines Input-Elementes
    input.type = "file";                // Anzeige des Dateiauswahl-Fenster
    input.accept = "application/pdf";  // Ees sollen nur PDF-Dateien angezeigt werden
    input.onchange = async () => {     // Aufruf der Verabreitungsfunktion nach Auswahl einer Datei
        const file = input.files[0];   // Speichert die Datei in "file"
        if (!file) {                    // Rücksprung, wenn keine Datei ausgewählt wurde
            console.warn("Keine Datei zum Ersetzen ausgewählt.");
            return;
        }
        const reader = new FileReader(); // Aufbau des Objektes zum Lesen der Datei
        reader.onload = async () => {   //Definiert eine asynchrone Funktion, die aufgerufen wird, wenn das Lesen der Datei abgeschlossen ist.
            try {                      // Fängt Fehler ab, die während des Aktualisierungsprozesses auftreten können.
                const updated = { name: file.name, art: storeName, data: reader.result }; // Erzeugt ein Objekt updated mit den neuen Daten.
                //console.log(namebisher + `Dateiinhalt wird für name ' ${file.name} und Art ${storeName} aktualisiert`);
                await insertItem(storeName, { ...updated, id: id }); //Ruft die Funktion insertItem auf, um den Datensatz in der IndexedDB zu aktualisieren.
                //console.log(`Datei für Element mit ID "${id}" und Name "${file.name}" in Store "${storeName}" ersetzt.`);
                renderItems();      //Aktualisiert die Anzeige der Elemente.
            } catch (error) {
                console.error(`Fehler beim Ersetzen der Datei für ID "${id}" in Store "${storeName}":`, error);
                alert("Fehler beim Ersetzen der Datei.");
            }
        };
        reader.onerror = () => {    //Definiert eine Funktion, die aufgerufen wird, wenn beim Lesen der Datei ein Fehler auftritt.
            console.error("Fehler beim Lesen der Datei.");
            alert("Fehler beim Lesen der Datei.");
        };
        reader.readAsDataURL(file); //Startet den Lesevorgang für die ausgewählte Datei.
    };
    input.click();      //Simuliert einen Klick auf das Input-Element, um den Dateiauswahldialog anzuzeigen.
}

// Download eines Dokumentes als Datei
function downloadDataUrlAsFile(dataUrl, filename) {
    const a = document.createElement('a');
    a.href = dataUrl;
    a.download = filename;
    document.body.appendChild(a); // Der Link muss im DOM sein, damit click() funktioniert
    a.click();
    document.body.removeChild(a); // Den Link wieder entfernen
}

function openDataUrlInNewTab(dataUrl) {
    const byteString = atob(dataUrl.split(',')[1]);
    const mimeString = dataUrl.split(',')[0].split(':')[1].split(';')[0];
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
    }
    const blob = new Blob([ab], { type: mimeString });
    const blobUrl = URL.createObjectURL(blob);
    window.open(blobUrl, '_blank');
}
// Laden und sortieren aller Dokumente aus der DB 
async function loadAndSortItems(storeName) {
    // ersetzt db = await openDB();
    if (!db) {
      await openDB();
    }
    //console.log("loadAndSortItems(storeName) " + storeName);
    let tx = db.transaction(storeName, "readonly"); //Erstellt eine Transaktion für den angegebenen storeName im "readonly"-Modus.
    let request = tx.objectStore(storeName).getAll(); 
    return new Promise((resolve, reject) => {
        request.onsuccess = () => { //Ein Event-Handler, der aufgerufen wird, wenn die getAll()-Operation erfolgreich ist.
            const items = request.result.sort((a, b) => a.name.localeCompare(b.name)); //Sortierung
            resolve(items); //Gibt die sortierten Daten an den Aufrufer der Funktion zurück.
        };
        request.onerror = () => reject(request.error); //Behandelt den Fehlerfall beim Laden der Daten.
    });
}