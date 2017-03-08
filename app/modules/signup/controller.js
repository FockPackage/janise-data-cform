import Controller from 'ember-controller';
import inject from 'ember-service/inject';
import config from 'choice-dashboard/config/environment';

export default Controller.extend({
  ajax: inject(),
  verifyField: inject('cform-verify-field'),
  formValue: { email: '', password: '' },
  alert: { email: true, password: true },

  actions: {
    signup() {
      return this.get('ajax').post(`${config.API_ENDPOINT}/Page/RegisteredUser`, {
        data: {
          email: this.get('formValue.email'),
          password: this.get('formValue.password'),
          name: this.get('formValue.email'),
          inviteEmail: null,
          inviteCode: null,
          path: "/Content/email/welcome.html",
          subject: 'choice form',
          lang: 'cn'
        }
      })
      .then(response => {
        if(response.IsSuccess) {
          // this.transitionToRoute('index');
        } else {
          console.log(response.Message)  // eslint-disable-line no-console
        }
      })
    }
  }
});
