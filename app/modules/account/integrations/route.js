import Route from 'ember-route';
import RSVP from 'rsvp';
import inject from 'ember-service/inject';
import config from 'choice-dashboard/config/environment';
import set from 'ember-metal/set';
import get from 'ember-metal/get';

export default Route.extend({
  ajax: inject('cform-ajax'),
  bodyScroll: inject('cform-body-scroll'),
  isSaved: true,

  model() {
    return RSVP.hash({
      callbackList: this._getCallbackList(),
      isShowConfirm: false
    });
  },

  _getCallbackList() {
    return this.get('ajax').request(`${config.API_ENDPOINT}/UM/GetDataTransfer`, {
      data: { strcompanyID: null }
    })
      .then(response => response.Result)
      .catch(error => console.log(error));  // eslint-disable-line no-console
  },

  actions: {
    willTransition(transition) {
      this._super(...arguments);
      if (!get(this, 'isSaved')) {
        this.get('actions').toggleModal.call(this);
        set(this, 'targetName', transition.targetName);
        transition.abort();
      }
    },

    goToTarget() {
      set(this, 'isSaved', true);
      this.get('actions').toggleModal.call(this, false);
      this.transitionTo(get(this, 'targetName'));
    },

    setIsSaved(params) {
      set(this, 'isSaved', params);
    },

    toggleModal() {
      this.toggleProperty('currentModel.isShowConfirm');
      this.get('bodyScroll').toggle();
    },

    clickBackground(e) {
      if (e.target.className === 'static-background') {
        this.get('actions').toggleModal.call(this);
      }
    },

    updateCallbackList(params) {
      return this.get('ajax').post(`${config.API_ENDPOINT}/UM/DataTransferSet`, {
        data: {
          QuesComplete: params.collectComplete,
          ScreenOut: params.screenOut,
          Quotafull: params.quotaFull,
          CompanyID: null
        }
      })
        .then(() => {
          this.set('currentModel.callbackList', {
            QuesComplete: params.collectComplete,
            ScreenOutUrl: params.screenOut,
            QuotafullUrl: params.quotaFull
          });
          this.get('notification').success('Saved');
        })
        .catch(error => console.log(error));  // eslint-disable-line no-console
    }
  }
});
