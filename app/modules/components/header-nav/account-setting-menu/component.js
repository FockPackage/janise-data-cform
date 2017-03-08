import Component from 'ember-component';
import inject from 'ember-service/inject';
import computed, { reads } from 'ember-computed';
import { htmlSafe } from 'ember-string';
import config from 'choice-dashboard/config/environment';
import getOwner from 'ember-owner/get';
import get from 'ember-metal/get'

export default Component.extend({
  tagName: 'li',
  localClassNameBindings: ['account'],

  router: computed(function() {
    return getOwner(this, 'container').lookup('router:main');
  }),

  session: inject(),
  ajax: inject('cform-ajax'),
  routing: inject('-routing'),
  avatar: inject('cform-avatar'),

  avatarUrl: reads('avatar.url'),
  avatarStyle: computed('avatarUrl', function() {
    const avatarUrl = this.get('avatarUrl');
    if (avatarUrl === '') return ''

    if (avatarUrl) {
      return htmlSafe(`background-image: url(${avatarUrl})`);
    }
    this.get('avatar').getAvatar();
  }),
  helpHost: computed(function() {
    return config.HELP_HOST;
  }),

  actions: {
    signOut() {
      this.get('ajax').request(`${config.API_ENDPOINT}/Page/SignOut`)
        .then(() => {
          localStorage.removeItem('encryptedCompanyId');
          localStorage.removeItem('somethingEncryption');
          this.get('session').invalidate();
        });
    },

    goTo(target) {
      get(this, 'router').transitionTo(target);
    }
  }
});
