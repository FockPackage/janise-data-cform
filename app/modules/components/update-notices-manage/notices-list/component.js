import Component from 'ember-component';
import computed from 'ember-computed';
import get from 'ember-metal/get';
import set from 'ember-metal/set';
import {isBlank} from 'ember-utils';

export default Component.extend({
  isBlank: computed('announcementList', function () {
    return isBlank(get(this, 'announcementList'));
  }),

  currentTag: "All",

  actions: {
    toggleHideDescription(id) {
      const announcement = get(this, 'announcementList').findBy('id', id);
      set(announcement, 'isHideDescription', !announcement.isHideDescription);
    },

    changeTag(tag) {
      set(this, 'currentTag', tag);
      this.get('filterByTag')(tag);
    },
  }
}).reopenClass({positionalParams: ['announcementList']});
