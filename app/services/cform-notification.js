import Ember from 'ember';
import { later } from 'ember-runloop';

export default Ember.Service.extend({
  isShow: false,
  color: '#FFF',
  icon: '',
  label: '',
  time: 2000,

  show(config) {
    this.set('isShow', true);
    this.set('color', config.color);
    this.set('icon', config.icon);
    this.set('label', config.label);

    later(this, "_hide", this.get('time'));
  },

  _hide() {
    this.set('isShow', false);
  }
});
