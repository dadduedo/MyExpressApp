var express = require('express');
var router = express.Router();
var Tabbellone = require('../models/tabbellone.js');
var datajson = require('../src/datarowjson.json');
var control = require('../controlli/funzioni.js');
const random = require('random');

//http://localhost:3000/aggiungi
router.post('/',async function(req, res, next) {
  datajson.ACQUIRED_ON = control.tempo();
  datajson.ELAB = random.int(0, 4);
  console.log("for");
  for (let i = 0; i < 1000; i++) {
     
      const newInsert = await Tabbellone.query().insert(datajson);
  }
res.send('got it');
});

module.exports = router;