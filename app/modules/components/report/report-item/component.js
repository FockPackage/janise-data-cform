import Component from 'ember-component';
import computed from 'ember-computed';
import getOwner from 'ember-owner/get';
import get from 'ember-metal/get';

export default Component.extend({
  router: computed(function() {
    return getOwner(this, 'container').lookup('router:main');
  }),

  actions: {
    showReport(report) {
      get(this, 'router').transitionTo('reports.report', report.id, {
        queryParams: {
          view: get(this, 'report.currentView.id'),
          filter: get(this, 'report.currentFilter.id'),
        }
      })
    }
  }
}).reopenClass({ positionalParams: ['report'] });
