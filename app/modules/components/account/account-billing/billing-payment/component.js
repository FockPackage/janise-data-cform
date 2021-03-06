import Ember from 'ember';
import inject from 'ember-service/inject';
import config from 'choice-dashboard/config/environment';
import set from 'ember-metal/set';

export default Ember.Component.extend({
  session: inject(),
  ajax: inject('cform-ajax'),
  isLoding: false,

  init() {
    this._super(...arguments);

    this._getData();
  },

  _getData() {
    set(this, 'isLoding', true);
    this._getCurrentCompany({ encryptedCompanyId: localStorage.getItem('encryptedCompanyId') })
      .then(response => {
        const currentCompany = response.Result;
        this.set('currentCompany', currentCompany);
        const companyId = currentCompany.CurrentCompanyInfo.CompanyID;
        return this._getPaymentHistory({ companyId });
      })
      .then(response => {
        set(this, 'isLoding', false);
        set(this, 'paymentHistory', response.Result);
      })
  },

  _getCurrentCompany(params) {
    return this.get('ajax').request(`${config.API_ENDPOINT}/AM/GetCurrentCompanyInfo`, {
      data: {
        selectCompanyID: params.encryptedCompanyId,
        language: params.language || 'cn'
      }
    });
  },

  _getPaymentHistory(params = {}) {
    return this.get('ajax').request(`${config.API_ENDPOINT}/AM/PaymentHistory`, {
      data: {
        orgID: params.companyId,
        lan: params.language || 'cn',
        pageindex: params.index || 0,
        size: 10,
        sort: null
      }
    });
  },

  actions: {
    loadMore() {
      set(this, 'isLoding', true);
      const companyId = this.get('currentCompany.CurrentCompanyInfo.CompanyID');
      const index = this.get('paymentHistory.ListInfo').length / 10;
      this._getPaymentHistory({ companyId, index })
        .then(response => {
          set(this, 'isLoding', true);
          set(this, 'paymentHistory', response.Result);
        })
    }
  }
});
