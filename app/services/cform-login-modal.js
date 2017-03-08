import Ember from 'ember';

export default Ember.Service.extend({
  isShow: false,

  open() {
    this.set('isShow', true);
  },

  close() {
    this.set('isShow', false);
  }
});
