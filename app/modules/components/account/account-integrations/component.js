import Component from 'ember-component';
import computed from 'ember-computed';
import observer from 'ember-metal/observer';
import inject from 'ember-service/inject';
import get from 'ember-metal/get';

export default Component.extend({
  verifyField: inject('cform-verify-field'),

  disabled: { save: true },
  error: {},
  formValue: computed('callbackList', function() {
    const { QuesComplete, ScreenOutUrl, QuotafullUrl } = get(this, 'callbackList');
    return { collectComplete: QuesComplete, screenOut: ScreenOutUrl, quotaFull: QuotafullUrl }
  }),
  collectCompleteObserver: observer('formValue.collectComplete', function() {
    this._verify('website', 'collectComplete');
  }),
  screenOutObserver: observer('formValue.screenOut', function() {
    this._verify('website', 'screenOut');
  }),
  quotaFullObserver: observer('formValue.quotaFull', function() {
    this._verify('website', 'quotaFull');
  }),

  _hasChange() {
    const { collectComplete, screenOut, quotaFull } = this.get('formValue');
    if (collectComplete.trim() !== this.get('callbackList.QuesComplete')) return true;
    if (screenOut.trim() !== this.get('callbackList.ScreenOutUrl')) return true;
    if (quotaFull.trim() !== this.get('callbackList.QuotafullUrl')) return true;
    return false;
  },

  _updateDisabled() {
    const hasAlert = get(this, 'verifyField').hasAlert(get(this, 'error'));
    if(hasAlert) {
      this.set('disabled.save', true);
      this.setIsSaved(false);
    } else if(this._hasChange()) {
      this.set('disabled.save', false);
      this.setIsSaved(false);
    } else {
      this.set('disabled.save', true);
      this.setIsSaved(true);
    }
  },

  _verify(field, key) {
    const isError = !this.get('verifyField').test(field, this.get(`formValue.${key}`));
    this.set(`error.${key}`, isError);
    this._updateDisabled();
  }
});
