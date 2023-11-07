const knex = require('../config/connectionknex.js');
const { Model } = require('objection');

Model.knex(knex);

class Tag extends Model {
  static get tableName() {
    return 'tag';
  }
   static get idColumn() {
    return 'tag';
  }
}
module.exports = Tag;