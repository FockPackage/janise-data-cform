import Component from 'ember-component';

export default Component.extend({
  localClassNames: ['view']
}).reopenClass({ positionalParams: ['views', 'selectedView'] });
