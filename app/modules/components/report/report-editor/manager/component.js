import Component from 'ember-component';
import get from 'ember-metal/get';
import set from 'ember-metal/set';

export default Component.extend({
  classNames: ['setting-row'],

  actions: {
    setTypeFilter(type, dropdown) {
      if (type !== get(this, 'currentTypeFilter')) {
        set(this, 'currentTypeFilter', type);
      }
      return dropdown.actions.close();
    }
  }
});
