import Component from 'ember-component';
import computed from 'ember-computed';
import { htmlSafe } from 'ember-string';

export default Component.extend({
  tagName: 'section',
  localClassNames: ['header-view'],

  maximizeIcon: computed('api.isMaximized', function() {
    const classname = this.get('api.isMaximized') ? 'stretch' : 'pinch';
    return htmlSafe(`<i class="gestures-${classname}"></i>`);
  })
});
