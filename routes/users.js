var express = require('express');
var router = express.Router();

/* GET users listing. */
/*router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});*/

const userRoutes = (app, fs) => {
  // variables
  var data2 = require('../public/src/data.json');

  // READ
  app.get('/users', (req, res) => {
    fs.readFile(data2, 'utf8', (err, data) => {
      if (err) {
        throw err;
      }

      res.send(JSON.parse(data));
    });
  });
};

module.exports = router;
