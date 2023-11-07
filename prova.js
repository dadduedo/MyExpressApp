// Devi scrivere una funzione che prenda in input 
// una stringa e restituisca un oggetto contenente la frequenza di ogni carattere presente nella stringa. Devi scrivere il codice utilizzando Node.js.

const { functions } = require("lodash");

//  

// Requisiti della funzione:

//  

// La funzione deve essere chiamata countChars.
// La funzione deve accettare un singolo parametro str che rappresenta la stringa di input.
// La funzione deve restituire un oggetto che contenga la frequenza di ogni carattere presente nella stringa di input.
// Il carattere deve essere la chiave dell'oggetto e il valore deve essere il numero di volte che appare nella stringa.
// La funzione deve essere case sensitive, ovvero deve considerare caratteri maiuscoli e minuscoli come distinti.
// Se la stringa di input è vuota, la funzione deve restituire un oggetto vuoto.
// Codice iniziale:

//  

// Qui di seguito troverai il codice iniziale che hai ricevuto:

//  
// function countChars(str) {
//     var jsonToSend = {}
//     //  scorro la stringa casa 
//     //  metto carattere per carattere la stringa nelle chiavi di un array 
//     //  metto carattere per carattere la stringa nelle chiavi di un json
//     //  per ogni chiave uguale aumento il valore di una variabile count di 1  
//     //  quando finisce la stringa metto la variabile count come proprità della chiave che sta ciclando
//     console.log(typeof(str))
//     for (let i=0;i<str.length;i++){
//         var count = 0 
//         for (let j=0;j<str.length;j++){
//             if (str[i] == str[j]){
//                 count ++
//             }
//         }
//         jsonToSend[str[i]] = count
//     }
//     console.log(jsonToSend)
// }

function countChars(str) {


    let jsonToSend = {};
    for (let i = 0; i < str.length; i++) {
     let char = str[i]; 
    if (jsonToSend[char] === null || jsonToSend[char] === undefined) {
    
            jsonToSend[char] = 0;
    
    }

     jsonToSend[char] = jsonToSend[char] + 1;

     }
     console.log(jsonToSend);
    }

    
    countChars("casa");

function callback (){
        console.log("gigi")
}

setTimeout(function () { 
        console.log('Callback as Standard Function'); 
}, 1000);

const fs = require("fs")

// fs.writeFile('out.txt',"cazzo bello",(err)=>{
//         console.log("ho scritto sul file cazzo bello")
// })

let loggedApi = function (logMessage,callback){
        fs.writeFile("out.txt",logMessage,callback)
}
loggedApi("chiamo la funzione e ho aggiunto questo pezzo",()=>(
        updateLogMatrics()
        
))

function updateLogMatrics (){
        console.log("aggiungi sto cazzo")
}
