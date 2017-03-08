import Route from 'ember-route';
import RSVP from 'rsvp';

export default Route.extend({
  model(_, { queryParams }) {
    const  { view, filter } = queryParams;
    const report = this.modelFor('reports/report');
    return RSVP.hash({
      report,
      sources: report.get('sources'),
      presentations: this.store.query('presentation', { view, filter })
    });
  },

  renderTemplate() {
    this._super(...arguments);
    this.render('reports/report/index/subnav', { into: 'application', outlet: 'subnav' });
  }
});
