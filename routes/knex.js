var express = require('express');
var router = express.Router();
var Task = require('../models/tasks.js');

const passport = require('passport');
const BearerStrategy = require('passport-http-bearer').Strategy;
const SECRET = 'mysecret';
const ADMIN = 'admin';
const jwt = require('jwt-simple');

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


//http://localhost:3000/knex?id=1
router.get('/',passport.authenticate('bearer', { session: false }),async function(req, res, next) {
var myid = req.query.id
const compito = await Task.query().findById(myid);
console.log('peni');
console.log(compito.status);
console.log('peni');
console.log(compito.task);
console.log('peni');
console.log(compito instanceof Task);

res.send("get singola")

});
//http://localhost:3000/knex/molte
router.get('/molte',passport.authenticate('bearer', { session: false }),async function(req, res, next) {
const compito = await Task.query();
console.log(compito.status);
console.log(compito instanceof Task);

res.send("get tutte")

});

//http://localhost:3000/knex/
router.post('/',async function(req, res, next) {
var mybody=req.body;
const compito = await Task.query().insert(mybody);
console.log(compito);
console.log(compito instanceof Task);

res.send("insert one")

});
//http://localhost:3000/knex/cambia?id=3&task=cocco
//http://localhost:3000/knex/cambia/
router.put('/cambia',async function(req, res, next) {
  var miotask = req.body.task;
  var mioid = req.body.id;
//var miotask = req.query.task;
//var mioid = req.query.id;
const compito = await Task.query().patch
  ({ task: miotask })
  .where('id', '=', mioid);

console.log(compito);
console.log(compito instanceof Task);

res.send("update one")

});

router.delete('/',async function(req, res, next) {
const compito = await Task.query().deleteById(2);
console.log(compito);
console.log(compito instanceof Task);

res.send("delete one")

});
module.exports = router;
//module.exports = MinimalModel;

