import Ember from 'ember';
import inject from 'ember-service/inject';
import config from 'choice-dashboard/config/environment';
import RSVP from 'rsvp';
import get from 'ember-metal/get';
import set from 'ember-metal/set';

export default Ember.Route.extend({
  ajax: inject('cform-ajax'),

  model(params, transition) {
    return RSVP.hash({
      currentQuestionnaireId: params.id,
      isShow: {},
      questionnaire: this._getQuestionnaire(params.id),
      tabList: [
        {
          routeName: 'form.quota',
          text: 'form.quota',
          isCurrentRoute: transition.targetName.includes('form.quota')
        }, {
          routeName: 'form.collect',
          text: 'form.collect-responses',
          isCurrentRoute: transition.targetName.includes('form.collect')
        }, {
          routeName: 'form.share',
          text: 'form.share',
          isCurrentRoute: transition.targetName.includes('form.share')
        }, {
          routeName: 'form.analyze',
          text: 'form.analyze',
          isCurrentRoute: transition.targetName.includes('form.analyze')
        }
      ]
    });
  },

  renderTemplate() {
    this._super(...arguments);
    this.render('form/subnav', { outlet: 'subnav' });
  },

  _getQuestionnaire(id) {
    return this.get('ajax').request(`${config.API_ENDPOINT}/QM/GetQuestionInfoByQuesID`, {
      data: { quesID: id, viewID: null }
    })
      .then(response => response.Result);
  },

  actions: {
    selectTab(routeName) {
      const tabList = get(this, 'currentModel.tabList');
      tabList.setEach('isCurrentRoute', false);
      const tab = tabList.findBy('routeName', routeName);
      set(tab, 'isCurrentRoute', true);
    }
  }
});
