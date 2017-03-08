import Ember from 'ember';
import config from 'choice-dashboard/config/environment';
import inject from 'ember-service/inject';
import RSVP from 'rsvp';
import get from 'ember-metal/get';
import set from 'ember-metal/set';

export default Ember.Route.extend({
  session: inject(),
  ajax: inject('cform-ajax'),
  nativeAjax: inject('ajax'),
  bodyScroll: inject('cform-body-scroll'),

  isSaved: true,

  model() {
    const id = this.modelFor('form').currentQuestionnaireId;
    return RSVP.hash({
      currentQuestionnaireId: id,
      quotaInfo: this._getQuotaInfo(id),
      isShowConfirm: false
    });
  },

  _getQuotaInfo(id) {
    return this.get('ajax').request(`${config.API_ENDPOINT}/QM/GetQDNodeIdentifyflagByQuesID`, {
      data: { quesID: id }
    })
      .then(response => {
        const quotaInfo = response.Result;
        const tableId = quotaInfo.LoadList.QuotaTableID;
        if (tableId === "00000000-0000-0000-0000-000000000000") {
          return response.Result;
        } else {
          return this._getTable(id, tableId)
            .then(table => {
              table.TableJson = JSON.parse(table.TableJson);
              quotaInfo.table = table;
              return quotaInfo;
            });
        }
      });
  },

  _getTable(id, tableId) {
    return this.get('ajax').post(`${config.API_ENDPOINT}/QM/GetQuestionnairQuotaTableInfo`, {
      data: { questionnairID: id, quotaTableID: tableId }
    })
      .then(response => response.Result);
  },

  _canISave(id, tableId) {
    return this.get('ajax').post(`${config.API_ENDPOINT}/QM/IsCanSaveQDQuotaSetupManager`, {
      data: { questionnairID: id, quotaTableID: tableId }
    })
      .then(response => response.Result.Isconfirm)
      .catch(() => {
        get(this, 'notification').error('当前问卷状态禁止修改配额条件');
      })
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
      const targetName = get(this, 'targetName');

      if (targetName.includes('form.')) {
        this.transitionTo(targetName, get(this, 'currentModel.currentQuestionnaireId'));
      } else {
        this.transitionTo(targetName);
      }
    },

    toggleModal() {
      this.toggleProperty('currentModel.isShowConfirm');
      this.get('bodyScroll').toggle();
    },

    clickBackground(e) {
      if (e.target.className === 'static-background') {
        this.get('actions').toggleModal.call(this);
      }
    },

    generateTable(params) {
      const questionnaireId = this.get('currentModel.currentQuestionnaireId');
      const tableId = this.get('currentModel.quotaInfo.LoadList.QuotaTableID');

      this._canISave(questionnaireId, tableId)
        .then(() => {
          // if (isConfirm) {
          //   return console.log(111);
          // }
          const data = {
            trrow1value: params.quotaRow1List.toString(),
            trrow2value: params.quotaRow2List.toString(),
            trcelvalue: params.quotaColumnList.toString(),
            row1name: params.quotaRow1Name,
            row2name: params.quotaRow2Name,
            celname: params.quotaColumnName,
            questionnairID: questionnaireId,
            quotaTableID: tableId
          }
          return this.get('ajax').post(`${config.API_ENDPOINT}/QM/SaveQDQuotaSetupManager`, {
            data: data
          })
            .then(response => this._getTable(questionnaireId, response.Result.QuotaTableID))
            .then(table => {
              table.TableJson = JSON.parse(table.TableJson);
              set(this, 'currentModel.quotaInfo.table', table);
              get(this, 'notification').success('Saved!')
            });
        });
    },

    deleteQuota() {
      this.get('ajax').post(`${config.API_ENDPOINT}/QM/DelQuotaInfo`, {
        data: {
          quesid: this.get('currentModel.currentQuestionnaireId'),
          quotatableID: this.get('currentModel.quotaInfo.LoadList.QuotaTableID')
        }
      })
        .then(() => get(this, 'notification').success('Delete!'))
        .catch(error => {
          if (error === 'BMsg_QuotaDelErrorByQuoted') {
            get(this, 'notification').error('当前配额被选择引用，禁止删除配额。')
          }
        });
    },

    updateTable(params) {
      const questionnaireId = get(this, 'currentModel.currentQuestionnaireId');
      const tableId = get(this, 'currentModel.quotaInfo.LoadList.QuotaTableID');

      const arr = [];
      for (let i = 0; i < params.length  ; i++) {
        if (params[i].value != "0" && params[i].value != "") {
          arr.push(params[i].id + "," + params[i].value);
        }
      }

      const data = {
        token: get(this, 'session.data.authenticated.Token'),
        quotavalue: arr,
        trSetrow1value: '',
        trSetrow2value: '',
        trSetcelvalue: '',
        questionnairID: questionnaireId,
        quotaTableID: tableId
      };

      this.get('nativeAjax').post(`${config.API_ENDPOINT}/QM/SaveQuota`, {
        data: { '': JSON.stringify(data) }
      })
        .then(() => this._getTable(questionnaireId, tableId))
        .then(table => {
          table.TableJson = JSON.parse(table.TableJson);
          set(this, 'currentModel.quotaInfo.table', table);
          get(this, 'notification').success('Saved!');
        });
    },

    setIsSaved(params) {
      set(this, 'isSaved', params);
    }
  }
});
