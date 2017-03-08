import Component from 'ember-component';
import set from 'ember-metal/set';
import get from 'ember-metal/get';
import Quill from 'quill';
import { A } from 'ember-array/utils';
import inject from 'ember-service/inject';
import config from 'choice-dashboard/config/environment';
import computed from 'ember-computed';

export default Component.extend({
  ajax: inject(),

  allLanguageList: A([
    { text: 'english', lang: 'en-us' },
    { text: 'chinese', lang: 'zh-cn' },
    { text: '日语', lang: 'ja-jp' },
    { text: '韩语', lang: 'ko-kr' }
  ]),
  currentLang: computed(function() {
    return document.querySelector('html').getAttribute('lang');
  }),

  didReceiveAttrs() {
    this._super(...arguments);
    const announcement = get(this, 'announcement');
    if (announcement) {
      const newLanguageList = announcement.languages.map(language => {
        const tempLanguage = get(this, 'allLanguageList').findBy('lang', language.language);
        if (tempLanguage) {
          language.lang = tempLanguage.lang;
          language.text = tempLanguage.text;
        }
        return language;
      })
      set(this, 'languageList', newLanguageList);
    }
  },

  didInsertElement() {
    this._super(...arguments);

    set(this, 'quill', new Quill('#preview', {
      modules: {
        toolbar: false
      },
      readOnly: true,
      theme: 'snow'
    }));
  },

  didRender() {
    const quill = get(this, 'quill');
    quill.setContents(JSON.parse(get(this, 'announcement.content')));
  },

  _getAnnouncement(id) {
    return this.get('ajax').request(`${config.DASHBOARD_API_ENDPOINT}/v1/announcements/${id}/show_all`)
      .then(response => set(this, 'announcement', response.announcement));
  },

  actions: {
    selectLanguage(id, lang) {
      set(this, 'currentLang', lang);
      this.get('getAnnouncement')(id);
    }
  }
});
