import Model from 'ember-data/model';
import attr from 'ember-data/attr';
import { reads, equal } from 'ember-computed';
import { belongsTo } from 'ember-data/relationships';

export default Model.extend({
  createdAt: attr('date'),
  updatedAt: attr('date'),
  visible: attr('boolean'),
  source: reads('bucket.source'),
  isCustom: equal('source.type', 0),
  bucket: belongsTo('bucket', { async: true })
});
