var express = require('express');
var router = express.Router();
var Tabbellone = require('../models/tabbellone.js');
var tag = require('../models/tag.js');
//npm i --save lodash
var _ = require('lodash');
var datajson = require('../src/datarowjson.json');
var control = require('../controlli/funzioni.js');


//http://localhost:3000/kiribarow/
router.post('/',async function(req, res, next) {

//assegno il tompo in cui viene preso il file
datajson.ACQUIRED_ON = control.tempo();
console.log(datajson);
// inserisco in tabella il nuovo file
const newInsert = await Tabbellone.query().insert(datajson);
// query select per prendere solo i campi dove il common reference è uguale
const arrayFiles = await Tabbellone.query().select(`COMMON_REFERENCE`,'raw_json','FROM_SYSTEM','ACQUIRED_ON')
.where('COMMON_REFERENCE', datajson.COMMON_REFERENCE).orderBy('ACQUIRED_ON');

var fromSistem;
// se la lunghezza dell'array è due allora posso iniziare il confronto tra i file
if(arrayFiles.length==2)
{
  
  // prendo il valore from system della prima che arriva e lo metto nella variabile fromSistem
  var  fromSistem  = arrayFiles[0]["FROM_SYSTEM"];

  // prendo le colonne raw_json dai due file in due variabili
  var jsonstring0 = arrayFiles[0]["raw_json"];
  var jsonstring1 = arrayFiles[1]["raw_json"];
  // trasformo le due stringe in due oggetti json facendone il parse
  var obj0 = JSON.parse(jsonstring0);
  var obj1 = JSON.parse(jsonstring1);

  // controllo se i campi delle due copie sono uguali o no 
  if(_.isEqual(obj0, obj1))
  {
    
  //I CAMPI SONO UGUALI MANDO AL SISTEMA HCI
  
  const updateProcessedOn = await Tabbellone.query()
  .patch({ PROCESSED_ON: control.tempo()})
  .where('COMMON_REFERENCE', datajson.COMMON_REFERENCE);

  const updateMatchedOn = await Tabbellone.query()
  .patch({ MATCHED_ON: control.tempo()})
  .where('COMMON_REFERENCE', datajson.COMMON_REFERENCE);

  const updateMATCHEDBY = await Tabbellone.query()
  .patch({ MATCHED_BY:"SYSTEM"})
  .where('COMMON_REFERENCE', datajson.COMMON_REFERENCE);

  const updateELAB = await Tabbellone.query()
  .patch({ ELAB: 1})
  .where('COMMON_REFERENCE', datajson.COMMON_REFERENCE);
  }
 else 
  {
  //I CAMPI SONO DIVERSI MANDO AL FRONT END PER IL CONTROLLO UMANO
  
  // prendo il tempo e lo setto in tabella 
  const updateProcessedOn = await Tabbellone.query()
  .patch({ PROCESSED_ON: control.tempo()})
  .where('COMMON_REFERENCE', datajson.COMMON_REFERENCE);

  // metto in tabella nella colonna elab lo stato 2
  const updateELAB = await Tabbellone.query()
  .patch({ ELAB: 2})
  .where('COMMON_REFERENCE', datajson.COMMON_REFERENCE);

  //Query su tabella tag che mi da le due colonne di tag e description
  const arrayTagDescription = await tag.query().select(`tag`,'description');

  //preparo il json di output da passare al frontend con le sue tre proprietà
  var output = {};
  output ["common_reference"] = arrayFiles[0].COMMON_REFERENCE;
  output ["PROCESSED_ON"] = control.tempo();
  output ["tableProperties"] = [];
  // prendo le chiavi dei due oggetti json e ne tiro fuori due array
  var keys0 = Object.keys(obj0);
  var keys1 = Object.keys(obj1);
  // concateno i due array di chiavi e li filtro per togliere i doppioni
  var dubleKeys = keys0.concat(keys1);
  var arrayKeys = dubleKeys.filter((item, pos) => dubleKeys.indexOf(item) === pos);
  // inizializzo le variabili per il json finale

// ciclo sulla lunghezza dell'array delle chiavi 
     for (let i = 0; i < arrayKeys.length; i++) {
      // array in cui inserisco votla per volta le proprietà 
      var tableProperties = {};   
      var tagdescr = control.tagDescription (arrayKeys[i],arrayTagDescription,tableProperties);
      var sistemException = control.sistemException (obj0[arrayKeys[i]],obj1[arrayKeys[i]],fromSistem);
      tableProperties ["value_from_Bank"]= sistemException[2];
      tableProperties ["value_from_murex"] = sistemException[1];
      tableProperties ["exception"]= sistemException[0];
      
      // inserisco il jsonOut nella propieta del primo json che era un array vuoto
      output ['tableProperties'].push(tableProperties);
    } 
  // invio ll json al front end
  }
  console.log(output);   
}
//NON E' ARRIVATO IL SECONDO FILE PRENDO IL TEMPO, METTO ELAB E ASPETTO
else
{
  const updateELAB = await Tabbellone.query()
  .patch({ ELAB: 0})
  .where('COMMON_REFERENCE', datajson.COMMON_REFERENCE);
}
res.send('got it');
});

module.exports = router;

/*{
  "raw_json": "{\"22c\": \"8dssa\",\"22n\": \"8sda\",\"3s2b\": \"neswndewfnewnew\",\"35b\": \"newnonmurexnewnew\",\"30t\": \"newnewnew\",\"30v\": \"newnewnew\",\"36\": \"old\",\"87a\": \"old\",\"34e\": \"primccannmurex3\",\"30p\": \"prima\",\"22b\": \"prima\",\"17r\": \"prima\",\"14d\": \"prima\"}",
 "raw_json": "{\"1\": \"a\",\"2\": \"b\",\"3\": \"murex\"}",
  "raw_json": "{\"5\": \"a\",\"2\": \"seconda\",\"4\": \"seconda\"}",
}*/
  // var Murex_value;
  // var Bank_value;
  // var exception;

      //vado se il from sistem è murex o no 
      // if(fromSistem==="MUREX")
      // {
      //     Murex_value = obj0[arrayKeys[i]];
      //     Bank_value = obj1[arrayKeys[i]];
      // }
      // else
      // {
      //     Murex_value = obj1[arrayKeys[i]];
      //     Bank_value = obj0[arrayKeys[i]];
      // }
      // ciclo su la lunghezza dell'array dei tag presi dalla select

      // for(let j = 0; j < arrayTagDescription.length; j++){
      //   // controllo se la chiave nell'array ha il suo corrispsettivo nella tabella tag
      //   if(arrayTagDescription[j].tag === arrayKeys[i]) 
      //   {
      //     tableProperties ["tag"] = arrayTagDescription[j].tag;
      //     tableProperties ["description"] = arrayTagDescription[j].description;
      //     break; 
      //   }
      //   else
      //   {
      //     tableProperties ["tag"] = arrayKeys[i];
      //     tableProperties ["description"] = "nessuna";
      //   }
      
      // }

      // confronto se i valori delle due chiavi siano uguali e assegno i valori exception
      // if(obj0[arrayKeys[i]] === obj1[arrayKeys[i]])
      // {
      //     exception = 1;
      // }
      // else
      // {
      //     exception = 0;
      // }