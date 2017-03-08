import Route from 'ember-route';
import inject from 'ember-service/inject';
import config from 'choice-dashboard/config/environment';
import RSVP from 'rsvp';
import set from 'ember-metal/set';
import get from 'ember-metal/get';

export default Route.extend({
  ajax: inject('cform-ajax'),
  bodyScroll: inject('cform-body-scroll'),
  isSaved: true,

  model() {
    return RSVP.hash({
      invoiceInfo: this._getInvoiceInfo(),
      isShowConfirm: false
    });
  },

  afterModel() {
    this._super(...arguments);
    this.transitionTo('account.billing.payment-history');
  },

  _getInvoiceInfo() {
    return this.get('ajax').request(`${config.API_ENDPOINT}/UC/GetUCInvoiceInfoObject`)
      .then(response => response.Result.Info)
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

    updateInvoicingInfo(params) {
      this.get('ajax').post(`${config.API_ENDPOINT}/UC/SaveUCInvoiceInfo`, {
        data: {
          comName: params.companyName,
          invoiceType: 2,
          invoiceContent: params.invoiceContent,
          taxID: params.taxpayerNumber,
          regAddress: params.registerAddress,
          regPhone: params.registerPhone,
          bank: params.bankName,
          bankAccount: params.bankAccount,
          acceptName: params.addressee,
          acceptAddress: params.contactAddress,
          acceptPhone: params.contactPhone
        }
      })
        .then(() => {
          set(this, 'currentModel.invoiceInfo', {
            ComName: params.companyName,
            InvoiceContent: params.invoiceContent,
            TaxID: params.taxpayerNumber,
            RegAddress: params.registerAddress,
            RegPhone: params.registerPhone,
            Bank: params.bankName,
            BankAccount: params.bankAccount,
            AcceptName: params.addressee,
            AcceptAddress: params.contactAddress,
            AcceptPhone: params.contactPhone
          });
          this.get('notification').success('Saved');
        })
        .catch(() => {
          this.get('notification').error('错误');
        });
    },
  }
});
