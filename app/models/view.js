import Model from 'ember-data/model';
import attr from 'ember-data/attr';
import { belongsTo, hasMany } from 'ember-data/relationships';

export default Model.extend({
  name: attr(),
  selected: attr('boolean'),
  createdAt: attr('date'),
  updatedAt: attr('date'),
  report: belongsTo('report', { async: true }),
  filters: hasMany('filter')
});
