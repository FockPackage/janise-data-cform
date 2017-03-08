import Component from 'ember-component';
import inject from 'ember-service/inject';
import config from 'choice-dashboard/config/environment';
import computed from 'ember-computed';
import { htmlSafe } from 'ember-string';
import { isBlank } from 'ember-utils';

export default Component.extend({
  ajax: inject('cform-ajax'),
  isDeleteDisable: computed('status', function() {
    const status = this.get('status');
    return status === 4 || status === 5 ? true : false
  }),
  isFolderDisable: computed('folderList', function() {
    return isBlank(this.get('folderList'));
  }),
  coverStyle: computed('cover', function() {
    const cover = this.get('cover');
    return cover ? htmlSafe(`background-image: url(${ cover })`) : '';
  }),
  progressStyle: computed('progress', function() {
    return htmlSafe(`width: ${ this.get('progress') }`);
  }),

  didInsertElement() {
    this._super(...arguments);

    this._getQuestionnaireProgress();
  },

  _getQuestionnaireProgress() {
    this.get('ajax').request(`${config.API_ENDPOINT}/QM/GetQuesProgressWidthByids`, {
      data: { ids: this.get('id') }
    })
      .then(response => {
        if (response.Result.QuesList[0]) {
          this.set('progress', response.Result.QuesList[0].ProgressWidth);
          this.set('statistics-number', response.Result.QuesList[0].QuesSubmitNum);
        }
      });
  }
});
