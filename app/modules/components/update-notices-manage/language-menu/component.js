import Component from 'ember-component';
import set from 'ember-metal/set';
import get from 'ember-metal/get';

export default Component.extend({
  didReceiveAttrs() {
    this._super(...arguments);

    const lang = get(this, 'currentLang');
    const currentLanguage = get(this, 'languageList').findBy('lang', lang);
    set(this, 'currentLanguage', currentLanguage);
  }
});
