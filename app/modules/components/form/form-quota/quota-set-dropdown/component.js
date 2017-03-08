import Component from 'ember-component';
import computed from 'ember-computed';

export default Component.extend({
  currentQuota: computed('currentNodeID', function() {
    return this.get('nodes').findBy('NodeID', this.get('currentNodeId'));
  })
});
