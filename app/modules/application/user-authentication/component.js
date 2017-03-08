import Component from 'ember-component';
import inject from 'ember-service/inject';
import config from 'choice-dashboard/config/environment';
import set from 'ember-metal/set';

export default Component.extend({
  tagName: '',

  ajax: inject('cform-ajax'),
  session: inject(),
  verifyField: inject('cform-verify-field'),
  loginModal: inject('cform-login-modal'),
  formValue: { email: '', password: '', checked: false },
  alert: { email: true, password: true },
  disabled: true,

  init() {
    this._super(...arguments);

    const email = localStorage.getItem('email');
    if(email) {
      this.set('formValue.email', email);
      this.set('alert.email', false);
      this.set('formValue.checked', true);
    }
  },

  _getSomethingEncryption() {
    const { UserID, UserName } = this.get('session.data.authenticated');
    return this.get('ajax').request(`${config.API_ENDPOINT}/Common/Encryption`, {
      data: {
        UserID: UserID,
        Username: UserName,
        SortType: "",
        SortName: "",
        SelectFolderID: "",
        SelectCompanyID: "",
        SelectCompanyName: ""
      }
    });
  },

  _updateDisabled() {
    if(this.get('verifyField').hasAlert(this.get('alert'))) {
      this.set('disabled', true);
    } else {
      this.set('disabled', false);
    }
  },

  actions: {
    login() {
      const { email, password } = this.get('formValue');
      this.get('session')
        .authenticate('authenticator:cform', email, password)
        .then(() => this._getSomethingEncryption())
        .then(response => {
          this.get('loginModal').close();
          localStorage.setItem('SomethingEncryption', JSON.stringify(response.Result));
        })
        .catch(reason => console.log(reason));  // eslint-disable-line no-console

      if(this.get('formValue.checked')) {
        localStorage.setItem('email', this.get('formValue.email'));
      } else {
        localStorage.clear('email', this.get('formValue.email'));
        set(this, 'formValue.email', '');
      }
      set(this, 'formValue.password', '');
    },

    verify(field) {
      const isAlert = !this.get('verifyField').test(field, this.get(`formValue.${ field }`));
      this.set(`alert.${ field }`, isAlert);
      this._updateDisabled();
    }
  }
});
