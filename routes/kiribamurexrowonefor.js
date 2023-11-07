var express = require('express');
var router = express.Router();
var Tabbellone = require('../models/tabbellone.js');
var tag = require('../models/tag.js');
//npm i --save lodash
var _ = require('lodash');
var datajson = require('../src/datarowjson.json');


function tempoEsatto(){
var data = new Date();
var day, Month, Hours, Minutes,aaaa,all;
day = data.getDate() + "/";
Month = data.getMonth() + 1 + "/";
Hours = data.getHours() + ":";
Minutes = data.getMinutes() + " ";
aaaa = data.getFullYear();
all =  Hours+ Minutes+ day  + Month + aaaa;
return all;
}

//http://localhost:3000/kiribarow/
router.post('/',async function(req, res, next) {

//datajson.FROM_SYSTEM = "MURX";
datajson.ACQUIRED_ON = tempoEsatto();
const newInsert = await Tabbellone.query().insert(datajson);

const arrayFiles = await Tabbellone.query().select(`COMMON_REFERENCE`,'raw_json','FROM_SYSTEM','ACQUIRED_ON')
.where('COMMON_REFERENCE', datajson.COMMON_REFERENCE).orderBy('ACQUIRED_ON');

var fromSistem;
// se la lunghezza dell'array è due allora posso iniziare il confronto tra i file
if(arrayFiles.length==2)
{
  
  // prendo il from system della prima che arriva per fare il confronto con una stringa murex
  var  fromSistem  = arrayFiles[0]["FROM_SYSTEM"];

  if(arrayFiles[0]["FROM_SYSTEM"]===arrayFiles[1]["FROM_SYSTEM"]){
    console.log("è arrivato lo stesso file")
  }
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
  var procced2 = tempoEsatto();
  const updateProcessedOn = await Tabbellone.query()
  .patch({ PROCESSED_ON: procced2})
  .where('COMMON_REFERENCE', datajson.COMMON_REFERENCE);

  const updateMatchedOn = await Tabbellone.query()
  .patch({ MATCHED_ON: procced2})
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
  var procced = tempoEsatto();
  const updateProcessedOn = await Tabbellone.query()
  .patch({ PROCESSED_ON: procced})
  .where('COMMON_REFERENCE', datajson.COMMON_REFERENCE);

  // metto in tabella nella colonna elab lo stato 2
  const updateELAB = await Tabbellone.query()
  .patch({ ELAB: 2})
  .where('COMMON_REFERENCE', datajson.COMMON_REFERENCE);

  //Query su tabella tag che mi da le due colonne di tag e description
  //const arrayTagDescription = await tag.query().select(`tag`,'description');
 
  
  //preparo il json di output da passare al frontend con le sue tre proprietà
  var output = {};
  output ["common_reference"] = arrayFiles[0].COMMON_REFERENCE;
  output ["PROCESSED_ON"] = procced;
  output ["tableProperties"] = [];
  // prendo le chiavi dei due oggetti json e ne tiro fuori due array
  var keys0 = Object.keys(obj0);
  var keys1 = Object.keys(obj1);
  // concateno i due array di chiavi e li filtro per togliere i doppioni
  var dubleKeys = keys0.concat(keys1);
  var arrayKeys = dubleKeys.filter((item, pos) => dubleKeys.indexOf(item) === pos);
  // inizializzo le variabili per il json finale
  var Murex_value;
  var Bank_value;
  var exception;
// ciclo sulla lunghezza dell'array delle chiavi 
     for (let i = 0; i < arrayKeys.length; i++) {
      // array in cui inserisco votla per volta le proprietà 
      var tableProperties = {};   
      // 
      if(fromSistem==="MUREX")
      {
          Murex_value = obj0[arrayKeys[i]];
          Bank_value = obj1[arrayKeys[i]];
      }
      else
      {
          Murex_value = obj1[arrayKeys[i]];
          Bank_value = obj0[arrayKeys[i]];
      }
      // ciclo su la lunghezza dell'array dei tag presi dalla select
      const arrayTagDescription = await tag.query().select(`tag`,'description').where('tag',arrayKeys[i]);
        // controllo se la chiave nell'array ha il suo corrispsettivo nella tabella tag      
      console.log("primo select");
      console.log(arrayTagDescription); 
      console.log(arrayTagDescription.length);
      console.log("array chiavi ");
      console.log(arrayKeys.length);

      tableProperties ["tag"] = arrayTagDescription.tag;
      tableProperties ["description"] = arrayTagDescription.description;

      if (arrayTagDescription === null){
       tableProperties ["tag"] = arrayKeys[i];
       tableProperties ["description"] = "nessuna";
      }

      
      
      
      // confronto se i valori delle due chiavi siano uguali e assegno i valori exception
      if(obj0[arrayKeys[i]] === obj1[arrayKeys[i]])
      {
          exception = 1;s
      }
      else
      {
          exception = 0;
      }
      tableProperties ["value_from_murex"] = Murex_value;
      tableProperties ["value_from_Bank"]= Bank_value;
      tableProperties ["exception"]= exception;
      
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