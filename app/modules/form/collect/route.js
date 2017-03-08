import Ember from 'ember';
import config from 'choice-dashboard/config/environment';
import inject from 'ember-service/inject';
import RSVP from 'rsvp';
import set from 'ember-metal/set';
import get from 'ember-metal/get';

export default Ember.Route.extend({
  ajax: inject('cform-ajax'),
  cformNotification: inject('cform-notification'),

  beforeModel(transition) {
    set(this, 'formId', transition.params['form'].id);
  },

  model() {
    const formId = get(this, 'formId');
    return RSVP.hash({
      formId: formId,
      loading: false,
      qrCode: {},
      publishInfo: this._getPublishInfo(formId)
    });
  },

  _getPublishInfo(formId) {
    return this.get('ajax').request(`${config.API_ENDPOINT}/QM/GetPublishInfo`, {
      data: { dayForLang: '天', quesID: formId }
    })
      .then(response => response.Result);
  },

  _getCollectorId() {
    const channelList = this.get('currentModel.publishInfo.collChannel');
    return channelList[0] ? channelList[0].CollectorID : null;
  },

  _updateCollectConfig(params, isPublish = null) {
    const {
      startDate, startTimeHour, startTimeMinute, endDate, endTimeHour, endTimeMinute
    } = params;

    const formId = get(this, 'formId')
    return this.get('ajax').post(`${config.API_ENDPOINT}/QM/SavePublishInfo`, {
      data: {
        collID: this._getCollectorId(),
        quesID: formId,
        auotaID: null,
        publishCount: params.maximumResponse,
        startDate: `${startDate} ${startTimeHour}:${startTimeMinute}`,
        endDate: `${endDate} ${endTimeHour}:${endTimeMinute}`,
        publishType: params.isAutoPublish ? 1 : 2,
        terLinmitFlag: params.isAnonymous ? 'N' : 'Y',
        anonymousFalg: 'N',
        returnPreFlag: 'Y',
        microLetterChannel: 'N',
        microServiceName: null,
        appID: null,
        microNum: null,
        appSecrt: null,
        oauth: null,
        isFocus: null,
        collect: 'N',
        btnType: isPublish,
        parameterFlag: params.hasLinkParameters ? 'Y' : 'N',
        timeLimitFlag: params.isUnlimitedTime ? 'N' : 'Y',
        qtyLimitFlag: params.isUnlimitedResponse ? 'N' : 'Y',
        isValidatePwd: false,
        language: 'cn',
        password: null,
        writeOffStartDate: "2016/9/5 15:30",
        writeOffEndDate: "2016/9/12 15:30"
      }
    })
      .then(() => this._getPublishInfo(formId))
      .then(response => {
        set(this, 'currentModel.publishInfo', response);

        const label = isPublish ? 'Published' : 'Saved';
        get(this, 'cformNotification').show({
          color: 'green', icon: 'ic light ic-info-2', label: label
        });

        set(this, 'currentModel.loading', false);
      });
  },

  _cutoffForm() {
    this.get('ajax').post(`${config.API_ENDPOINT}/QM/CanclePublish`, {
      data: { collID: this._getCollectorId() }
    })
      .then(() => {
        set(this, 'currentModel.publishInfo.onLineFlag', false);

        get(this, 'cformNotification').show({
          color: 'green', icon: 'ic light ic-info-2', label: 'Cutoff'
        });

        set(this, 'currentModel.loading', false);
      });
  },

  _verifyWechatConfig(params) {
    this._getPublishInfo(get(this, 'formId'));
    return this.get('ajax').request(`${config.API_ENDPOINT}/WeChat/WeCharValidation`, {
      data: {
        channelID: params.channelId,
        collID: this._getCollectorId(),
        appid: params.appId,
        secret: params.appSecret
      }
    })
      .then(response => {
        set(this, 'redirectURI.wechat', response.Result.redirect_uri);
        get(this, 'cformNotification').show({
          color: 'green', icon: 'ic light ic-info-2', label: '验证并保存成功'
        });
      })
      .catch(error => {
        if (error === 'BMsg_InputIncorrect') {
          get(this, 'cformNotification').show({
            color: 'red',
            icon: 'ic light ic-info-2',
            label: '信息已保存，输入的内容不正确，验证失败'
          });
        } else {
          console.log(error);  // eslint-disable-line no-console
        }
      });
  },

  actions: {
    togglePublish(params, isPublished) {
      set(this, 'currentModel.loading', true);
      if (isPublished) {
        this._cutoffForm();
      } else {
        this._updateCollectConfig(params, 'publish');
      }
    },

    updateCollectConfig(params) {
      this._updateCollectConfig(params);
    },

    updateWechatConfig(params) {
      this.get('ajax').post(`${config.API_ENDPOINT}/QM/WechatSave`, {
        data: {
          collID: this._getCollectorId(),
          quesID: get(this, 'formId'),
          microServiceName: params.name,
          microNum: params.number,
          appID: params.appId,
          appSecrt: params.appSecret,
          oauth: null,
          isFocus: null,
          collect: params.collect ? 'Y' : 'N'
        }
      })
        .then(response => {
          params.channelId = response.Result.wechatChannelID;
          this._verifyWechatConfig(params);
        })
    },

    getWechatQRCode() {
      const formId = get(this, 'formId');
      this.get('ajax').request(`${config.API_ENDPOINT}/QM/DownLoadQRCode`, {
        data: {
          linkSuffix: formId,
          qrCodeType: 'Wechat',
          quesID: formId,
          redirect_uri: get(this, 'redirectURI.wechat')
        }
      })
        .then(response => {
          set(this, 'currentModel.qrCode.wechat', response.Result.StrPath)
        });
    }
  }
});
