import Ember from 'ember';
import computed from 'ember-computed';
import { htmlSafe } from 'ember-string';

export default Ember.Component.extend({
  avatarStyle: computed('avatar', function() {
    const avatar = this.get('avatar');
    return avatar ? htmlSafe(`background-image: url(${ avatar })`) : '';
  }),
  offsetStyle: computed('offset', function() {
    return htmlSafe(`stroke-dashoffset: ${ this.get('offset') }`);
  })
});
