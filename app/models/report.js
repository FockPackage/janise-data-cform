import Model from 'ember-data/model';
import attr from 'ember-data/attr';
import { hasMany } from 'ember-data/relationships';
import computed from 'ember-computed';
import get from 'ember-metal/get';

export default Model.extend({
  name: attr(),
  createdAt: attr('date'),
  updatedAt: attr('date'),
  sources: hasMany('source', { async: true }),
  views: hasMany('view', { async: true }),
  currentView: computed('views', function() {
    return get(this, 'views').findBy('selected', true);
  }),
  currentFilter: computed('currentView', function() {
    return get(this, 'currentView.filters').findBy('selected', true) || { id: null };
  })
});
