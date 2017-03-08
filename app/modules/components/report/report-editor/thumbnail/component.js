import Component from 'ember-component';
import computed from 'ember-computed';
import get from 'ember-metal/get';
import { htmlSafe } from 'ember-string';

export default Component.extend({
  tagName: 'li',

  coverStyle: computed('source.thumbnail', function() {
    const thumbnail = get(this, 'source.thumbnail');
    return htmlSafe(`background-image: url(${thumbnail})`);
  })
}).reopenClass({ positionalParams: ['source'] });
