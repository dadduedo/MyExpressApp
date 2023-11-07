// var express = require('express');
// const { response } = require('../app');
// var router = express.Router();

// var datajson = require('../public/src/data.json');



// /* GET users listing. */
// router.get('/', function(req, res, next) {
//  res.json(datajson);
// });

// router.get('/unica', function(req, res, next) {
//     var queryStuff = req.query; 
//     console.log(queryStuff)
//     datajson.compagnie = datajson.compagnie.filter(function (a) {
//             return a.nome === req.query.nome;
//         });

//         var sd = datajson.compagnie[0];
//         res.json(sd);
// });

// router.get('/:numdipendenti', function(req, res, next) {
//     console.log("choice numdipendenti is " +req.params.numdipendenti);
//   //  req.params; 
//   //  res.json(req.params);
   
// });
// /* POST add one comp. */
// router.post('/', function(req, res, next) {
  
//  var Mybody = req.body;

// var trovato = 0;

//   for (var i in datajson.compagnie){

//     var string = datajson.compagnie[i];
//     console.log("body" + req.body.nome);
//     console.log("string" + string.nome);

//     if(req.body.nome != string.nome){
        
//         trovato= 1;
//         }
//     else {
//         trovato= 0;
//     }
//     }
//    if(trovato==1){
//      datajson.compagnie.push(Mybody);   
//    }
//  res.json(datajson)
// });
// //aggiorna il numero dipendenti
// router.put('/num/:numdipendenti', (req, res) => {
//  const nuovoNum = req.params;
//  console.log(nuovoNum);

//  req.body.numdipendenti = nuovoNum.numdipendenti

//  res.json(req.body)
// })

// router.delete('/del/:nome', (req, res) => {
//   const deleteNome = req.params.nome
  
//   console.log(deleteNome);
//   var index = datajson.compagnie.findIndex(obj => obj.nome== deleteNome);
//   console.log(index);
//   console.log(deleteNome);
  
//  datajson.compagnie.splice(index, 1) 

//  res.json(datajson)
// })




// module.exports = router;