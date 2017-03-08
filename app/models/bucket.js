import Model from 'ember-data/model';
import attr from 'ember-data/attr';
import { belongsTo } from 'ember-data/relationships';

export default Model.extend({
  name: attr('string'),
  type: attr('number'),
  serial: attr('string'),
  createdAt: attr('date'),
  updatedAt: attr('date'),
  source: belongsTo('source', { async: true })
});
