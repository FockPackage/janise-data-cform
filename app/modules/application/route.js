import $ from 'jquery';
import Route from 'ember-route';
import ApplicationRouteMixin from 'ember-simple-auth/mixins/application-route-mixin';
import config from 'choice-dashboard/config/environment';
import inject from 'ember-service/inject';
import LoadingSliderMixin from 'choice-dashboard/mixins/loading-slider';

export default Route.extend(ApplicationRouteMixin, LoadingSliderMixin, {
  intl: inject(),
  ajax: inject('cform-ajax'),
  loginModal: inject('cform-login-modal'),

  beforeModel(transition) {
    this._super(...arguments);
    this._initializeLocale();

    if (!this.get('session.isAuthenticated')) {
      this.transitionTo('login');
      return;
    }

    return this._checkSession(transition);
  },

  _checkSession(transition) {
    return this.get('ajax')
      .request(`${config.API_ENDPOINT}/Page/CheckSessionLost`)
      .then(() => {
        if (transition.targetName === 'login') {
          this.transitionTo('index');
        }
      })
      .catch(reason => {
        if ('BMsg_PageExpired' === reason) {
          this.get('session').invalidate();
        }
      });
  },

  _initializeLocale() {
    // Extract window.navigator object
    // const {navigator} = window;
    // Get current language name
    // let language = navigator.language || navigator.browserLanguage;
    const language = 'en-us';
    // Change lang attribute for <html> tag
    document.querySelector('html')
      .setAttribute('lang', language.toLowerCase());
    // Set active locale name
    return this.get('intl')
      .setLocale(/zh-cn/i.test(language) ? 'zh-hans' : language);
  },

  actions: {
    loading(transition) {
      this._super(...arguments);
      transition.finally(() => $(window).scrollTop(0));
    }
  }
});
