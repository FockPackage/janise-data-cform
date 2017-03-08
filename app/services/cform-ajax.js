import AjaxService from 'ember-ajax/services/ajax';
import inject from 'ember-service/inject';
import { isNone } from 'ember-utils';

export default AjaxService.extend({
  session: inject(),
  isShow: false,
  loginModal: inject('cform-login-modal'),

  request(url, options = {}) {
    if (isNone(options.data)) options.data = {}
    options.data.token = this.get('session.data.authenticated.Token');
    return this._super(url, options)
      .then(response => {
        if (response.IsSuccess) {
          return response;
        } else {
          if (response.Result && !response.Result.Islogin) {
            this.get('loginModal').open();
            return response;
          } else {
            throw response.Message;
          }
        }
      });
  },

  post(url, options) {
    if (isNone(options.data)) options.data = {}
    options.data.token = this.get('session.data.authenticated.Token');
    return this._super(url, options)
      .then(response => {
        if (response.IsSuccess) {
          return response;
        } else {
          if (response.Result && !response.Result.Islogin) {
            this.get('loginModal').open();
            return response;
          } else {
            throw response.Message;
          }
        }
      });
  }
});
