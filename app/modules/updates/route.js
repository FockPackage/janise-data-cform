import Route from 'ember-route';
import inject from 'ember-service/inject';
import config from 'choice-dashboard/config/environment';
import RSVP from 'rsvp';
import { A } from 'ember-array/utils';
import set from 'ember-metal/set';
import get from 'ember-metal/get';

export default Route.extend({
  ajax: inject(),
  intl: inject(),
  loadingSlider: inject(),
  page: 1,

  renderTemplate() {
    this._super(...arguments);
    this.render('updates/subnav', { outlet: 'subnav' });
  },

  model() {
    return RSVP.hash({
      announcementList: this._getAnnouncementList()
    })
      .then(hash => {
        return Object.assign({}, hash, {
          announcementList: A(hash.announcementList.announcements), meta: hash.announcementList.meta
        });
      });
  },

  _getAnnouncementList(page = 1, per = 10) {
    return this.get('ajax').request(`${config.DASHBOARD_API_ENDPOINT}/v1/announcements`, {
      data: { page, per, lang: document.querySelector('html').getAttribute('lang') }
    });
  },

  actions: {
    loadMore() {
      this.get('loadingSlider').startLoading();
      const page = this.incrementProperty('page');
      this._getAnnouncementList(page)
        .then(response => {
          set(this, 'currentModel.announcementList', [
            ...get(this, 'currentModel.announcementList'),
            ...response.announcements
          ]);
          set(this, 'currentModel.meta', response.meta);
          this.get('loadingSlider').endLoading();
        })
        .catch(() => {
          this.notification.error('网络错误！');
          this.decrementProperty('page');
        });
    }
  }
});
