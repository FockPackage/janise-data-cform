import Component from 'ember-component';
import set from 'ember-metal/set';
import get from 'ember-metal/get';
import Quill from 'quill';
import { A } from 'ember-array/utils';
import inject from 'ember-service/inject';
import config from 'choice-dashboard/config/environment';
import $ from 'jquery';

export default Component.extend({
  ajax: inject(),

  languageList: A([
    { text: 'english', lang: 'en-us' },
    { text: 'chinese', lang: 'zh-cn' },
    { text: '日语', lang: 'ja-jp' },
    { text: '韩语', lang: 'ko-kr' }
  ]),
  formValue: {
    title: '', describe: '', tag: 'Update', content: { ops: '' }, lang: document.querySelector('html').getAttribute('lang')
  },
  isAddMultiLanguage: false,

  didReceiveAttrs() {
    this._super(...arguments);
    const announcement = get(this, 'announcement');
    if (announcement) {
      set(this, 'formValue', {
        title: announcement.title,
        describe: announcement.describe,
        tag: announcement.tags[0],
        origin: announcement.origin,
        lang: get(this, 'formValue.lang')
      });

      const finishedLanguageList = A(announcement.languages);
      const newLanguageList = get(this, 'languageList').map(language => {
        const finishedLanguage = finishedLanguageList.findBy('language', language.lang);
        if (finishedLanguage) {
          language.id = finishedLanguage.id;
        }
        return language;
      })
      set(this, 'languageList', newLanguageList);
    }
  },

  didInsertElement() {
    this._super(...arguments);

    const toolbarOptions = {
      container: [
        [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
        [{ 'align': [] }, { 'direction': 'rtl' }],
        ['bold', 'italic', 'underline', 'strike'],
        [{ 'color': [] }, { 'background': [] }],
        ['blockquote', 'code-block'],
        [{ 'list': 'ordered'}, { 'list': 'bullet' }],
        [{ 'script': 'sub'}, { 'script': 'super' }],
        ['link', 'image', 'video']
      ],
      handlers: { image: this._showUploadImageUI }
    };

    set(this, 'quill', new Quill('#editor', {
      modules: {
        toolbar: toolbarOptions
      },
      theme: 'snow'
    }));
  },

  didRender() {
    const announcement = get(this, 'announcement');
    if (!get(this, 'isAddMultiLanguage') && announcement) {
      const quill = get(this, 'quill');
      quill.setContents(JSON.parse(get(this, 'announcement.content')));
    }
  },

  _showUploadImageUI(value) {
    if (value) {
      $('#quill-upload').click();
    } else {
      alert('请先选择插入位置');
    }
  },

  _getAnnouncement(id) {
    return this.get('ajax').request(`${config.DASHBOARD_API_ENDPOINT}/v1/announcements/${id}/show_all`)
      .then(response => set(this, 'announcement', response.announcement));
  },

  actions: {
    changeTag(tag) {
      set(this, 'formValue.tag', tag);
    },

    onSaveClick() {
      const formValue = get(this, 'formValue');
      formValue.content = get(this, 'quill').getContents();
      const announcement = get(this, 'announcement');
      if (get(this, 'isAddMultiLanguage')) {
        get(this, 'createMultiLanguageAnnouncement')(formValue);
      } else if (announcement) {
        get(this, 'updateAnnouncement')(announcement.id, formValue);
      } else {
        get(this, 'createAnnouncement')(formValue);
      }
    },

    uploadImage(e) {
      const quill = get(this, 'quill');
      const range = quill.getSelection();
      if (range) {
        const formData = new FormData();
        formData.append('file', e.target.files[0])

        $.ajax({
          url: config.UPLOAD_IMAGE_API,
          type: "POST",
          data: formData,
          processData: false,
          contentType: false,
        })
          .done(response => {
            const quill = get(this, 'quill');
            const image = config.CDN_PREFIX + response.Result.filename;
            quill.insertEmbed(range.index, 'image', image, 'user');
          })
          .fail(error => console.log(error));  // eslint-disable-line no-console
      }
    },

    selectLanguage(id, lang) {
      if (id) {
        set(this, 'formValue.lang', lang);
        set(this, 'isAddMultiLanguage', false);
        this._getAnnouncement(id);
      } else {
        const quill = get(this, 'quill');
        quill.setContents({ ops: [] });
        set(this, 'formValue', {
          title: '', describe: '', tag: 'Update', lang: lang, origin: get(this, 'announcement.id')
        });
        set(this, 'isAddMultiLanguage', true);
      }
    }
  }
});
