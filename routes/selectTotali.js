var express = require('express');
var router = express.Router();
var Tabbellone = require('../models/tabbellone.js');
var datajson = require('../src/dataSelectCount.json');
var firstRowLimit = 60;
var secondRowLimit = 50;

//http://localhost:3000/seletTotali/
router.get('/',async function(req, res, next) {

var countTotal = {};

// query select per prendere solo i campi dove il common reference è uguale
const fileWaiting = await Tabbellone.query().select('COMMON_REFERENCE','ELAB','FROM_SYSTEM','ACQUIRED_ON','PROCESSED_ON','MATCHED_ON','MATCHED_BY')
.where('ELAB' ,0)
.orderBy('ACQUIRED_ON').limit(firstRowLimit);

const matchingWaiting = await Tabbellone.query().select('COMMON_REFERENCE','ELAB','FROM_SYSTEM','ACQUIRED_ON','PROCESSED_ON','MATCHED_ON','MATCHED_BY')
.where('ELAB' ,1)
.orderBy('ACQUIRED_ON').limit(firstRowLimit);

const systemMatched = await Tabbellone.query().select('COMMON_REFERENCE','ELAB','FROM_SYSTEM','ACQUIRED_ON','PROCESSED_ON','MATCHED_ON','MATCHED_BY')
.where('ELAB' ,2)
.orderBy('ACQUIRED_ON').limit(firstRowLimit);

const userMatched = await Tabbellone.query().select('COMMON_REFERENCE','ELAB','FROM_SYSTEM','ACQUIRED_ON','PROCESSED_ON','MATCHED_ON','MATCHED_BY')
.where('ELAB' ,3)
.orderBy('ACQUIRED_ON').limit(firstRowLimit);

const userRejected = await Tabbellone.query().select('COMMON_REFERENCE','ELAB','FROM_SYSTEM','ACQUIRED_ON','PROCESSED_ON','MATCHED_ON','MATCHED_BY')
.where('ELAB' ,4)
.orderBy('ACQUIRED_ON').limit(firstRowLimit);

const allFile = await Tabbellone.query().select('COMMON_REFERENCE','ELAB','FROM_SYSTEM','ACQUIRED_ON','PROCESSED_ON','MATCHED_ON','MATCHED_BY')
.orderBy('ACQUIRED_ON').limit(firstRowLimit);

const allcount = await Tabbellone.query().select([
    Tabbellone.query()
    .where('ELAB', 0).count().as('ELAB0'),
    Tabbellone.query()
    .where('ELAB', 1).count().as('ELAB1'),
    Tabbellone.query()
    .where('ELAB', 2).count().as('ELAB2'),
    Tabbellone.query()
    .where('ELAB', 3).count().as('ELAB3'),
    Tabbellone.query()
    .where('ELAB', 4).count().as('ELAB4'),
    Tabbellone.query()
    .count().as('Allcount')]);

countTotal["fileWaiting"] = fileWaiting;
countTotal["matchingWaiting"] = matchingWaiting;
countTotal["systemMatched"] = systemMatched;
countTotal["userMatched"] =userMatched;
countTotal["userRejected"] = userRejected;
countTotal["all"] = allFile;


countTotal['fileWaitingCount'] = allcount[0].ELAB0;
countTotal['matchingWaitingCount'] =  allcount[0].ELAB1;
countTotal['systemMatchedCount'] = allcount[0].ELAB2;
countTotal['userMatchedCount'] = allcount[0].ELAB3;
countTotal['userRejectedCount'] = allcount[0].ELAB4;
countTotal['allCount'] = allcount[0].Allcount;

// mando il json countTotal al front end

console.log(countTotal);
res.send('got it');

});


