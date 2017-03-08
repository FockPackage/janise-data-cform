import Route from 'ember-route';
import inject from 'ember-service/inject';
import config from 'choice-dashboard/config/environment';
import RSVP from 'rsvp';
import { A } from 'ember-array/utils';
import { htmlSafe } from 'ember-string';
import { isBlank } from 'ember-utils';
import get from 'ember-metal/get';

export default Route.extend({
  ajax: inject('cform-ajax'),
  nativeAjax: inject('ajax'),
  globalLoading: inject('cform-global-loading'),
  intl: inject(),
  currentFolder: { FolderID: '0', FolderName: 'Dashboard', IsSelect: true, ReturnFolderID: '' },

  beforeModel(transition) {
    if (!localStorage.getItem('somethingEncryption')) return transition.abort();
  },

  model() {
    return RSVP.hash({
      companyList: this._getCompanyList(),
      questionnaireList: this._getQuestionnaireList(),
      folderList: this._getFolderList(),
      sortordList: A(this._getSortordList()),
      currentFolder: this.get('currentFolder'),
      updateNotice: this._getUpdateNotice(),
      formValue: { searchText: '' }
    });
  },

  renderTemplate() {
    this._super(...arguments);
    this.render('index/subnav', { outlet: 'subnav' });
  },

  _getSortordList() {
    return [
      { id: 1, name: get(this, 'intl').t("sortord-menu.created-date"), iconClass: 'created-date'},
      { id: 2, name: get(this, 'intl').t("sortord-menu.updated-date"), iconClass: 'modification-date'},
      { id: 3, name: get(this, 'intl').t("sortord-menu.questionnaire-status"), iconClass: 'status'}
    ];
  },

  _getCompanyList() {
    const { SelectCompanyID, SortType } = JSON.parse(localStorage.getItem('somethingEncryption'));

    return this.get('ajax').request(`${config.API_ENDPOINT}/QM/QuestionnaireList`, {
      data: { selectCompanyID: SelectCompanyID, sortType: SortType }
    })
      .then(response => {
        localStorage.setItem('encryptedCompanyId', response.Result.ReturnSelectCompanyID);
        response.Result.Company = response.Result.Company.map(company => {
          company.avatarStyle = htmlSafe(`background-image: url(${company.BackgroundImg})`);
          return company;
        });
        return response.Result;
      });
  },

  _getQuestionnaireList(params = {}) {
    return this.get('ajax').request(`${config.API_ENDPOINT}/QM/GetQuestionInfoByFolderID`, {
      data: {
        sorttype: params.sortType || 1,
        skip: params.skip || 0,
        take: params.take || 16,
        id: params.folderId || null
      }
    })
      .then(response => response.Result);
  },

  _getFolderList() {
    return this.get('ajax').request(`${config.API_ENDPOINT}/QM/GetFolder`)
      .then(response => {
        return isBlank(response.Result) ? [] : [this.get('currentFolder'), ...response.Result];
      });
  },

  _getUpdateNotice() {
    return this.get('nativeAjax').request(`${config.DASHBOARD_API_ENDPOINT}/v1/announcements`, {
      data: { page: 1, per: 1, lang: document.querySelector('html').getAttribute('lang') }
    })
      .then(response => response.announcements[0]);
  },

  _setCurrentFolder(folderId) {
    return A(this.get('currentModel.folderList')).findBy('FolderID', folderId);
  },

  _updateQuestionnaireList(id) {
    const newQuestionnaireList = this.get('currentModel.questionnaireList.QuesList')
      .filter(questionnaire => questionnaire.QuestionnaireID !== id);
    this.set('currentModel.questionnaireList.QuesList', newQuestionnaireList);
  },

  actions: {
    changeFolder(folderId) {
      this.get('actions').clearSearched.call(this);

      this.set('currentModel.currentFolder', this._setCurrentFolder(folderId));
      this.set('currentModel.questionnaireList', []);
      this.set('currentModel.isLoading', true);
      const sortType = this.get('currentModel.currentSortordId');
      this._getQuestionnaireList({ sortType, folderId })
        .then(questionnaireList => {
          this.set('currentModel.questionnaireList', questionnaireList);
          this.set('currentModel.isLoading', false);
        });
    },

    loadMore() {
      // this.get('globalLoading').show();
      const sortType = this.get('currentModel.currentSortordId');
      const skip = this.get('currentModel.questionnaireList.QuesList').length;
      const folderId = this.get('currentModel.currentFolder.FolderID');
      this._getQuestionnaireList({ sortType, skip, folderId })
        .then(questionnaireList => {
          const oldQuestionnaireList = this.get('currentModel.questionnaireList');
          questionnaireList.QuesList = [
            ...oldQuestionnaireList.QuesList, ...questionnaireList.QuesList
          ];
          this.set('currentModel.questionnaireList', questionnaireList);
          // this.get('globalLoading').hide();
        });
    },

    changeSortord(id) {
      this.set('currentModel.isLoading', true);
      this.set('currentModel.questionnaireList', []);
      this.set('currentModel.currentSortordId', id);

      this._getQuestionnaireList({
        sortType: id, folderId: this.get('currentModel.currentFolder.FolderID')
      })
        .then(questionnaireList => {
          this.set('currentModel.questionnaireList', questionnaireList);
          this.set('currentModel.isLoading', false);
        });
    },

    copyQuestionnaire(id, folderId) {
      this.get('ajax').post(`${config.API_ENDPOINT}/QM/CopyQues`, {
        data: { quesID: id, title: null, folderId, selectcompanyID: null }
      })
        .then(() => {
          // TODO: 没必要重新获取问卷列表
          const sortType = this.get('currentModel.currentSortordId');
          const folderId = folderId === '00000000-0000-0000-0000-000000000000' ? null : folderId;
          this._getQuestionnaireList({ sortType, folderId })
            .then(questionnaireList => {
              this.set('currentModel.questionnaireList', questionnaireList);
            });
        });
    },

    clearSearched() {
      this.set('currentModel.searchedQuestionnireList', []);
      this.set('currentModel.searched', false);
    },

    searchForm() {
      this.set('currentModel.searchedQuestionnireList', []);
      this.set('currentModel.searched', true);
    }
  }
});
