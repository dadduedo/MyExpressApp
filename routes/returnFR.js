var express = require('express');
var router = express.Router();
var Tabbellone = require('../models/tabbellone.js');

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

//http://localhost:3000/returnFR/
router.post('/',async function(req, res, next) {

var mybody = req.body;
var RequestId = mybody.RequestId;
var common_reference = mybody.common_reference;
var approved = mybody.approved;
var user = mybody.user;

var match = await Tabbellone.query().select('MATCHED_ON','MATCHED_BY').where('COMMON_REFERENCE', common_reference);

if(match[0]["MATCHED_ON"] === null && match[1]["MATCHED_ON"]=== null && match[0]["MATCHED_BY"] === null && match[1]["MATCHED_BY"]=== null){

  if (approved == 0)
  {
  const ELABtre = await Tabbellone.query()
  .patch({ ELAB: 3})
  .where('COMMON_REFERENCE', common_reference);
  }
  else
  {
  const ELABquattro = await Tabbellone.query()
  .patch({ ELAB: 4})
  .where('COMMON_REFERENCE', common_reference);
  }

  const MatchedOn = await Tabbellone.query()
  .patch({ MATCHED_ON: tempoEsatto()})
  .where('COMMON_REFERENCE', common_reference);

  const MATCHED_BY = await Tabbellone.query()
  .patch({ MATCHED_BY:user})
  .where('COMMON_REFERENCE', common_reference);
}
else
{
  console.log("uno dei due è già scritto");
}

res.send('siamo tornati a casa');

});

module.exports = router;
// il body che mi passa per la route

// {
// "RequestId": "p40",
// "common_reference": "p40",
// "processed_on": "9",
// "group": "9",
// "tableProperties": [
//                     {
//                         "tag": "3",
//                         "Description": "asd",
//                         "value_from_murex": "ciccio",
//                         "value_from_bank": "pasticcio",
//                         "exception": 0
//                     }],
// "task": {
// 	"title": "DEUTFF2266ENELR2",
// 	"Priority": "MEDIUM"
	
// },
// "approved": "1",
// "user":"franchitto"
// }