//http://localhost:3000/seletTotali/scorro
router.get('/scorro',async function(req, res, next) {

var countTotalRun = {};

var common_referenceBody = req.body.COMMON_REFERENCE;
var fromsystem = req.body.FROM_SYSTEM;
var elab = req.body.ELAB;
var param = 1;

// var fileWaitingSecond;
// var matchingWaitingSecond;
// var systemMatchedSecond;
// var userMatchedSecond;
// var userRejectedSecond ;
// var allFilesecond;

var element = await Tabbellone.query().select('autoincremento').where('COMMON_REFERENCE',common_referenceBody).where('FROM_SYSTEM',fromsystem).where('ELAB',elab);

if (param == 0){
    const fileWaitingSecond = await Tabbellone.query().select('COMMON_REFERENCE','ELAB','FROM_SYSTEM','ACQUIRED_ON','PROCESSED_ON','MATCHED_ON','MATCHED_BY')
    .where ('autoincremento', '<',element[0]["autoincremento"])
    .where('ELAB' ,0)
    .limit(secondRowLimit)
    .orderBy ('autoincremento', 'desc');
    countTotalRun["fileWaiting"] = fileWaitingSecond;
}
if (param == 1){
    const matchingWaitingSecond = await Tabbellone.query().select('COMMON_REFERENCE','ELAB','FROM_SYSTEM','ACQUIRED_ON','PROCESSED_ON','MATCHED_ON','MATCHED_BY')
    .where ('autoincremento', '<',element[0]["autoincremento"])
    .where('ELAB' ,1)
    .limit(secondRowLimit)
    .orderBy ('autoincremento', 'desc');
    countTotalRun["matchingWaiting"] = matchingWaitingSecond;
}
if (param == 2){
    const systemMatchedSecond = await Tabbellone.query().select('COMMON_REFERENCE','ELAB','FROM_SYSTEM','ACQUIRED_ON','PROCESSED_ON','MATCHED_ON','MATCHED_BY')
    .where ('autoincremento', '<',element[0]["autoincremento"])
    .where('ELAB' ,2)
    .limit(secondRowLimit)
    .orderBy ('autoincremento', 'desc');
    countTotalRun["systemMatched"] = systemMatchedSecond;
}
if (param == 3){
    const userMatchedSecond = await Tabbellone.query().select('COMMON_REFERENCE','ELAB','FROM_SYSTEM','ACQUIRED_ON','PROCESSED_ON','MATCHED_ON','MATCHED_BY')
    .where ('autoincremento', '<',element[0]["autoincremento"])
    .where('ELAB' ,3)
    .limit(secondRowLimit)
    .orderBy ('autoincremento', 'desc');
    countTotalRun["userMatched"] = userMatchedSecond;
}
if (param == 4){
    const userRejectedSecond = await Tabbellone.query().select('COMMON_REFERENCE','ELAB','FROM_SYSTEM','ACQUIRED_ON','PROCESSED_ON','MATCHED_ON','MATCHED_BY')
    .where ('autoincremento', '<', element[0]["autoincremento"])
    .where('ELAB' ,4)
    .limit(secondRowLimit)
    .orderBy ('autoincremento', 'desc');
    countTotalRun["userRejected"] = userRejectedSecond;
}
if (param == 5){
    const allFilesecond = await Tabbellone.query().select('COMMON_REFERENCE','ELAB','FROM_SYSTEM','ACQUIRED_ON','PROCESSED_ON','MATCHED_ON','MATCHED_BY')
    .where ('autoincremento', '<',element[0]["autoincremento"])
    .limit(secondRowLimit)
    .orderBy ('autoincremento', 'desc');
    countTotalRun["all"] = allFilesecond;
}

// countTotalRun["fileWaiting"] = fileWaitingSecond;
// countTotalRun["matchingWaiting"] = matchingWaitingSecond;
// countTotalRun["systemMatched"] = systemMatchedSecond;
// countTotalRun["userMatched"] =userMatchedSecond;
// countTotalRun["userRejected"] = userRejectedSecond;
// countTotalRun["all"] = allFilesecond;

// mando il json countTotalRun al front end
console.log(countTotalRun);

res.send('got it');
});
module.exports = router;

// come dovrebbe essere la qwery
// WITH NumberedMyTable AS
// (
//     SELECT
//         COMMON_REFERENCE,
//         ACQUIRED_ON,
//         ROW_NUMBER() OVER (ORDER BY ACQUIRED_ON) AS RowNumber 
//     FROM
//         mydb.tabbellone
// )
// SELECT
//         COMMON_REFERENCE,
//         ACQUIRED_ON
// FROM
//     NumberedMyTable
// WHERE
//     RowNumber BETWEEN 60 AND 110;

// var countTotal = {};
// var fileWaitingCount = 0;
// var systemMatchedCount = 0;
// var matchingWaitingCount = 0;
// var userMatchedCount = 0;
// var userRejectedCount = 0;

// countTotal["all"] = [];
// countTotal["userMatched"] = [];
// countTotal["systemMatched"] = [];
// countTotal["userRejected"] = [];
// countTotal["fileWaiting"] = [];
// countTotal["matchingWaiting"] =[];

// countTotal["all"]=arrayFiles;


// for (let i = 0; i < arrayFiles.length; i++) {
  
//   if(arrayFiles[i]["ELAB"] == 0 ){
//    // non è arrivato il secondo file quindi non ancora elaborato    
//    fileWaitingCount = fileWaitingCount + 1 ; 
//    countTotal["fileWaiting"].push(arrayFiles[i]);
//   }
//   if(arrayFiles[i]["ELAB"] == 1 && matchingWaitingCount<60){
//     // ha il doppio ma non elaborati da nessuno
//     matchingWaitingCount = matchingWaitingCount + 1; 
//     countTotal["matchingWaiting"].push(arrayFiles[i]); 
//   }
//   if(arrayFiles[i]["ELAB"] == 2 && systemMatchedCount<60){
//     // elaborati dal sistema
//     systemMatchedCount = systemMatchedCount +1;
//     countTotal["systemMatched"].push(arrayFiles[i]);
//   }
//   if(arrayFiles[i]["ELAB"] == 3 && userMatchedCount<60){
//     // elaborati da utente e approvato
//     userMatchedCount = userMatchedCount +1; 
//     countTotal["userMatched"].push(arrayFiles[i]);
//   }
//   if(arrayFiles[i]["ELAB"] == 4 && userRejectedCount<60){
//     // elaborati da utente e non approvato
//     userRejectedCount = userRejectedCount +1; 
//     countTotal["userRejected"].push(arrayFiles[i]);
//   }
//   // se completiamo tutte le colonne il ciclo si ferma
//   // if(systemMatchedCount==60 && matchingWaitingCount==60 && systemMatchedCount==60 && userMatchedCount==60 && userRejectedCount==60){
//   //  break;
//   // }
//   else
//   {
//     console.log("stiamo nel caso particolare di status -1")
//   }
// }