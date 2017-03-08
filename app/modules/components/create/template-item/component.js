import Component from 'ember-component';
import computed from 'ember-computed';
import { htmlSafe } from 'ember-string';

export default Component.extend({
  coverStyle: computed('cover', function() {
    return htmlSafe(`background-image: url(${ this.get('cover') })`);
  }),
});
