var express = require('express');
var router = express.Router();
var Tabbellone = require('../models/tabbellone.js');
var tag = require('../models/tag.js');
//npm i --save lodash
var _ = require('lodash');
const passport = require('passport');
const BearerStrategy = require('passport-http-bearer').Strategy;
const SECRET = 'mysecret';
const ADMIN = 'admin';
var datajson = require('../src/data.json');


passport.use(new BearerStrategy((token, done) => {
  try {
    const { username } = jwt.decode(token, SECRET);
    if (username === ADMIN) {
      done(null, username);
      return;
    }
    done(null, false);
  } catch (error) {
    done(null, false);
  }
}));

//http://localhost:3000/kiriba/molte
router.get('/molte',async function(req, res, next) {
const compito = await Tabbellone.query();
console.log(compito);
console.log(compito instanceof Tabbellone);
res.send("get tutte")
});

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

//http://localhost:3000/kiriba/
router.post('/',async function(req, res, next) {

datajson.FROM_SYSTEM = "MUREX";
datajson.ACQUIRED_ON = tempoEsatto();
const newInsert = await Tabbellone.query().insert(datajson);
const coppie = await Tabbellone.query().select(`COMMON_REFERENCE`,'22c','22n','32b','33b','30t','30v','36','82a','87a','34e','30p','22b','17r','14d','FROM_SYSTEM','ACQUIRED_ON')
.where('COMMON_REFERENCE', datajson.COMMON_REFERENCE).orderBy('ACQUIRED_ON');

var firstFromSistem;
if(coppie.length==2){
  
  // prendo il from system della prima che arriva per fare il confronto con una stringa murex
  var  firstFromSistem  = coppie[0]["FROM_SYSTEM"];

  // divido i due file in due variabili d'appogggio
  var  newFile  = coppie[0];
  var  oldFile  = coppie[1];

  // tolgo dalle copie di appoggio la proprietà FROM_SYSTEM
  delete newFile['FROM_SYSTEM'];
  delete oldFile['FROM_SYSTEM'];

// controllo se i campi delle due copie sono uguali o no 
if(_.isEqual(newFile, oldFile)){
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
else {
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
  const campiDiversi = await tag.query().select(`tag`,'description');
  
  //preparo il json di output da passare al frontend con le sue tre proprietà
  var output = {};
  output ["common_reference"] = coppie[0].COMMON_REFERENCE;
  output ["PROCESSED_ON"] = procced;
  output ["tableProperties"] = []

  // ciclo sulla lunghezza dellei campi tag della tabella
  for (var index=0; index<campiDiversi.length; index++ ) {
    // verifico se i campi tag sono uguali o diversi e setto la variabile exception di conseguenza
    if(coppie[0][campiDiversi[index].tag] === coppie[1][campiDiversi[index].tag])
    {  
      var exception = 1;
    }
    if(coppie[0][campiDiversi[index].tag] !== coppie[1][campiDiversi[index].tag])
    {  
      var exception = 0;  
    }
    // verifico da quale sistema è arrivato il file confrontando la colonna from sistem con la stringa MUREX
    if(firstFromSistem==="MUREX")
    {
      Murex_value = coppie[0][campiDiversi[index].tag]
      Bank_value = coppie[1][campiDiversi[index].tag]
    }
    else
    {
      Murex_value = coppie[1][campiDiversi[index].tag]
      Bank_value = coppie[0][campiDiversi[index].tag]
    }
  //creo un json e gli inserisco le proprietà define nel ciclo for
  var jsonOut = {}; 
  jsonOut ["tag"] = campiDiversi[index].tag;
  jsonOut ["description"] = campiDiversi[index].description;
  jsonOut ["value_from_murex"] = Murex_value;
  jsonOut ["value_from_Bank"]= Bank_value;
  jsonOut ["exception"]= exception;
  // inserisco il jsonOut nella propieta del primo json che era un array vuoto
  output  ['tableProperties'].push(jsonOut);
  } // fine for
  
  // invio ll json al front end
  
}

console.log(output);
   
}
//NON E' ARRIVATO IL SECONDO FILE PRENDO IL TEMPO, METTO ELAB E ASPETTO
else{
  const updateELAB = await Tabbellone.query()
  .patch({ ELAB: 0})
  .where('COMMON_REFERENCE', datajson.COMMON_REFERENCE);

}
res.send('got it');

});

module.exports = router;


