require('dotenv').config();

var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var compagnieRouter = require('./routes/compagnie');
var dbrouter = require('./routes/dbmysql');
var knex1 = require('./routes/knex');
var Kiribamurex1 = require('./routes/Kiribamurex');
var returnFR = require('./routes/returnFR');
var redisjs = require('./routes/redis');
var sender = require('./rabbit/sender');
var Kiribamurex1row = require('./routes/Kiribamurexrow');
var Kiribamurex1rowonefor = require('./routes/Kiribamurexrowonefor');
var seletTotali = require('./routes/selectTotali');
var aggiungi = require('./routes/aggiungereRecord');

var app = express();
//passport
const passport = require('passport');
const bodyParser = require('body-parser');
const LocalStrategy = require('passport-local').Strategy;
const BearerStrategy = require('passport-http-bearer').Strategy;
const jwt = require('jwt-simple');
const jwt1 = require("jsonwebtoken");
const ADMIN = 'admin';
const ADMIN_PASSWORD = 'password';
const SECRET = 'mysecret';
var User = require('./models/users.js');
//rabbit
var amqp = require('amqplib/callback_api');




// async function cercaUtente(req, res, next) {
//   try {
//    var miousername = req.body.username;
//    var miopassword = req.body.password;
//     const user = await User.query()
//       .select('username', 'password')
//       .where('username', '=', 'edo')
//       .where('password', '=', 'edo');
//   console.log(user[0].password);
//   console.log(user[0].username);
//   return user[0].password  
//   } 
//   try {
//       const user = await User.query()
//       .select('username', 'password')
//       .where('username', '=', 'edo')
//       .where('password', '=', 'edo');
//       if (!user) {
//         return done(null, false, {message: 'No user by that email'});
//       }
//     } catch (e) {
//       return done(e);
//     }catch (error) {
//     console.error(error);
//   }
// }
//  var myPromise = new Promise((resolve, reject) => {
//        const compito = await User.query()
//          .select('username', 'password')
//          .where('username', '=', 'edo')
//          .where('password', '=', 'edo');
//        console.log(compito[0].password);
//        console.log(compito[0].username);
//         resolve(compito[0].password);
//         reject( 'errorPayload' );
//       });
      
//passport

app.use(bodyParser.json());



passport.use(new LocalStrategy((username, password, done) => {

 // var utente = dbuser(req, res, next);
  //console.log(utente);
 

  if (true) {
    done(null, jwt.encode({ username }, SECRET));
    return;
  }
  done(null, false);
}));

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

app.get('/', (req, res) => res.send('Hello World!'))

app.post( '/login',passport.authenticate('local', { session: false }),
  (req, res) => {
     var utente = dbuser();
  console.log(utente);
    res.send({
      token: req.user,
    });
  },
);
app.get('/todos',
  passport.authenticate('bearer', { session: false }),async function(req, res) {
     
     res.send({
      token: req.user,
    });
  },
);
app.post(
  '/todos',
  passport.authenticate('bearer', { session: false }),
  (req, res) => {
    Todo.create({ note: req.body.note })
      .then((todo) => {
        res.send(todo);
      });
  },
);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
//app.use('/compagnie', compagnieRouter);
//app.use('/db',dbrouter);
app.use('/knex',knex1);
app.use('/redis',redisjs);
app.use('/sender',sender);
app.use('/kiriba',Kiribamurex1);
app.use('/returnFR',returnFR);
app.use('/kiribarow',Kiribamurex1row);
app.use('/kiribarowonefor',Kiribamurex1rowonefor);
app.use('/seletTotali',seletTotali);
app.use('/aggiungi',aggiungi);
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});


module.exports = app;
