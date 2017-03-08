import Component from 'ember-component';

export default Component.extend({
  localClassNames: ['view-filter']
}).reopenClass({ positionalParams: ['filters'] });
