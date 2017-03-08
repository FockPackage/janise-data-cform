import Route from 'ember-route';
import inject from 'ember-service/inject';
import config from 'choice-dashboard/config/environment';
import RSVP from 'rsvp';
import get from 'ember-metal/get';
import set from 'ember-metal/set';

export default Route.extend({
  session: inject(),
  ajax: inject(),
  loadingSlider: inject(),

  beforeModel(transition) {
    set(this, 'id', transition.params['updates-manage.updates'].id)
  },

  model() {
    return RSVP.hash({
      announcement: this._getAnnouncement(get(this, 'id'))
    });
  },

  _getAnnouncement(id) {
    return this.get('ajax').request(`${config.DASHBOARD_API_ENDPOINT}/v1/announcements/${id}/show_all`, {
      data: {
        token: this.get('session.data.authenticated.Token')
      }
    })
      .then(response => response.announcement);
  },

  actions: {
    getAnnouncement(id) {
      this.get('loadingSlider').startLoading();
      return this._getAnnouncement(id).then(announcement => {
        set(this, 'currentModel.announcement', announcement);
        this.get('loadingSlider').endLoading();
      });
    }
  }
});
