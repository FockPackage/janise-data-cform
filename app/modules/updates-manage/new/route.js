import Route from 'ember-route';
import inject from 'ember-service/inject';
import config from 'choice-dashboard/config/environment';
import RSVP from 'rsvp';
import get from 'ember-metal/get';
import set from 'ember-metal/set';

export default Route.extend({
  ajax: inject(),

  model() {
    return RSVP.hash({
      tagList: this.modelFor('updates-manage').tagList
    });
  },

  actions: {
    createAnnouncement(params) {
      const data = {
        title: params.title,
        describe: params.describe,
        tags: [params.tag],
        content: JSON.stringify(params.content),
        lang: params.lang
      }
      return this.get('ajax').post(`${config.DASHBOARD_API_ENDPOINT}/v1/announcements`, {
        data: data
      })
        .then(response => {
          const model = this.modelFor('updates-manage');
          const announcementList = get(model, 'announcementList');
          set(model, 'announcementList', [
            Object.assign(data, response), ...announcementList
          ]);
          this.transitionTo('updates-manage.updates.index', response.id);
        });
    }
  }
});
