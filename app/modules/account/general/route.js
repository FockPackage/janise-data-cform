import Route from 'ember-route';
import RSVP from 'rsvp';
import inject from 'ember-service/inject';
import config from 'choice-dashboard/config/environment';
import set from 'ember-metal/set';
import get from 'ember-metal/get';
import { A } from 'ember-array/utils';

export default Route.extend({
  ajax: inject('cform-ajax'),
  bodyScroll: inject('cform-body-scroll'),
  isSaved: true,

  model() {
    const facebookRedirectURI = encodeURIComponent(`${config.REDIRECT_HOST}/Home/WeChatLogin/`);
    const qqRedirectURI = encodeURIComponent(`${config.REDIRECT_HOST}/Home/QQLogin/`);
    const weiboRedirectURI = encodeURIComponent(`${config.REDIRECT_HOST}/Home/SinaLogin/`);
    const wecahtRedirectURI = encodeURIComponent(`${config.REDIRECT_HOST}/Home/WeChatLogin/`);

    return RSVP.hash({
      userInfo: this._getUserInfo(),
      confirm: { isShow: false, action: "goToTarget", content: '' },
      authList: A([
        {
          name: 'facebook',
          url: `https://open.weixin.qq.com/connect/qrconnect?appid=${config.WECHAT_APP_ID}&redirect_uri=${facebookRedirectURI}`,
          isBind: false
        },
        {
          name: 'qq',
          url: `https://graph.qq.com/oauth2.0/authorize?client_id=${config.QQ_CLIENT_ID}&state=94605&response_type=code&redirect_uri=${qqRedirectURI}`,
          isBind: true
        },
        {
          name: 'weibo',
          url: `https://api.weibo.com/oauth2/authorize?client_id=${config.WEIBO_CLIENT_ID}&response_type=code&redirect_uri=${weiboRedirectURI}`,
          isBind: false
        },
        {
          name: 'wechat',
          url: `https://open.weixin.qq.com/connect/qrconnect?appid=${config.WECHAT_APP_ID}&redirect_uri=${wecahtRedirectURI}`,
          isBind: false
        },
      ])
    });
  },

  _getUserInfo() {
    return this.get('ajax').request(`${config.API_ENDPOINT}/UM/GetUserInfo`)
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

    toggleModal(type, params) {
      if (type === 'unbindAuth' && params.isBind) {
        set(this, 'authName', params.name);
        set(this, 'currentModel.confirm', {
          isShow: true,
          action: 'unbindAuth',
          content: '确定解绑？'
        });
      } else {
        set(this, 'currentModel.confirm', {
          isShow: !get(this, 'currentModel.confirm.isShow'),
          action: 'goToTarget',
          content: '丢弃所有修改，确定继续？'
        });
      }
      this.get('bodyScroll').toggle();
    },

    clickBackground(type, e) {
      if (e.target.className === 'static-background') {
        this.get('actions').toggleModal.call(this, type);
      }
    },

    unbindAuth() {
      const mapping = { qq: 'QQ', wechat: '微信', weibo: '微博', facebook: '微信' };
      const name = get(this, 'authName');

      this.get('ajax').post(`${config.API_ENDPOINT}/UM/ReleaseBind`, {
        data: { bindType: mapping[name] }
      })
        .then(() => {
          const auth = get(this, 'authList').findBy('name', name);
          set(auth, 'isBind', false);
        });
    }
  }
});
