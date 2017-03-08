import Ember from 'ember';
import inject from 'ember-service/inject';
import config from 'choice-dashboard/config/environment';
import RSVP from 'rsvp';
import get from 'ember-metal/get';

export default Ember.Route.extend({
  ajax: inject('cform-ajax'),
  verifyField: inject('cform-verify-field'),

  model() {
    return RSVP.hash({
      selectedTemplateId: "00000000-0000-0000-0000-000000000000",
      templateList: this._getTemplateList(),
      folderList: this._getFolderList(),
      formValue: { newFormName: '' },
      disabled: false,
      error: {}
    });
  },

  renderTemplate() {
    this._super(...arguments);
    this.render('create/subnav', { outlet: 'subnav' });
  },

  _getTemplateList() {
    return this.get('ajax').request(`${config.API_ENDPOINT}/QM/GetModelInfoByModelId`, {
      data: { index: 0 }
    })
      .then(response => response.Result)
  },

  _getFolderList() {
    return this.get('ajax').request(`${config.API_ENDPOINT}/QM/GetFolder`)
      .then(response => response.Result);
  },

  _updateDisabled() {
    if(this.get('verifyField').hasAlert(this.get('currentModel.error'))) {
      this.set('currentModel.disabled', true);
    } else {
      this.set('currentModel.disabled', false);
    }
  },

  _copyForm(params) {
    this.get('ajax').post(`${config.API_ENDPOINT}/QM/CopyQues`, {
      data: {
        folderID: params.folderId,
        quesID: params.templateId,
        title: params.newFormName
      }
    })
      .then(response => {
        window.location = `${config.EDITOR_HOST}?quesID=${response.Result.quesId}`;
      });
  },

  actions: {
    selectTemplate(id) {
      this.set('currentModel.selectedTemplateId', id);
    },

    changeFolder(id) {
      this.set('currentModel.currentFolderID', id);
    },

    newForm() {
      const templateId = get(this, 'currentModel.selectedTemplateId');
      const newFormName = get(this, 'currentModel.formValue.newFormName');
      const folderId = get(this, 'currentModel.folderId');

      if (templateId === "00000000-0000-0000-0000-000000000000") {
        this.get('ajax').post(`${config.API_ENDPOINT}/QM/QuestionnaireEdit`, {
          data: {
            descript: null, title: newFormName, folderID: null, questionID: null, templateID: null
          }
        })
          .then(response => {
            window.location = `${config.EDITOR_HOST}?quesID=${response.Result.quesID}`;
          });
      } else {
        this._copyForm({ templateId, newFormName, folderId });
      }
    },

    verify(field) {
      const isError = !this.get('verifyField').test(field, this.get(`currentModel.formValue.${ field }`));
      this.set(`currentModel.error.${ field }`, isError);
      this._updateDisabled();
    }
  }
});
