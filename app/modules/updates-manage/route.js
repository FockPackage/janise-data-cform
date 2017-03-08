import Route from 'ember-route';
import inject from 'ember-service/inject';
import config from 'choice-dashboard/config/environment';
import RSVP from 'rsvp';
import get from 'ember-metal/get';
import set from 'ember-metal/set';
import { A } from 'ember-array/utils';

export default Route.extend({
  session: inject(),
  ajax: inject(),
  loadingSlider: inject(),
  bodyScroll: inject('cform-body-scroll'),
  page: 1,

  renderTemplate() {
    this._super(...arguments);
    this.render('updates-manage/subnav', { outlet: 'subnav' });
  },

  model() {
    return RSVP.hash({ announcementList: this._getAnnouncementList() })
      .then(hash => {
        return Object.assign({}, hash, {
          announcementList: A(hash.announcementList.announcements),
          meta: hash.announcementList.meta,
          tagList: ["All", "Update", "Bugfix", "Feature", "Light-Feature"],
          isShow: { deleteConfirm: false, publishConfirm: false }
        });
      });
  },

  _getAnnouncementList(page = 1, per = 10) {
    return this.get('ajax').request(`${config.DASHBOARD_API_ENDPOINT}/v1/announcements/all`, {
      data: { page, per, lang: document.querySelector('html').getAttribute('lang'),
        token: this.get('session.data.authenticated.Token') }
    })
      .then(response => {
        response.announcements = response.announcements.map(announcement => {
          announcement.isHideDescription = true;
          return announcement;
        });
        return response;
      });
  },

  actions: {
    togglePublish() {
      const id = get(this, 'announcementId');
      return this.get('ajax').patch(`${config.DASHBOARD_API_ENDPOINT}/v1/announcements/${id}/toggle_publish`, {
        data: { token: this.get('session.data.authenticated.Token') }
      })
        .then(() => {
          const announcementList = get(this, 'currentModel.announcementList').map(announcement => {
            if (announcement.id === id) {
              set(announcement, 'published_at', announcement.published_at ? null : new Date());
            }
            return announcement;
          });
          set(this, 'currentModel.announcementList', announcementList);

          get(this, 'actions.toggleModal').call(this, 'publishConfirm');
        });
    },

    copyAnnouncementList() {

    },

    deleteAnnouncement() {
      const id = get(this, 'announcementId');
      return this.get('ajax').delete(`${config.DASHBOARD_API_ENDPOINT}/v1/announcements/${id}`)
        .then(() => {
          const announcementList = get(this, 'currentModel.announcementList').filter(announcement => {
            return announcement.id !== id;
          });
          set(this, 'currentModel.announcementList', announcementList);

          get(this, 'actions.toggleModal').call(this, 'deleteConfirm');
        });
    },

    toggleModal(type, id = null) {
      const key = `currentModel.isShow.${type}`
      set(this, key, !get(this, key));

      const announcement = get(this, 'currentModel.announcementList').findBy('id', id);
      if (announcement) {
        set(this, 'currentModel.isPublished', announcement.published_at);
        set(this, 'announcementId', id);
      }
      this.get('bodyScroll').toggle();
    },

    clickBackground(type, e) {
      if (e.target.className === 'static-background') {
        this.get('actions').toggleModal.call(this, type);
      }
    },

    selectAnnouncement(id) {
      const announcementList = get(this, 'currentModel.announcementList').map(announcement => {
        set(announcement, 'isSelected', announcement.id === id);
        return announcement;
      });
      set(this, 'currentModel.announcementList', announcementList);
      this.transitionTo('updates-manage.updates.index', id);
    },

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
    },

    searchAnnouncement() {
      console.log('search announcement');  // eslint-disable-line no-console
    },

    filterByTag(tag) {
      console.log(tag);  // eslint-disable-line
    }
  }
});
