import Route from 'ember-route';
import RSVP from 'rsvp';

export default Route.extend({
  model(params) {
    return RSVP.resolve({wildcard: params.wildcard});
  }
});
