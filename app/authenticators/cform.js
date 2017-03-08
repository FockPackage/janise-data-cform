import BaseAuthenticator from 'ember-simple-auth/authenticators/base';
import inject from 'ember-service/inject';
import config from 'choice-dashboard/config/environment';
import RSVP from 'rsvp';

export default BaseAuthenticator.extend({
  ajax: inject(),

  authenticate(email, password, initUserID = null) {
    return this.get('ajax').post(`${config.API_ENDPOINT}/Page/ValidateUser`, {
      data: { email, password, initUserID }
    })
      .then(response => {
        if(response.IsSuccess) {
          return response.Result;
        } else {
          throw response.Message;
        }
      });
  },

  restore(data) {
    return RSVP.resolve(data);
  }
});
