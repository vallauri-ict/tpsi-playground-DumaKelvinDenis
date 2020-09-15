let xmlDoc; //contiente l'oggetto con tutto l'xml
let selected;
window.onload = function () {
    document.getElementById("pulsanteInserct").disabled = true;
};
function carica() {
    let xml = dati;
    alert(xml);
    xml = xml.replace(/>\s+</g, '><'); //IMPORTANTE per rimuovere gli spazzi degli xml
    alert(xml);
    localStorage.setItem("book.xml",xml); //IMPORTANTE per settare il local sostorage del book.xml
    alert("Documento XML caricato!");
}
function leggi() {
    selected=-1;
    let xml;
    xml = localStorage.getItem("book.xml"); //IMPORTANTE porto il file ad un let di javascript
    alert(xml);
    let parser = new DOMParser();
    xmlDoc = parser.parseFromString(xml, "text/xml");
    let root = xmlDoc.documentElement;
    let d = document.getElementById("stampa"); //Lo porto al div in cui verrà inserita lòa tabella
    let tab;
    tab = "<table id = 'tabella'><tr><th width='180'>Titolo</th><th width='100'>Categoria</th><th>Autore</th><th width = '80'>Anno</th><th width='80'>Prezzo</th></tr>";
    for (let i = 0; i<root.childNodes.length; i++) //IMPORTANTE setto in tabella tutti i dati in una tabella
    {
        let book = root.childNodes[i];
        tab += "<tr id = 'tr"+i+"' onclick = 'seleziona(this.id);'>";
        //titolo
        tab += "<td id = 'tr"+i+"_titolo'>"+book.childNodes[0].textContent+"</td>";
        tab += "<td id = 'tr"+i+"_categoria'>"+book.getAttribute('category')+"</td>";

        //parte interessante
        let k=1;
	    tab += "<td id = 'tr"+i+"_autore'>"
	    do{
	    	if(k!=1)
	    		tab+=", ";
            tab += book.childNodes[k].textContent;
	    	k++;
	    }while(book.childNodes[k].nodeName=="author");
        tab+="</td>";
        
        //fine parte interessante
        tab += "<td id = 'tr"+i+"_anno'>"+book.childNodes[k].textContent+"</td>";
	    k++;
        tab += "<td id = 'tr"+i+"_prezzo'>"+book.childNodes[k].textContent+"</td>";
        tab += "</tr>"; //chiudo ogni riga
    }
    tab += "</table>"; //chiudo la tabella
    d.innerHTML = tab; //IMPPORTANTE inserisco tab nel FIle HTML
    document.getElementById("pulsanteInserct").disabled = false;
}
function insert(){
    document.getElementById("inserisci").style.visibility="visible";
}
function seleziona(id){
    let i;
    if(document.getElementById(id).style.backgroundColor == "white"){//oppure (selected!=id) e si porta id=-1 nell'else
        selected = id;
        let numRighe = xmlDoc.documentElement.childNodes.length;
        for (i = 0; i < numRighe; i++)
            document.getElementById("tr" + i).style.backgroundColor = "white";
        document.getElementById(id).style.backgroundColor = "yellow";
        //caricare i campi
        document.getElementById("titolo").value = document.getElementById(id + "_titolo").innerHTML;
        document.getElementById("categoria").value = document.getElementById(id + "_categoria").innerHTML;
        document.getElementById("autore").value = document.getElementById(id + "_autore").innerHTML;
        document.getElementById("anno").value = document.getElementById(id + "_anno").innerHTML;
        document.getElementById("prezzo").value = document.getElementById(id + "_prezzo").innerHTML;
    }
    else{

        document.getElementById(id).style.backgroundColor = "white";
        selected=-1;
        cancellaCampi();
    }
}
function cancellaCampi()
{
    document.getElementById("titolo").value ="";
    document.getElementById("categoria").value = "";
    document.getElementById("autore").value ="";
    document.getElementById("anno").value="";
    document.getElementById("prezzo").value ="";
}

function eseguiModifica()
{
    if(selected==-1) //oppure a undefined...
    {
        alert("selezionare una riga");
    }
    else
    {
        let indice=selected.substring(2);
        let root= xmlDoc.documentElement;

        let book=root.childNodes[indice];
        book.setAttribute("category",document.getElementById("categoria"));
        book.childNodes[0].textContent=document.getElementById("titolo");
        let k=1;
        let autori=document.getElementById("autore").value.split(", ");
        /*TODO:
         attualmente abbiamo un certo numero di autori
         non sappiamo quindi se l'utonto abbia modificato o rimosso degli autori.





          */

        /*TODO: Sovrascrivere anno e prezzo*/


        salva();
        leggi();
        alert("modificato");
        cancellaCampi();
    }
}

function eseguiInserimento()
{
    let root = xmlDoc.documentElement;
    let val;
    let libro = xmlDoc.createElement("book");
    libro.setAttribute("category", document.getElementById("categoria").value);

    let titolo = xmlDoc.createElement("title");
    val= xmlDoc.createTextNode(document.getElementById("titolo").value)
    titolo.appendChild(val);
    libro.appendChild(titolo);

    let tuttigliAutori=document.getElementById("autore").value;
    let autori=tuttigliAutori.split(',');
    for(let obj of autori)
    {
        let autore =xmlDoc.createElement("author");
        val =xmlDoc.createTextNode(obj);
        autore.appendChild(val);
        libro.appendChild(autore);
    }

    let anno = xmlDoc.createElement("years");
    val= xmlDoc.createTextNode(document.getElementById("anno").value)
    anno.appendChild(val);
    libro.appendChild(anno);

    let prezzo = xmlDoc.createElement("price");
    val= xmlDoc.createTextNode(document.getElementById("prezzo").value)
    prezzo.appendChild(val);
    libro.appendChild(prezzo);

    root.appendChild(libro);


    salva();
    leggi();
    cancellaCampi();
}

function eseguiRimozione()
{
    //selected-->id della riga
    if(selected==-1) //oppure a undefined...
    {
        alert("selezionare una riga");
    }
    else
    {
        let indice=selected.substring(2);
        let root= xmlDoc.documentElement;
        //removeChild vuole l'oggetto da cancellare
        root.removeChild(root.childNodes[indice]);

        salva();
        leggi();
        alert("rimosso");
        cancellaCampi();
    }
}

function salva(){
    let serializer=new XMLSerializer();
    let xml = serializer.serializeToString(xmlDoc);

    localStorage.setItem("book.xml",xml);
}