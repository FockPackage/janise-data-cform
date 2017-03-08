import Ember from 'ember';
import config from 'choice-dashboard/config/environment';
import inject from 'ember-service/inject';
import RSVP from 'rsvp';

export default Ember.Route.extend({
  ajax: inject('cform-ajax'),

  model() {
    const id = this.modelFor('form').currentQuestionnaireId;
    return RSVP.hash({
      currentQuestionnaireId: id,
      publishInfo: this._getPublishInfo(id)
    });
  },

  _getPublishInfo(questionnaireID) {
    return this.get('ajax').request(`${config.API_ENDPOINT}/QM/GetPublishInfo`, {
      data: {
        dayForLang: '天', quesID: questionnaireID
      }
    })
      .then(response => {
        if (response.Result.onLineFlag) {
          return response.Result;
        } else {
          this.transitionTo('form.collect', questionnaireID);
        }
      });
  }
});
