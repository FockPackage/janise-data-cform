import Controller from 'ember-controller';
import inject from 'ember-service/inject';
import config from 'choice-dashboard/config/environment';
import set from 'ember-metal/set';
import get from 'ember-metal/get';
import computed from 'ember-computed';
import observer from 'ember-metal/observer';
import { later } from 'ember-runloop';

export default Controller.extend({
  ajax: inject('cform-ajax'),
  session: inject(),
  verifyField: inject('cform-verify-field'),

  formValue: { email: localStorage.getItem('email'), password: '' },
  error: { email: '', password: '' },
  checked: computed(function() {
    return !!get(this, 'formValue.email');
  }),

  emailObserver: observer('formValue.email', function() {
    const email = get(this, 'formValue.email').trim();
    if (email) {
      set(this, 'error.email', !this.get('verifyField').test('email', email));
    }
  }),

  passwordObserver: observer('formValue.password', function() {
    set(this, 'error.password', false);
  }),

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

  actions: {
    login() {
      const { email, password } = this.get('formValue');
      this.get('session')
        .authenticate('authenticator:cform', email, password)
        .then(() => this._getSomethingEncryption())
        .then(response => {
          localStorage.setItem('somethingEncryption', JSON.stringify(response.Result));
          this.transitionToRoute('index');
          later(this, () => {
            if(this.get('checked')) {
              localStorage.setItem('email', this.get('formValue.email'));
            } else {
              localStorage.removeItem('email');
              set(this, 'formValue.email', '');
            }
            set(this, 'formValue.password', '');
          }, 1000);
        })
        .catch(reason => {
          if (reason === 'Msg_UserOrPSWError') {
            set(this, 'error.password', true);
          }
          console.log(reason)  // eslint-disable-line no-console
        });
    }
  }
});
