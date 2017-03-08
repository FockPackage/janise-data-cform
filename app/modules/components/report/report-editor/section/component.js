import Component from 'ember-component';
import inject from 'ember-service/inject';
import computed from 'ember-computed';
import Table from 'ember-light-table';

export default Component.extend({
  tagName: 'section',

  localClassNames: ['chart-view'],
  classNameBindings: ['maximized:maximize'],

  // 这个属性应持久化获取
  expanded: true,
  isExpanded: computed('expanded', function() {
    return this.get('expanded') ? 'maximize' : '';
  }),
  isCollapsed: computed('expanded', function() {
    return this.get('expanded') ? '' : 'minimize';
  }),

  settingClassName: computed('api.isOnSetting', function() {
    return this.get('api.isOnSetting') ? 'setting' : '';
  }),

  intl: inject(),
  columns: computed(function() {
    return [{
      label: 'User ID',
      valuePath: 'userID'
    }, {
      label: this.get('intl').t('demo.first-name'),
      valuePath: 'firstName'
    }, {
      label: 'Last Name',
      valuePath: 'lastName'
    }, {
      label: 'Email Address',
      valuePath: 'email'
    }];
  }),

  rows: [
    {userID: 1, firstName: 'Wester', lastName: 'Xi', email: 'wester@cform.io'},
    {userID: 2, firstName: 'Albert', lastName: 'Yu', email: 'albert@cform.io'},
    {userID: 3, firstName: 'Wester', lastName: 'Xi', email: 'wester@cform.io'},
    {userID: 4, firstName: 'Albert', lastName: 'Yu', email: 'albert@cform.io'},
    {userID: 5, firstName: 'Wester', lastName: 'Xi', email: 'wester@cform.io'},
    {userID: 6, firstName: 'Albert', lastName: 'Yu', email: 'albert@cform.io'}
  ],

  init() {
    this._super(...arguments);
    this.set('table', new Table(this.get('columns'), this.get('rows')));
  }
}).reopenClass({ positionalParams: ['datum'] });
