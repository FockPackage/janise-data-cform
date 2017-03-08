import Ember from 'ember';
import Flatpickr from 'flatpickr';
import $ from 'jquery';

export default Ember.Component.extend({
  className: 'ui-fieldset',

  _onDestroy() {
    this.flatpickr.destroy();
    $(`#${ this.get('bindID') }`).val(this.get('value'))
    this.set('flatpickr', null);
  },

  _onChange(dateObject, dateString) {
    this.get('onChange')(dateString);
  },

  actions: {
    init() {
      if(!this.flatpickr) {
        this.flatpickr = new Flatpickr(`#${ this.get('bindID') }`, {
          onClose: this._onDestroy.bind(this),
          onChange: this._onChange.bind(this),
          defaultDate: this.get('value'),
          dateFormat: 'Y-m-d'
        });
        this.flatpickr.open();
      }
    }
  }
});
