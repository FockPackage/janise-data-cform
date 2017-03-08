import Service from 'ember-service';
import $ from "jquery";

export default Service.extend({
  toggle() {
    const body = $('body');
    if (body.hasClass('noscroll')) {
      body.removeClass('noscroll');
    } else {
      body.addClass('noscroll');
    }
  }
});
