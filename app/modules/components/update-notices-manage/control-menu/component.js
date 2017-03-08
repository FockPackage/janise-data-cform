import Component from 'ember-component';
import computed from 'ember-computed';
import getOwner from 'ember-owner/get';
import get from 'ember-metal/get';

export default Component.extend({
  router: computed(function() {
    return getOwner(this, 'container').lookup('router:main');
  }),

  actions: {
    goToEditor(id) {
      get(this, 'router').transitionTo('updates-manage.updates.editor', id);
    }
  }
});
