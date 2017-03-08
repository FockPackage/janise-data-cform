import Service from 'ember-service';
import inject from 'ember-service/inject';
import config from 'choice-dashboard/config/environment';

export default Service.extend({
  ajax: inject('cform-ajax'),
  url: null,

  getAvatar() {
    this.get('ajax').request(`${config.API_ENDPOINT}/UM/GetUserPic`)
      .then(response => {
        this.set('url', response.Result.Portrait);
      });
  },

  updateAvatar(url) {
    this.set('url', url);
  }
});
