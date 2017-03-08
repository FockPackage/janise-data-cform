import Route from 'ember-route';

export default Route.extend({
  model() {
    return this.store.findAll('report');
  },

  renderTemplate() {
    this._super(...arguments);
    this.render('reports/index/subnav', { into: 'application', outlet: 'subnav' });
  }
});
