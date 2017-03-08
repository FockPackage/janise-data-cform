import Component from 'ember-component';
import get from 'ember-metal/get';
import set from 'ember-metal/set';

export default Component.extend({
  didReceiveAttrs() {
    this._super(...arguments);

    const id = get(this, 'currentSortordId') || 1;
    const currentSortord = get(this, 'sortordList').findBy('id', id);
    set(this, 'currentSortord', currentSortord);
  }
});
