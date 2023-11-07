const express = require('express');
const router = express.Router();
var Task = require('../models/tasks.js');
const passport = require('passport');
const BearerStrategy = require('passport-http-bearer').Strategy;



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

//production redis url
let redis_url = process.env.REDIS_URL;
if (process.env.ENVIRONMENT === 'development') {  
  require('dotenv').config();  
  redis_url = "redis://127.0.0.1"; 
}  

//redis setup
let client = require('redis').createClient(redis_url);
let Redis = require('ioredis');
let redis = new Redis(redis_url);



//sample endpoint to GET representative deatils
router.get('/',passport.authenticate('bearer', { session: false }),async function(req, res, next) { 
  const uid = req.body.id;      //uid is unique identifier
  console.log(uid);
  //check if rep details are present in cache     
  const request = await Task.query().findById(uid);
  console.log(request);
  console.log(request.id);

  client.get(uid, (error, rep)=> {                
    if(error){                                                 
      res.status(500).json({error: error});                             
      return;                
  }                 
  if(rep){                        
  //JSON objects need to be parsed after reading from redis, since it is stringified before being stored into cache                      
  console.log("sto in cache");
  res.status(200).json(JSON.parse(rep));                 
 }                  
 else{
  //if data not present in cache, make a request to db
 //request
                     
    if(request.length == 0) {
      res.status(400).json({ error: "The representative with the specified uid does not exist" });                        
}                        
 else {                                                                          
  res.status(200).json(request);               
  //cache data received from db          
  client.set(uid, JSON.stringify(request),(error, result)=> { 
  if(error){                                                
    res.status(500).json({ error: error});                        
  }})
}         //end of inner else                
      //end of .then               
        
}   //end of outer else
});
}); 
 //end of clinet.get 
router.get('/cache',passport.authenticate('bearer', { session: false }),async function(req, res, next) {

function getRedis(key) {
 return new Promise((resolve, reject) => {
  client.get(key, (err, val) => {
   if (err) {
    reject(err)
    return
   }
   if (val == null) {
    resolve(null)
    return
   }
   try {
    resolve(
     JSON.parse(val)
    )
   } catch (ex) {
    resolve(val)
   }
  })
 })
}

client.set("tokenbello", req.user, function(err, reply) {
  console.log(reply);
});
client.get('student', function(err, rispondi) {
  console.log(rispondi);
});
client.get('tokenbello', function(err, rispondi) {
  console.log(rispondi);
});
let thenProm = getRedis("tokenbello").then(value => {
    console.log("token qua " + value);
    return res.send(value);
    });
//getRedis("tokenbello").then(() => {res.send(value) })
console.log("il token è " + thenProm);
//res.send(thenProm)

});

module.exports = router;