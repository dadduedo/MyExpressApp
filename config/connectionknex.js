const Knex = require('knex');
var express = require('express');
var router = express.Router();
const { Model } = require('objection');
const pippo = Knex({
  client: 'mysql',
  connection: {
    host : process.env.DB_HOST,
    user : process.env.DB_USER,
    password : process.env.DB_PASS,
    database : process.env.DB_NAME
  }
});
//const knex = require('knex')(options);
module.exports = pippo;