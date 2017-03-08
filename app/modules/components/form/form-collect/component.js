import Component from 'ember-component';
import inject from 'ember-service/inject';
import computed, { reads } from 'ember-computed';
import get from 'ember-metal/get';
import set from 'ember-metal/set';
import observer from 'ember-metal/observer';
import { A } from 'ember-array/utils';

export default Component.extend({
  ajax: inject('cform-ajax'),
  verifyField: inject('cform-verify-field'),
  globalLoading: inject('cform-global-loading'),
  bodyScroll: inject('cform-body-scroll'),

  formValue: { wechat: {}, collect: {}, quotaList: [] },
  alert: { wechat: { name: true, number: true, appID: true, appSecret: true }, collect: {} },
  disabled: { collect: true, wechat: true, verify: true },
  isPublished: reads('publishInfo.onLineFlag'),
  publishedClass: computed('isPublished', function() {
    return this.get('isPublished') ? `${ this.get("styles.published") }` : '';
  }),
  formUrl: computed('isPublished', function() {
    return get(this, 'isPublished') ? get(this, 'publishInfo.collChannel')[0].webPublishHref : null;
  }),
  isUpdateProhibition: computed('isPublished', function() {
    if (get(this, 'isPublished')) {
      const publishDateTime = get(this, 'publishInfo.collChannel')[0].DirectPublishDate;
      return new Date().getTime() - new Date(publishDateTime).getTime() > 0;
    }
    return false;
  }),
  isShow: false,
  currentQuota: { QuotaTableName: 'select-quota' },

  collectObserver: observer(
    'formValue.collect.maximumResponse',
    'formValue.collect.isUnlimitedResponse',
    'formValue.collect.isAutoPublish',
    'formValue.collect.isUnlimitedTime',
    'formValue.collect.isAnonymous',
    'formValue.collect.hasLinkParameters',
    'formValue.collect.startDate',
    'formValue.collect.startTimeHour',
    'formValue.collect.startTimeMinute',
    'formValue.collect.endDate',
    'formValue.collect.endTimeHour',
    'formValue.collect.endTimeMinute',
    function() {
      this._updateDisabled('collect');
    }
  ),

  wechatObserver: observer(
    'formValue.wechat.name',
    'formValue.wechat.number',
    'formValue.wechat.appId',
    'formValue.wechat.appSercet',
    function() {
      this._updateDisabled('wechat');
    }
  ),

  didReceiveAttrs() {
    this._super(...arguments);

    this._initFormValue();
    this._initDisabled();
  },

  _initDisabled() {
    if(this.get('publishInfo.errorMessage') !== '') {
      this.set('disabled.publish', true)
    }
  },

  _initFormValue() {
    const channelList = this.get('publishInfo.collChannel');
    if(channelList[0]) {
      const channel = channelList[0];
      const isAutoPublish = channel.PublishType === 1;
      const isUnlimitedTime = channel.TimeLimitFlag === 'N';
      const maximumResponse = channel.PublishCount === 0 ? 100 : channel.PublishCount;

      this.set('formValue.collect.maximumResponse', maximumResponse);
      this.set('formValue.collect.isUnlimitedResponse', channel.QtyLimitFlag === 'N');
      this.set('formValue.collect.isAutoPublish', isAutoPublish);
      this.set('formValue.collect.isUnlimitedTime', isUnlimitedTime);
      this.set('formValue.collect.isAnonymous', channel.TerLimitFlag === 'N');
      this.set('formValue.collect.hasLinkParameters', channel.ParameterFlag === 'Y');

      if (!isAutoPublish) {
        const [startDate, startTime] = [...channel.StartDate.split(' ')];
        const [startTimeHour, startTimeMinute] = [...startTime.split(':')];
        this.set('formValue.collect.startDate', startDate);
        this.set('formValue.collect.startTimeHour', +startTimeHour)
        this.set('formValue.collect.startTimeMinute', +startTimeMinute)
      }

      if (!isUnlimitedTime) {
        const [endDate, endTime] = [...channel.EndDate.split(' ')];
        const [endTimeHour, endTimeMinute] = [...endTime.split(':')];
        this.set('formValue.collect.endDate', endDate);
        this.set('formValue.collect.endTimeHour', +endTimeHour);
        this.set('formValue.collect.endTimeMinute', +endTimeMinute);
      }

      for(let i = 0; i < channelList.length; i++) {
        const channel = channelList[i];
        if(channel.Attribute2) {
          this.set('formValue.wechat.collect', channel.Attribute2 === 'Y');
          this.set('formValue.wechat.name', channel.Attribute3);
          this.set('formValue.wechat.number', channel.Attribute5);
          this.set('formValue.wechat.appId', channel.Attribute4);
          this.set('formValue.wechat.appSecret', channel.Attribute6);
          this.set('formValue.wechat.url', channel.Attribute7);

          this.set('alert.wechat', {});
        }
      }
    } else {
      const collect = {
        maximumResponse: 100,
        isUnlimitedResponse: false,
        isAutoPublish: true,
        isUnlimitedTime: true,
        isAnonymous: false,
        hasLinkParameters: false
      };
      const wechat = { collect: false };
      set(this, 'publishInfo.collChannel', [collect, wechat]);
      set(this, 'formValue', { collect, wechat });
    }
  },

  _hasChange(field) {
    if (field === 'collect') {
      const channel = this.get('publishInfo.collChannel')[0];
      const collect = get(this, 'formValue.collect');

      if (collect.isUnlimitedResponse !== (channel.QtyLimitFlag === 'N')) return true;
      if (collect.isAutoPublish !== (channel.PublishType === 1)) return true;
      if (collect.isUnlimitedTime !== (channel.TimeLimitFlag === 'N')) return true;
      if (collect.isAnonymous !== (channel.TerLimitFlag === 'N')) return true;
      if (collect.hasLinkParameters !== (channel.ParameterFlag === 'Y')) return true;

      if (!collect.isAutoPublish) {
        const publishDateTime = `${collect.startDate} ${collect.startTimeHour}:${collect.startTimeMinute}:00`
        if (publishDateTime !== channel.StartDate) return true;
      }

      if (!collect.isUnlimitedTime) {
        const cutoffDateTime = `${collect.endDate} ${collect.endTimeHour}:${collect.endTimeMinute}:00`
        if (cutoffDateTime !== channel.EndDate) return true;
      }
    } else if (field === 'wechat') {
      const wechat = get(this, 'formValue.wechat');
      if (wechat.collect === true) {
        const channelList = get(this, 'publishInfo.collChannel');
        for(let i = 0; i < channelList.length; i++) {
          const channel = channelList[i];
          if(channel.Attribute2) {
            if (wechat.name !== channel.Attribute3) return true;
            if (wechat.number !== channel.Attribute5) return true;
            if (wechat.appId !== channel.Attribute4) return true;
            if (wechat.appSecret !== channel.Attribute6) return true;
          }
        }
      }
    }
    return false;
  },

  _updateDisabled(field) {
    const hasAlert = get(this, 'verifyField').hasAlert(this.get(`alert.${field}`));
    if (hasAlert) {
      this.set(`disabled.${field}`, true);
    } else if (this._hasChange(field)){
      this.set(`disabled.${field}`, false);
    } else {
      this.set(`disabled.${field}`, true);
    }
  },

  _verify(field) {
    const isAlert = !this.get('verifyField').test(field, this.get(`formValue.wechat.${ field }`));
    this.set(`alert.wechat.${ field }`, isAlert);
    // this._updateDisabled();
  },

  actions: {
    setIsAutoPublish(value) {
      this.set('formValue.collect.isAutoPublish', value);
      if(!value) {
        const now = new Date();
        const [date, hour, minute] = [
          `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}`,
          now.getHours(),
          now.getMinutes()
        ];

        this.set('formValue.collect.startDate', date);
        this.set('formValue.collect.startTimeHour', +hour);
        this.set('formValue.collect.startTimeMinute', +minute);
      }
    },

    setIsUnlimitedTime(value) {
      this.set('formValue.collect.isUnlimitedTime', value);
      if (!value) {
        const now = new Date();
        const after = new Date(now.setDate(now.getDate() + 30));
        const [date, hour, minute] = [
          `${after.getFullYear()}-${after.getMonth() + 1}-${after.getDate()}`,
          after.getHours(),
          after.getMinutes()
        ];

        this.set('formValue.collect.endDate', date);
        this.set('formValue.collect.endTimeHour', hour);
        this.set('formValue.collect.endTimeMinute', minute);
      }
    },

    setIsAnonymous(value) {
      this.set('formValue.collect.isAnonymous', value);
    },

    changePublishDate(value) {
      this.set('formValue.collect.startDate', value);
    },

    changeCutoffDate(value) {
      this.set('formValue.collect.endDate', value);
    },

    toggleModal() {
      this.toggleProperty('isShow');
      if (get(this, 'isShow')) {
        get(this, 'getWechatQRCode')();
      }
      this.get('bodyScroll').toggle();
    },

    clickBackground(e) {
      if (e.target.className === 'static-background') {
        this.get('actions').toggleModal.call(this);
      }
    },

    selectQuota(id) {
      set(this, 'currentQuota', A(get(this, 'publishInfo.QuotaList')).findBy('QuotaTableID', id));
    }
  }
});
