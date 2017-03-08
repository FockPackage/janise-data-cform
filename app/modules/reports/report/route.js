import Route from 'ember-route';

export default Route.extend({
  model({ id }) {
    return this.store.findRecord('report', id);
  },

  queryParams: {
    currentViewID: { refreshModel: true },
    currentFilterID: { refreshModel: true }
  }
});
