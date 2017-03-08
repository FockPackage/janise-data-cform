import Ember from 'ember';
import $ from 'jquery';

export default Ember.Service.extend({
  isShow: false,
  color: '#FFF',

  show() {
    this._setColor();
    this.set('isShow', true);
    $(window).on("scroll", this._setColor.bind(this));
  },

  hide() {
    this.set('isShow', false);
    $(window).off("scroll", this._setColor);
  },

  _setColor() {
    const color = $("#global-loading").offset().top <= 60 ? '#FFF' : '#5940AA';
    this.set('color', color);
  }
});
