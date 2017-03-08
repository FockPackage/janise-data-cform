import Model from 'ember-data/model';
import attr from 'ember-data/attr';

export default Model.extend({
  name: attr('string'),
  type: attr('number'),
  thumbnail: attr('string'),
  createdAt: attr('date'),
  updatedAt: attr('date')
});
