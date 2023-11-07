// var express = require('express');
// var router = express.Router();
// const mysql = require('mysql');
// // connection configurations

// var datajson = require('../public/src/data2.json');

// const sql = mysql.createConnection({
//     host: 'localhost',
//     user: 'root',
//     password: 'root',
//     database : 'mydb'
// });
// /* GET home page. */
// router.get('/', function(req, res, next) {
//     sql.query('SELECT * FROM tasks', (err,rows) => {
//       if(err) throw err;

//   console.log('Data received from Db:');
//   console.log(rows);
//   res.send("get all")
// }); 
// });
// //http://localhost:3000/db/tasks?id=1
// router.get('/tasks', function(req, res, next) {
//   const singNum = req.query.id;
 
//    console.log(singNum);
//   sql.query('SELECT * FROM tasks WHERE id = ' + singNum , (err,row) => {
//       if(err) throw err;

//   console.log('Data received from Db:');
//   console.log(row);
//   res.send(singNum)

// });  
// });
// //http://localhost:3000/db/
// router.post('/', function(req, res, next) {

    
//     let sql2 = 'INSERT INTO tasks SET ?'
//     let post = {
//         id : req.body.id,
//         task : req.body.task,
//         status: req.body.status,
//         created_at: req.body.created_at
//     }
// //INSERT INTO tasks (id, task,status,created_at) VALUES (newid,newtask,newstatus,newcreated_at
//     sql.query(sql2,post, (err,responseJson) => {
//       if(err) throw err;

//   console.log('Data received from Db:');
//   console.log(responseJson);
//   res.send("insert one")
// });  
// });
// //http://localhost:3000/db/tasks?id=1
// router.put('/tasks', function(req, res, next) {
//   var bodytask = req.body.task;
//   var queryid = req.query.id;
  

// console.log(queryid);
// console.log(bodytask);

//   sql.query('UPDATE tasks SET task = ' + bodytask + ' WHERE id = ' + queryid , (err,rows) => {
//       if(err) throw err;

//   console.log('Data received from Db:');
//   console.log(rows);
//   res.send("update one")
// });  
// });
// router.delete('/tasks', function(req, res, next) {
//   var queryid = req.query.id;
//   sql.query('DELETE FROM tasks WHERE id = ' + queryid , (err,rows) => {
//       if(err) throw err;

//   console.log('Data received from Db:');
//   console.log(rows);
//   res.send("delete one")
// });
// });

// module.exports = router;