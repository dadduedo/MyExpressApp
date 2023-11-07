//mydb tabella users
const { Model } = require('objection');
const knex = require('../config/connectionknex.js');

Model.knex(knex);

class User extends Model {
  static get tableName() {
    return 'users';
  }
   static get idColumn() {
    return 'idusers';
  }

}
module.exports = User;