let xmlDoc;                         //contiene l'OGGETTO con tutto l'xml
let selected;
let sez = false;

window.onload = function(){
    document.getElementById("pulsanteInsert").disabled = true;
};

function carica() {
    let xml = dati;
    //tolgo gli spazi
    xml = xml.replace(/>\s+</g, "><");
    //alert(xml);
    //la salvo in un modo generico "book.xml"
    localStorage.setItem("book.xml", xml);
    alert("Documento xml caricato");
}

function leggi() {
    let xml;
    xml = localStorage.getItem("book.xml");
    alert(xml);
    //dobbiamo rendere i dati da stringa a oggetto
    let parser = new DOMParser();
    xmlDoc = parser.parseFromString(xml, "text/xml");
    document.getElementById("pulsanteInsert").disabled = false;

    let root = xmlDoc.documentElement;                      //per prendere la radice "Bookstore"
    let d = document.getElementById("stampa");
    let tab = "";
    tab = "<table id='tabella'><tr><th width='180'>Categoria</th><th width='180'>Titolo</th><th width='180'>Autore</th><th width='80'>Anno</th><th width='80'>Prezzo</th></tr>";

    for(let i=0; i<root.childNodes.length;i++){
        let book = root.childNodes[i];
        let author  = book.getElementsByTagName("author");
        tab += "<tr id='tr"+i+"' onclick='seleziona(this.id);'>";
        //titolo
        tab += "<td id='tr"+i+"_categoria'>"+ book.getAttribute('category') +"</td>";               //prende l'attributo del nodo
        tab += "<td id='tr"+i+"_titolo'>"+ book.childNodes[0].textContent +"</td>";                 //prende il testo di un figlio
        tab += "<td id='tr"+i+"_autore'>";
        for(let j = 0; j<author.length; j++) {
            if(j>0)
                tab += ", ";
            tab +=  author[j].textContent;
        }
        tab += "</td>";
        tab += "<td id='tr"+i+"_anno'>"+ book.childNodes[2].textContent +"</td>";
        tab += "<td id='tr"+i+"_prezzo'>"+ book.childNodes[3].textContent +"</td>";

        tab += "</tr>";
    }
    tab += "</table>";
    d.innerHTML = tab;
}

function insert(){
document.getElementById("inserisci".style.visibility = "visible");
}

function seleziona(id) {
    let numRighe = xmlDoc.documentElement.childNodes.length;
    if(!sez) {
        let i;
        selected = id;
        for (i = 0; i < numRighe; i++)
            document.getElementById("tr" + i).style.backgroundColor = "white";
        document.getElementById(id).style.backgroundColor = "yellow";
        ///caricare i campi
        document.getElementById("titolo").value = document.getElementById(id + "_titolo").innerHTML;
        document.getElementById("categoria").value = document.getElementById(id + "_categoria").innerHTML;
        document.getElementById("autore").value = document.getElementById(id + "_autore").innerHTML;
        document.getElementById("anno").value = document.getElementById(id + "_anno").innerHTML;
        document.getElementById("prezzo").value = document.getElementById(id + "_prezzo").innerHTML;
        sez = true;
    }
    else {
        for (i = 0; i < numRighe; i++)
            document.getElementById("tr" + i).style.backgroundColor = "white";
        document.getElementById("titolo").value = document.getElementById(id + "_titolo").innerHTML;
        document.getElementById("categoria").value = document.getElementById(id + "_categoria").innerHTML;
        document.getElementById("autore").value = document.getElementById(id + "_autore").innerHTML;
        document.getElementById("anno").value = document.getElementById(id + "_anno").innerHTML;
        document.getElementById("prezzo").value = document.getElementById(id + "_prezzo").innerHTML;
        sez = false;
    }
}