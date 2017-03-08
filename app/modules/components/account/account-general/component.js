import Component from 'ember-component';
import inject from 'ember-service/inject';
import config from 'choice-dashboard/config/environment';
import computed from 'ember-computed';
import $ from 'jquery';
import { isBlank } from 'ember-utils';
import observer from 'ember-metal/observer';
import get from 'ember-metal/get';
import set from 'ember-metal/set';

export default Component.extend({
  intl: inject(),
  ajax: inject('cform-ajax'),
  cformNotification: inject('cform-notification'),
  avatar: inject('cform-avatar'),
  verifyField: inject('cform-verify-field'),

  languageList: ["zh-cn", "zh-tw", "en-us", "es-es", "ja-jp", "ko-kr"],
  currentLanguage: computed(function() {
    return document.querySelector('html').getAttribute('lang')
  }),

  disabled: { info: true, multiLanguage: true },
  alert: {},
  progress: 380,
  isUploading: false,

  formValue: computed('userInfo', function() {
    const userInfo = this.get('userInfo');
    return {
      firstName: userInfo.FirstName,
      lastName: userInfo.LastName,
      userName: userInfo.Name,
      email: userInfo.UserEmail,
      destinationLanguage: get(this, 'currentLanguage')
    }
  }),
  firstNameObserver: observer('formValue.firstName', function() {
    this._verify('firstName');
  }),
  lastNameObserver: observer('formValue.lastName', function() {
    this._verify('lastName');
  }),
  userNameObserver: observer('formValue.userName', function() {
    this._verify('userName');
  }),
  emailObserver: observer('formValue.email', function() {
    this._verify('email');
  }),

  didInsertElement() {
    this._super(...arguments);

    const upload = $("#image-upload").initUpload({
      IsFromOrganization: false,
      iscrop: true,
      extFilters: [".jpg", ".png", ".jpeg", ".bmp", ".gif"],
      tokenURL: `${config.API_ENDPOINT}/Upload/GetToken`,
      uploadURL: `${config.API_ENDPOINT}/Upload/GetSize`,
      select: () => this._select(),
      complete: (file) => this._complete(file),
      progress: (size) => this._progress(size)
    });
    set(this, 'upload', upload);
  },

  _select() {
    set(this, 'isUploading', true);
  },

  _progress(size) {
    set(this, 'progress', 380 - size * 3.8);
  },

  _complete(file) {
    this.get('ajax').request(`${config.API_ENDPOINT}/Upload/CropBitmap`, {
      data: {
        fileName: file.token,
        uplaodPath: "\\UploadFiles\\Photo",
        companyID: this.get('userInfo.CompanyID'),
        uType: "2",
        quesID: null
      }
    })
      .then(() => this._updateAvatar(file.token));
  },

  _updateAvatar(filename) {
    this.get('ajax').post(`${config.API_ENDPOINT}/UC/ModifyComPortrait`, {
      data: { filename }
    })
      .then(response => {
        set(this, 'isUploading', false);
        set(this, 'progress', 380);
        this.get('notification').success('Saved');

        const avatarUrl = isBlank(filename) ? '' : response.Result.Portrait;
        this.set('userInfo.Portrait', avatarUrl);

        this.get('avatar').updateAvatar(avatarUrl);
      });
  },

  _hasChange() {
    const { firstName, lastName, userName, email } = this.get('formValue');
    if(firstName.trim() !== this.get('userInfo.FirstName')) return true;
    if(lastName.trim() !== this.get('userInfo.LastName')) return true;
    if(userName.trim() !== this.get('userInfo.Name')) return true;
    if(email.trim() !== this.get('userInfo.UserEmail')) return true;
    return false;
  },

  _updateDisabled() {
    const hasAlert = get(this, 'verifyField').hasAlert(get(this, 'alert'));
    if (hasAlert) {
      set(this, 'disabled.info', true);
      this.setIsSaved(false);
    } else if(this._hasChange()) {
      set(this, 'disabled.info', false);
      this.setIsSaved(false);
    } else {
      set(this, 'disabled.info', true);
      this.setIsSaved(true);
    }
  },

  _verify(field) {
    const isAlert = !this.get('verifyField').test(field, this.get(`formValue.${field}`));
    this.set(`alert.${field}`, isAlert);
    this._updateDisabled();
  },

  actions: {
    updateUserInfo() {
      this.get('ajax').post(`${config.API_ENDPOINT}/UM/ModifyUserInfo`, {
        data: {
          name: this.get('formValue.userName'),
          firstname: this.get('formValue.firstName'),
          lastname: this.get('formValue.lastName'),
          email: this.get('formValue.email')
        }
      })
        .then(() => {
          this.set('disabled.info', true);
          this.get('cformNotification').show({
            color: 'green', icon: 'ui-round-e-info', label: 'Saved'
          });
          set(this, 'userInfo', {
            FirstName: get(this, 'formValue.firstName'),
            LastName: get(this, 'formValue.lastName'),
            Name: get(this, 'formValue.userName'),
            UserEmail: get(this, 'formValue.email')
          });
        });
    },

    changeLanguage() {
      const language = this.get('currentLanguage');
      document.querySelector('html').setAttribute('lang', language.toLowerCase());
      this.get('intl').setLocale(/zh-cn/i.test(language) ? 'zh-hans' : language);
    },

    selectDestinationLanguage(language) {
      set(this, "formValue.destinationLanguage", language);
      set(this, 'disabled.multiLanguage', language === get(this, 'currentLanguage'));
    },

    clickUploadButton() {
      this.$('#btn_Upload').click();
    },

    deleteAvatar() {
      this._updateAvatar('');
    },

    cancelUpload() {
      get(this, 'upload').cancel();
      set(this, 'isUploading', false);
      set(this, 'progress', 380);
    }
  }
});
