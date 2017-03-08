import Controller from 'ember-controller';
import inject from 'ember-service/inject';
import computed from 'ember-computed';

export default Controller.extend({
  single: false,
  noSubnav: false,
  detectHeight: true,

  intl: inject(),
  navMenu: computed(function() {
    const intl = this.get('intl');
    return [
      { route: 'index', name: intl.t('header-nav.dashboard') },
      { route: 'reports', name: intl.t('header-nav.reports') },
      { route: 'index', name: intl.t('header-nav.help') },
      { route: 'account.plans', name: intl.t('header-nav.plans') }
    ];
  }),
});
