import Component from 'ember-component';
import computed, { reads, gt } from 'ember-computed';
import get from 'ember-metal/get';
import set from 'ember-metal/set';
import inject from 'ember-service/inject';
import getOwner from 'ember-owner/get';

export default Component.extend({
  classNames: ['header-control'],

  intl: inject(),
  router: computed(function() {
    return getOwner(this, 'container').lookup('router:main');
  }),

  selectedView: computed('views.@each.selected', function() {
    return get(this, 'views').findBy('selected', true);
  }),

  filters: reads('selectedView.filters'),

  emptyFilter: computed(function() {
    return {
      id: 0,
      name: get(this, 'intl').t('view-filter-dropdown.default-filter'),
      selected: get(this, 'filters').filterBy('selected', true).length === 0
    };
  }),

  hasRealFilterSelected: gt('selectedFilter.id', 0),

  selectedFilter: computed('filters.@each.selected', function() {
    return get(this, 'filters').findBy('selected', true) || get(this, 'emptyFilter');
  }),

  actions: {
    changeSelectedView(id) {
      get(this, 'views').forEach(view => set(view, 'selected', id === view.id));
      get(this, 'router').transitionTo({ queryParams: { view: id }});
    },

    changeSelectedFilter(id) {
      get(this, 'filters').forEach(filter => set(filter, 'selected', id === filter.id));
      get(this, 'router').transitionTo({ queryParams: { filter: id }});
    }
  }
}).reopenClass({ positionalParams: ['views'] });
