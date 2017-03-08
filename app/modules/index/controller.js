import Controller from 'ember-controller';
import inject from 'ember-service/inject';
import config from 'choice-dashboard/config/environment';
import observer from 'ember-metal/observer';
import get from 'ember-metal/get';
import set from 'ember-metal/set';
import computed from 'ember-computed';

export default Controller.extend({
  ajax: inject('cform-ajax'),
  checkPassword: inject('cform-check-password'),
  verifyField: inject('cform-verify-field'),
  bodyScroll: inject('cform-body-scroll'),

  isShow: {},
  formValue: { password: '', folderName: '', newFolderName: '' },
  passwordObserver: observer('formValue.password', function() {
    this._verify('password');
  }),
  disabled: { delete: true },
  dashboardFolder: { FolderID: '0', FolderName: 'Dashboard', IsSelect: true, ReturnFolderID: '' },
  isShowUpdateNotice: computed('model.updateNotice.published_at', function() {
    const lastGetUpdateNoticeTime = localStorage.getItem('lastGetUpdateNoticeTime');
    localStorage.setItem('lastGetUpdateNoticeTime', new Date().getTime());
    if (lastGetUpdateNoticeTime) {
      return new Date(get(this, 'model.updateNotice.published_at')).getTime() >= lastGetUpdateNoticeTime;
    }
    return true;
  }),

  _getFolderList() {
    return this.get('ajax').request(`${config.API_ENDPOINT}/QM/GetFolder`);
  },

  _updateQuestionnaireList(id) {
    let newQuestionnaireList = this.get('model.questionnaireList.QuesList')
      .filter(questionnaire => questionnaire.QuestionnaireID !== id);
    this.set('model.questionnaireList.QuesList', newQuestionnaireList);
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

  _verify(field) {
    const isAlert = !this.get('verifyField').test(field, this.get(`formValue.${ field }`));
    this.set('disabled.delete', isAlert);
  },

  actions: {
    toggleModal(type, id = null, name = null) {
      this.set('currentQuestionnaireId', id);
      this.set('currentQuestionnaireName', name);
      if (type === 'updateNotice') {
        this.toggleProperty('isShowUpdateNotice');
      } else {
        this.set(`isShow.${ type }`, !this.get(`isShow.${ type }`));
      }

      if(type === 'deleteQuestionnaire') {
        this.set('formValue.password', '');
        this.set('disabled.delete', true);
      }

      if(type === 'renameFolder') {
        this.set('formValue.newFolderName', this.get('model.currentFolder.FolderName'));
      }

      if(type === 'changeFolder') {
        this.set('model.destinationFolderId', this.get('model.currentFolder.FolderID'));
      }
      this.get('bodyScroll').toggle();
    },

    clickBackground(type, e) {
      if (e.target.className === 'static-background') {
        this.get('actions').toggleModal.call(this, type);
      }
    },

    deleteQuestionnaire() {
      const questionnaireID = this.get('currentQuestionnaireId');
      this.get('checkPassword').test(this.get('formValue.password'))
        .then(() => {
          return this.get('ajax').post(`${config.API_ENDPOINT}/QM/DelQues`, {
            data: { quesID: questionnaireID }
          });
        })
        .then(() => {
          this._updateQuestionnaireList(questionnaireID);
          this.get('actions').toggleModal.call(this, 'deleteQuestionnaire');
        })
        .catch(error => console.log(error))  // eslint-disable-line no-console
    },

    moveQuestionnaire() {
      const [currentQuestionnaireId, destinationFolderId] = [
        get(this, 'currentQuestionnaireId'), get(this, 'model.destinationFolderId')
      ];
      this.get('ajax').post(`${config.API_ENDPOINT}/QM/MoveQuesToFolder`, {
        data: {
          quesID: currentQuestionnaireId,
          targeid: destinationFolderId == 0 ? null : destinationFolderId
        }
      })
        .then(() => {
          this.get('actions').toggleModal.call(this, 'changeFolder');
          this.get('notification').success('Successfully!');
          this._updateQuestionnaireList(currentQuestionnaireId, true, destinationFolderId);
        });
    },

    setDestinationFolderId(folderId) {
      set(this, 'model.destinationFolderId', folderId);
    },

    getQRCode(id) {
      this.get('ajax').request(`${config.API_ENDPOINT}/QM/DownLoadQRCode`, {
        data: { linkSuffix: id, qrCodeType: "Preview", quesID: id, redirect_uri: null }
      })
        .then(response => {
          this.set('model.qrCode', response.Result);
          this.get('actions').toggleModal.call(this, 'formPreview');
        });
    },

    createFolder() {
      this.get('ajax').post(`${config.API_ENDPOINT}/QM/SaveFolder`, {
        data: { title: this.get('formValue.folderName'), folderid: null, isnewsave: 1 }
      })
        .then(() => this._getFolderList())
        .then(response => {
          const newFolderList = [this.get('dashboardFolder'), ...response.Result];
          this.set('model.folderList', newFolderList);
          this.set('formValue.folderName', '');
          this.get('actions').toggleModal.call(this, 'newFolder');
          this.get('notification').success('Successfully!');
        })
        .catch(error => console.log(error));  // eslint-disable-line no-console
    },

    deleteFolder() {
      this.get('ajax').post(`${config.API_ENDPOINT}/QM/DelPMFolder`, {
        data: { id: this.get('model.currentFolder.ReturnFolderID') }
      })
        .then(() => {
          const dashboardFolder = this.get('dashboardFolder');
          const folderId = get(this, 'model.currentFolder.FolderID');
          const tempFolderList = get(this, 'model.folderList').rejectBy('FolderID', folderId);
          const newFolderList = tempFolderList.length === 1 ? [] : [dashboardFolder, ...tempFolderList];

          this.set('model.folderList', newFolderList);
          this.set('model.currentFolder', dashboardFolder);
          this._getQuestionnaireList().then(response => {
            this.set('model.questionnaireList', response);
          });
          this.get('actions').toggleModal.call(this, 'deleteFolder');
          this.get('notification').success('Successfully!');
        })
        .catch(error => console.log(error));  // eslint-disable-line no-console
    },

    renameFolder() {
      this.get('ajax').post(`${config.API_ENDPOINT}/QM/SaveFolder`, {
        data: {
          folderid: this.get('model.currentFolder.ReturnFolderID'),
          title: this.get('formValue.newFolderName'),
          isnewsave: 0
        }
      })
        .then(() => {
          this.set('model.currentFolder.FolderName', this.get('formValue.newFolderName'));
          this.get('actions').toggleModal.call(this, 'renameFolder');
        })
        .catch(error => console.log(error));  // eslint-disable-line no-console
    }
  }
});
