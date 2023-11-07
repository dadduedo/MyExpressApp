const knex = require('../config/connectionknex.js');
const { Model } = require('objection');

Model.knex(knex);

class Tabellone extends Model {
  static get tableName() {
    return 'tabbellone';
  }
   static get idColumn() {
    return 'COMMON_REFERENCE';
  }
}
module.exports = Tabellone;