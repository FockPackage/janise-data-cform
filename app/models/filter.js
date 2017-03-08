import Model from 'ember-data/model';
import attr from 'ember-data/attr';
import { belongsTo } from 'ember-data/relationships';

export default Model.extend({
  name: attr(),
  selected: attr('boolean'),
  createdAt: attr('date'),
  updatedAt: attr('date'),
  view: belongsTo('view', { async: true })
});
