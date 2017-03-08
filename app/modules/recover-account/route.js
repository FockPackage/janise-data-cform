import Ember from 'ember';

export default Ember.Route.extend({
  renderTemplate() {
    this.render('recover-account', { outlet: 'single' });
  },

  activate() {
    this.controllerFor('application').set('single', true);
  },

  deactivate() {
    this.controllerFor('application').set('single', false);
  }
});
