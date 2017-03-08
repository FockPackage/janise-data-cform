import Component from 'ember-component';
import inject from 'ember-service/inject';
import computed from 'ember-computed';
import observer from 'ember-metal/observer';
import get from 'ember-metal/get';

export default Component.extend({
  ajax: inject('cform-ajax'),
  verifyField: inject('cform-verify-field'),
  cformNotification: inject('cform-notification'),

  disabled: true,
  alert: {},
  formValue: computed('invoiceInfo', function() {
    const invoiceInfo = get(this, 'invoiceInfo');
    return {
      companyName: invoiceInfo.ComName,
      invoiceContent: invoiceInfo.InvoiceContent,
      taxpayerNumber: invoiceInfo.TaxID,
      registerAddress: invoiceInfo.RegAddress,
      registerPhone: invoiceInfo.RegPhone,
      bankName: invoiceInfo.Bank,
      bankAccount: invoiceInfo.BankAccount,
      addressee: invoiceInfo.AcceptName,
      contactAddress: invoiceInfo.AcceptAddress,
      contactPhone: invoiceInfo.AcceptPhone
    }
  }),
  companyNameObserver: observer('formValue.companyName', function() {
    this._verify('companyName');
  }),

  _hasChange() {
    const {
      companyName,
      invoiceContent,
      taxpayerNumber,
      registerAddress,
      registerPhone,
      bankName,
      bankAccount,
      addressee,
      contactAddress,
      contactPhone
    } = this.get('formValue');
    if(companyName.trim() !== get(this, 'invoiceInfo.ComName')) return true;
    if(invoiceContent !== get(this, 'invoiceInfo.InvoiceContent')) return true;
    if(taxpayerNumber.trim() !== get(this, 'invoiceInfo.TaxID')) return true;
    if(registerAddress.trim() !== get(this, 'invoiceInfo.RegAddress')) return true;
    if(registerPhone.trim() !== get(this, 'invoiceInfo.RegPhone')) return true;
    if(bankName.trim() !== get(this, 'invoiceInfo.Bank')) return true;
    if(bankAccount.trim() !== get(this, 'invoiceInfo.BankAccount')) return true;
    if(addressee.trim() !== get(this, 'invoiceInfo.AcceptName')) return true;
    if(contactAddress.trim() !== get(this, 'invoiceInfo.AcceptAddress')) return true;
    if(contactPhone.trim() !== get(this, 'invoiceInfo.AcceptPhone')) return true;
    return false;
  },

  _updateDisabled() {
    const hasAlert = get(this, 'verifyField').hasAlert(get(this, 'alert'));
    if(hasAlert) {
      this.set('disabled', true);
      this.setIsSaved(false);
    } else if(this._hasChange()) {
      this.set('disabled', false);
      this.setIsSaved(false);
    } else {
      this.set('disabled', true);
      this.setIsSaved(true);
    }
  },

  _verify(field) {
    const isAlert = !this.get('verifyField').test(field, this.get(`formValue.${field}`));
    this.set(`alert.${field}`, isAlert);
    this._updateDisabled();
  },

  actions: {
    changeInvoiceContent(id) {
      this.set('formValue.invoiceContent', id);
      this._updateDisabled();
    }
  }
});
