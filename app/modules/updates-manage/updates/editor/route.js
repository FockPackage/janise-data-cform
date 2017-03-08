import Route from 'ember-route';
import inject from 'ember-service/inject';
import config from 'choice-dashboard/config/environment';
import RSVP from 'rsvp';
import get from 'ember-metal/get';
import set from 'ember-metal/set';

export default Route.extend({
  session: inject(),
  ajax: inject(),

  beforeModel(transition) {
    set(this, 'id', transition.params['updates-manage.updates'].id)
  },

  model() {
    const tagList = this.modelFor('updates-manage').tagList;
    return RSVP.hash({
      announcement: this._getAnnouncement(get(this, 'id')),
      tagList
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
    updateAnnouncement(id, params) {
      const data = {
        title: params.title,
        describe: params.describe,
        tags: [params.tag],
        content: JSON.stringify(params.content)
      }
      return this.get('ajax').patch(`${config.DASHBOARD_API_ENDPOINT}/v1/announcements/${id}`, {
        data: data
      })
        .then(() => {
          const model = this.modelFor('updates-manage');
          set(model, 'announcementList', get(model, 'announcementList').map(announcement => {
            if (announcement.id === id) {
              return Object.assign(data, { id, published_at: announcement.published_at });
            }
            return announcement;
          }));
          this.transitionTo('updates-manage.updates.index', id)
        });
    },

    createMultiLanguageAnnouncement(params) {
      const lang = params.lang;
      const data = {
        title: params.title,
        describe: params.describe,
        tags: [params.tag],
        content: JSON.stringify(params.content),
        origin: get(this, 'id'),
        lang: lang
      }
      return this.get('ajax').post(`${config.DASHBOARD_API_ENDPOINT}/v1/announcements`, {
        data: data
      })
        .then(response => {
          const id = response.id;
          const languageList = get(this, 'currentModel.announcement.languages');
          set(this, 'currentModel.announcement.languageList', languageList.push({ lang, id }));
          this.transitionTo('updates-manage.updates.index', id);
        });
    }
  }
});
