import Component from 'ember-component';
import config from 'choice-dashboard/config/environment';
import inject from 'ember-service/inject';
import { isPresent } from 'ember-utils';
import { A } from 'ember-array/utils';
import get from 'ember-metal/get';
import set from 'ember-metal/set';
import computed from 'ember-computed';

export default Component.extend({
  intl: inject(),
  ajax: inject('cform-ajax'),
  bodyScroll: inject('cform-body-scroll'),

  isShow: { renameQuotaSet: false, deleteQuotaSet: false },
  disabled: { save: true, delete: false, generate: true },
  alert: { save: false },
  formValue: {},
  quotaValue: [],
  currentEdit: {},
  isFullScreen: false,
  countContent: computed('quotaValue', 'quotaRow1Count', 'quotaRow2Count', function() {
    const value1 = get(this, 'quotaRow1Count') || 0 ;
    if (get(this, 'quotaInfo.table.IsexisRow2')) {
      const value2 = get(this, 'quotaRow2Count') || 0;
      const maxValue = value1 >= value2 ? value1 : value2;
      return (
        `额数量： ${maxValue} ( 配额组1 配额数量： ${value1} 配额组2 配额数量： ${value2} )`
      )
    } else {
      return `额数量： ${value1}`
    }
  }),

  generateErrorCode: computed(
    'formValue.quotaRow1List',
    'formValue.quotaRow2List',
    'formValue.quotaColumnList',
    function() {
      const quotaRow1List = get(this, 'formValue.quotaRow1List');
      if (quotaRow1List.length !== quotaRow1List.uniq().length) return 1;

      const quotaRow2List = get(this, 'formValue.quotaRow2List');
      if (quotaRow2List.length !== quotaRow2List.uniq().length) return 1;

      const quotaColumnList = get(this, 'formValue.quotaColumnList');
      if (quotaColumnList.length !== quotaColumnList.uniq().length) return 1;

      if (this._isLookSame(quotaRow1List, quotaRow2List)) return 2;

      for (let i = 0; i < quotaColumnList.length; i++) {
        if (quotaRow1List.includes(quotaColumnList[i])) return 3;
      }

      for (let i = 0; i < quotaColumnList.length; i++) {
        if (quotaRow2List.includes(quotaColumnList[i])) return 3;
      }

      return 0;
    }),

  didReceiveAttrs() {
    this._super(...arguments);

    this.set('formValue', {
      quotaRow1List: A(this.get('quotaInfo.LoadList.Row1list')),
      quotaRow2List: A(this.get('quotaInfo.LoadList.Row2list')),
      quotaColumnList: A(this.get('quotaInfo.LoadList.Cellist')),

      quotaRow1Name: this.get('quotaInfo.LoadList.Row1Name'),
      quotaRow2Name: this.get('quotaInfo.LoadList.Row2Name'),
      quotaColumnName: this.get('quotaInfo.LoadList.CelName')
    });

    this.set('isShow', {
      quotaRow1: isPresent(this.get('quotaInfo.LoadList.Row1list')),
      quotaRow2: isPresent(this.get('quotaInfo.LoadList.Row2list')),
      quotaColumn: isPresent(this.get('quotaInfo.LoadList.Cellist'))
    });

    this._initQuotaValue();
  },

  didUpdate() {
    const { id, value } = get(this, 'currentEdit');
    const temp = get(this, 'quotaValue').findBy('id', id);
    if (temp) {
      temp.value = value;
    }

    const table = get(this, 'quotaInfo.table.TableJson');
    if (table) {
      for(let i = 0; i < table.length; i++) {
        const tr = table[i];
        for(let j = 0; j < tr.TdList.length; j++) {
          const td = tr.TdList[j];
          if(td.InputID && td.InputID.includes('input_Num')) {
            if (id === td.InputID) {
              td.Value = value;
            }
          }
        }
      }
    }
  },

  _dataValidity() {
    set(this, 'alert.save', false);
    if (!get(this, 'quotaInfo.table.IsexisRow2')) {
      set(this, 'alert.save', false);
    } else {
      let row1OptionList = [];
      let row2OptionList = [];

      get(this, 'quotaValue').forEach(input => {
        const temp = input.id.split(',');
        const optionList = (temp[2] + temp[3]).split('_');

        optionList.forEach(option => {
          if (option !== '') {
            let isExistent = false;
            if (input.id.includes('input_Num,1,')) {
              for (let i = 0; i < row1OptionList.length; i++) {
                if (row1OptionList[i].id === option) {
                  row1OptionList[i].value += +input.value;
                  isExistent = true;
                }
              }

              if (!isExistent) {
                row1OptionList.push({ id: option, value: +input.value });
              }

            } else {
              for (let i = 0; i < row2OptionList.length; i++) {
                if (row2OptionList[i].id === option) {
                  row2OptionList[i].value += +input.value;
                  isExistent = true;
                }
              }

              if (!isExistent) {
                row2OptionList.push({ id: option, value: +input.value });
              }
            }
          }
        });
      });

      row1OptionList.some(row1Option => {
        return row2OptionList.some(row2Option => {
          if (row1Option.id === row2Option.id && row1Option.value !== row2Option.value) {
            set(this, 'alert.save', true);
            return true;
          } else {
            return false;
          }
        })
      });
    }
  },

  _initQuotaValue() {
    const quotaValue = A();
    const { id, value } = get(this, 'currentEdit');
    const table = get(this, 'quotaInfo.table.TableJson');
    if (table) {
      for(let i = 0; i < table.length; i++) {
        const tr = table[i];
        for(let j = 0; j < tr.TdList.length; j++) {
          const td = tr.TdList[j];
          td.class = '';
          if (td.ID && td.ID.includes("tdrow")) {
            td.className = 'group';
          }

          if(td.InputID && td.InputID.includes('input_Num')) {
            if (id === td.InputID) {
              td.Value = value;
            }
            td.className = 'input';
            quotaValue.push({ id: td.InputID, value: td.Value });
          }
        }
      }
    }
    set(this, 'quotaValue', quotaValue);
  },

  // 长度相等，值一样，顺序可以不一样，返回 true 或 false
  _isLookSame(array1, array2) {
    if (array1.length !== array2.length) return false;

    for (let i = 0; i < array1.length; i++) {
      if (!array2.includes(array1[i])) return false;
    }
    return true;
  },

  // 长度相等，值一样，顺序一样，返回 true 或 false
  _isSame(array1, array2) {
    return array1.toString() === array2.toString();
  },

  _hasChange(field) {
    if (field === 'generate') {
      if (!this._isSame(get(this, 'formValue.quotaRow1List'), get(this, 'quotaInfo.LoadList.Row1list'))) {
        return true;
      }

      if (!this._isSame(get(this, 'formValue.quotaRow2List'), get(this, 'quotaInfo.LoadList.Row2list'))) {
        return true;
      }

      if (!this._isSame(get(this, 'formValue.quotaColumnList'), get(this, 'quotaInfo.LoadList.Cellist'))) {
        return true;
      }
    } else if (field === 'save'){
      return true;
    }

    return false;
  },

  _setIsSaved() {
    const isSaved = get(this, 'isSaved');
    const disabled = get(this, 'disabled');
    for (let key in disabled) {
      if (disabled[key] && !isSaved) {
        return this.setIsSaved(false);
      }
    }

    if (isSaved) {
      this.setIsSaved(true);
    }
  },

  _updateDisabled(field) {
    set(this, `disabled.${field}`, !this._hasChange(field));
    this._setIsSaved();
  },

  actions: {
    deleteQuotaRow(field, index) {
      const list = this.get(`formValue.${field}`);
      set(this, `formValue.${field}`, [...list.slice(0, index), ...list.slice(index + 1)]);
      this._updateDisabled('generate');
    },

    addQuotaRow(field) {
      const list = get(this, `formValue.${field}`);
      const max = field === 'quotaColumnList' ? 2 : 3;
      if (list.length < max) {
        set(this, `formValue.${field}`, [...list, this.get('quotaInfo.NodeList.Nodes')[0].NodeID]);
      } else {
        get(this, 'notification').error('超过最大限额');
      }
      this._updateDisabled('generate');
    },

    addQuotaGroup(isRow) {
      if (isRow) {
        if (this.get('isShow.quotaRow1')) {
          get(this, 'isShow.quotaRow2') ? null : set(this, 'formValue.quotaRow2Name', '配额组2');
          set(this, 'isShow.quotaRow2', true);
        } else {
          get(this, 'isShow.quotaRow1') ? null : set(this, 'formValue.quotaRow1Name', '配额组1');
          set(this, 'isShow.quotaRow1', true);
        }
      } else {
        get(this, 'isShow.quotaColumn') ? null : set(this, 'formValue.quotaColumnName', '配额组3');
        this.set('isShow.quotaColumn', true);
      }
      this._updateDisabled('generate');
    },

    deleteQuotaGroup(name) {
      if (name === 'quotaRow1' && get(this, 'isShow.quotaRow2')) {
        const quotaRow2List = get(this, 'formValue.quotaRow2List');
        const quotaRow2Name = get(this, 'formValue.quotaRow2Name');

        set(this, 'formValue.quotaRow1List', quotaRow2List);
        set(this, 'formValue.quotaRow1Name', quotaRow2Name);

        set(this, 'formValue.quotaRow2List', []);
        set(this, 'isShow.quotaRow2', false);
      } else {
        set(this, `isShow.${ name }`, false);
        set(this, `formValue.${name}List`, []);
      }
      this._updateDisabled('generate');
    },

    selectQuota(field, index, targetId) {
      const list = get(this, `formValue.${field}`);
      set(this, `formValue.${field}`, [...list.slice(0, index), targetId, ...list.slice(index + 1)]);
      this._updateDisabled('generate');
    },

    toggleModal(type, name) {
      this.toggleProperty(`isShow.${type}`);

      if (type === 'renameQuotaSet') {
        set(this, 'currentEditSetName', name);
        set(this, 'formValue.newName', get(this, `formValue.${name}`));
      }
      this.get('bodyScroll').toggle();
    },

    clickBackground(type, e) {
      if (e.target.className === 'static-background') {
        this.get('actions').toggleModal.call(this, type);
      }
    },

    renameQuotaSet() {
      const newName = get(this, 'formValue.newName');
      const currentEditSetName = get(this, 'currentEditSetName');
      set(this, `formValue.${currentEditSetName}`, newName);
      get(this, 'actions.toggleModal').call(this, 'renameQuotaSet');

      const mapping = { quotaRow1Name: 1, quotaRow2Name: 2, quotaColumnName: 3 };

      this.get('ajax').post(`${config.API_ENDPOINT}/QM/EditQuotaSetupName`, {
        data: {
          quotaTableID: this.get('quotaInfo.LoadList.QuotaTableID'),
          type: mapping[currentEditSetName],
          name: newName
        }
      })
        .then(() => get(this, 'notification').success('Delete!'));
    },

    focusInput(id, value) {
      if (id) {
        set(this, 'currentEdit', { id, value });
      }

      if (id !== 1) {
        setTimeout(() => {
          document.getElementById('currentEdit').focus();
        }, 200);
      }
    },

    generateTable() {
      const errorList = [
        '',
        '同一配额行中不能包含相同的甄别题',
        '不同配额行的不能包含相同的甄别题',
        '配额行与配额列不能包含相同的甄别题'
      ];
      const generateErrorCode = get(this, 'generateErrorCode');

      if (generateErrorCode === 0) {
        get(this, 'generateTable')(get(this, 'formValue'));
      } else {
        get(this, 'notification').error(errorList[generateErrorCode]);
      }
    },

    updateCount() {
      const tableValueList = get(this, 'quotaValue');
      let value1 = 0;
      let value2 = 0;
      tableValueList.forEach(tableValue => {
        if (tableValue.id.includes('input_Num,1,')) {
          value1 += +tableValue.value;
        } else {
          value2 += +tableValue.value;
        }
      });

      set(this, 'quotaRow1Count', value1);
      set(this, 'quotaRow2Count', value2);
      this._updateDisabled('save');
    },

    updateTable() {
      this._dataValidity();

      if (get(this, 'formValue.quotaRow2List').length && get(this, 'quotaRow1Count') !== get(this, 'quotaRow2Count')) {
        get(this, 'notification').error('配额数量不一致。');
      } else if (get(this, 'alert.save')) {
        get(this, 'notification').error('行配额组中相同选项的配额数量不一致。');
      } else {
        get(this, 'updateTable')(get(this, 'quotaValue'));
      }
    },

    toggleFullScreen() {
      this.toggleProperty('isFullScreen');
    }
  }
});
