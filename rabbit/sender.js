const express = require('express');
const router = express.Router();
//var amqp = require('amqplib/callback_api');
var amqp = require('amqplib');

const passport = require('passport');
const BearerStrategy = require('passport-http-bearer').Strategy;
const SECRET = 'mysecret';
const ADMIN = 'admin';
const jwt = require('jwt-simple');
conn =  amqp.connect('amqp://localhost');

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

router.get('/',passport.authenticate('bearer', { session: false }),async function(req, res, next) {
//var conn;  
//if (conn == undefined) {
  
  var channel;
   if (channel == undefined){
    var channel = await conn.createChannel(function(err, ch) {
    if (closeOnErr(err)) return;
    ch.on("error", function(err) {
      console.error("[AMQP] channel error", err.message);
    });
    ch.on("close", function() {
      console.log("[AMQP] channel closed");
    });
    
});
}
//}

var exchange = 'logs';
var msg = process.argv.slice(2).join(' ') || 'Hello World!';
var msg2 = process.argv.slice(2).join(' ') || 'secondo messaggio';
channel.assertExchange(exchange, 'fanout', {durable: false});
channel.publish(exchange, '', Buffer.from(msg));
channel.publish(exchange, '', Buffer.from(msg2));
        console.log(" [x] Sent %s", msg);
        console.log(" [x] Sent %s", msg2);

 setTimeout(() => {
    conn.close();
   
  }, 500);

// amqp.connect('amqp://localhost', function(error0, connection) {
//     if (error0) {
//         throw error0;
//     }
//     connection.createChannel(function(error1, channel) {
//         if (error1) {
//             throw error1;
//         }
//         var exchange = 'logs';
//         var msg = process.argv.slice(2).join(' ') || 'Hello World!';
//         var msg2 = process.argv.slice(2).join(' ') || 'secondo messaggio';

//         channel.assertExchange(exchange, 'fanout', {
//             durable: false
//         });
//         channel.publish(exchange, '', Buffer.from(msg));
//         channel.publish(exchange, '', Buffer.from(msg2));
//         console.log(" [x] Sent %s", msg);
//         console.log(" [x] Sent %s", msg2);
//     });

//     setTimeout(function() {connection.close();}, 500);
// });



// amqp.connect('amqp://localhost', function(error0, connection) {
//     if (error0) {
//         throw error0;
//     }
//     connection.createChannel(function(error1, channel) {
//         if (error1) {
//             throw error1;
//         }

//         var queue = 'hello';
//         var msg = '1messaggio';

//         channel.assertQueue(queue, {
//             durable: false
//         });
//         channel.sendToQueue(queue, Buffer.from(msg));

//         console.log(" [x] Sent %s", msg);
//     });
//     setTimeout(function() {
//         connection.close();
//        // process.exit(0);
//     }, 500);

//     });



// amqp.connect('amqp://localhost', function(error0, connection) {
//     if (error0) {
//         throw error0;
//     }
//     connection.createChannel(function(error1, channel) {
//         if (error1) {
//             throw error1;
//         }
//         var queue = 'task_queue';
//         var msg = process.argv.slice(2).join(' ') || "2messaggo";

//         channel.assertQueue(queue, {
//             durable: true
//         });
//         channel.sendToQueue(queue, Buffer.from(msg), {
//             persistent: true
//         });
//         console.log(" [x] Sent '%s'", msg);
//     });
//     setTimeout(function() {
//         connection.close();
//         //process.exit(0);
//     }, 500);
// });

res.send("mandato roba");
});


module.exports = router;