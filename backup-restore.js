//Backup-Restore Filterparameter in eine Datei speichern
let datum = new Date();
let backupname = "";
// Speichern in eine Datei
function backupfilterparameter() {
    let datentxt = JSON.stringify(workingCopy);
    backupname = "backup-dokumente-filterparameter"
        + "-" + datum.getFullYear() + "-" + (datum.getMonth()+1).toLocaleString ()
        + "-" + datum.getDate().toLocaleString () + ".txt";
    Download.save(datentxt, backupname); 
}
var Download = 
{
    click : function(node) {
        const ev = new MouseEvent("click",{bubbles: true,
            cancelable: true,
            view: window,
            button: 0 // Hauptmaustaste)
        });
        return node.dispatchEvent(ev);
    },
    encode : function(data) {
        return 'data:application/octet-stream;base64,' + btoa( data );
    },
    link : function(data, name){
        var a = document.createElement('a');
        a.download = name || self.location.pathname.slice(self.location.pathname.lastIndexOf('/')+1);
        a.href = data || self.location.href;
        return a;
    }
};
Download.save = function(data, name)
{
    this.click(
        this.link(
            this.encode( data ),
            name
        )
    );
};
// restore der backup Filterparameter
document.getElementById('fileinput').addEventListener('change', function() {
file = new FileReader();           
file.onload = () => {  
    let loadedjsonobjekt = "";           
    loadedjsonobjekt = file.result; 
    workingCopy = JSON.parse(loadedjsonobjekt);
    originalFilters = JSON.parse(loadedjsonobjekt);
    //neu
    filterjson = workingCopy;
    //neu Ende
    localStorage.setItem("dokumenteFilterparameter", JSON.stringify(workingCopy));
    alert('Die Änderungen wurden in den Browser übernommen!');
    let text = JSON.stringify(workingCopy);
    let satznr = JSON.stringify(workingCopy).length;
    text = "Zeichenanzahl: " + satznr + " \n " + text;
    //console.log (text)
}
file.readAsText(this.files[0], 'windows-1252'); 
location.reload();                                  
});
