import Route from 'ember-route';
import get from 'ember-metal/get';
import set from 'ember-metal/set';

export default Route.extend({
  renderTemplate() {
    this._super(...arguments);
    this.render('account/subnav', { outlet: 'subnav' });
  },

  model(params, transition) {
    return {
      tabList: [
        {
          routeName: 'account.general',
          text: 'account-settings.profile',
          isCurrentRoute: transition.targetName.includes('general')
        }, {
          routeName: 'account.plans',
          text: 'account-settings.plans',
          isCurrentRoute: transition.targetName.includes('plans')
        }, {
          routeName: 'account.billing.payment-history',
          text: 'account-settings.billing',
          isCurrentRoute: transition.targetName.includes('billing')
        }, {
          routeName: 'account.purchases',
          text: 'account-settings.purchases',
          isCurrentRoute: transition.targetName.includes('purchases')
        }, {
          routeName: 'account.notifications',
          text: 'account-settings.email-settings',
          isCurrentRoute: transition.targetName.includes('notifications')
        }, {
          routeName: 'account.security',
          text: 'account-settings.password',
          isCurrentRoute: transition.targetName.includes('security')
        }, {
          routeName: 'account.integrations',
          text: 'account-settings.integrations',
          isCurrentRoute: transition.targetName.includes('integrations')
        }
      ]
    }
  },

  actions: {
    selectTab(routeName) {
      const tabList = get(this, 'currentModel.tabList');
      tabList.setEach('isCurrentRoute', false);
      const tab = tabList.findBy('routeName', routeName);
      set(tab, 'isCurrentRoute', true);
    }
  }
});
