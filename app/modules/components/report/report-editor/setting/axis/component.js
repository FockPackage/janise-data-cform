import Component from 'ember-component';
import computed from 'ember-computed';
import get from 'ember-metal/get';
import set from 'ember-metal/set';

export default Component.extend({
  currentTabName: 'value',
  correspondingComponent: computed('currentTabName', function() {
    const name = get(this, 'currentTabName');
    return `report/report-editor/setting/axis/${name}`;
  }),

  actions: {
    setCurrentTab(name) {
      set(this, 'currentTabName', name);
    }
  }
});
