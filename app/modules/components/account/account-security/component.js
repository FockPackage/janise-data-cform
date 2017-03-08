import Ember from 'ember';
import inject from 'ember-service/inject';
import config from 'choice-dashboard/config/environment';
import observer from 'ember-metal/observer';
import get from 'ember-metal/get';
import set from 'ember-metal/set';

export default Ember.Component.extend({
  ajax: inject('cform-ajax'),
  verifyField: inject('cform-verify-field'),
  cformNotification: inject('cform-notification'),

  disabled: true,
  alert: {},
  formValue: { currentPassword: '', newPassword: ''},
  currentPasswordObserver: observer('formValue.currentPassword', function() {
    this._verify('password', 'currentPassword');
  }),
  newPasswordObserver: observer('formValue.newPassword', function() {
    this._verify('password', 'newPassword');
  }),

  _updateDisabled() {
    const hasAlert = get(this, 'verifyField').hasAlert(get(this, 'alert'));
    if (hasAlert) {
      set(this, 'disabled', true);
    } else {
      set(this, 'disabled', false);
    }
  },

  _verify(field, key) {
    const isAlert = !this.get('verifyField').test(field, this.get(`formValue.${key}`));
    this.set(`alert.${key}`, isAlert);
    this._updateDisabled();
  },

  actions: {
    updatePassword() {
      this.get('ajax').post(`${config.API_ENDPOINT}/UM/PasswordSet`, {
        data: {
          oldPassword: this.get('formValue.currentPassword'),
          newpassword: this.get('formValue.newPassword')
        }
      })
        .then(() => {
          this.get('cformNotification').show({
            color: 'green', icon: 'ui-round-e-info', label: 'Success!'
          });
          this.set('formValue', { currentPassword: '', newPassword: '' });
        })
        .catch(error => {
          if (error === 'Msg_LoginPSWError') {
            this.get('cformNotification').show({
              color: 'red', icon: 'ui-round-e-info', label: '当前密码错误'
            });
            this.set('formValue', { currentPassword: '', newPassword: '' });
          } else {
            console.log(error)  // eslint-disable-line no-console
          }
        });
    }
  }
});
