import Component from 'ember-component';
import set from 'ember-metal/set';
import { equal } from 'ember-computed';

export default Component.extend({
  tagName: '',
  hasCouponCode: false,
  paymentMethod: 'credit',
  useCredit: equal('paymentMethod', 'credit'),
  usePaypal: equal('paymentMethod', 'paypal'),
  useAlipay: equal('paymentMethod', 'alipay'),
  useWechat: equal('paymentMethod', 'wechat'),

  actions: {
    changePaymentMethod(value) {
      set(this, 'paymentMethod', value);
    }
  }
});
