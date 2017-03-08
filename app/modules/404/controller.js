import Controller from 'ember-controller';
import inject from 'ember-service/inject';
import computed from 'ember-computed';

// 1. 导入 Table 用于创建表格对象
import Table from 'ember-light-table';

export default Controller.extend({
  intl: inject(),

  languages: [
    {text: '简体中文', code: 'zh-hans'},
    {text: 'English', code: 'en-us'}
  ],

  defaultLanguage: {text: '简体中文', code: 'zh-hans'},

  now: new Date(),

  // 2. 准备列对象，它需要是一个计算属性（跟踪变化）
  columns: computed(function() {
    return [{
      label: 'User ID',         // th 的内容
      valuePath: 'userID'       // td 的内容，跟踪 rows 对象里的同名属性
    }, {
      // 如果 label 需要多语言：
      // 1. 注入 intl 服务（见第 2 行与第 9 行）
      // 2. 见下面这行：
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

  // 3. 准备行对象，键名与列对象对应起来
  rows: [
    {userID: 1, firstName: 'Wester', lastName: 'Xi', email: 'wester@cform.io'},
    {userID: 2, firstName: 'Albert', lastName: 'Yu', email: 'albert@cform.io'},
    {userID: 3, firstName: 'Wester', lastName: 'Xi', email: 'wester@cform.io'},
    {userID: 4, firstName: 'Albert', lastName: 'Yu', email: 'albert@cform.io'},
    {userID: 5, firstName: 'Wester', lastName: 'Xi', email: 'wester@cform.io'},
    {userID: 6, firstName: 'Albert', lastName: 'Yu', email: 'albert@cform.io'}
  ],

  // 4. 当初始化的时候绑定行列对象给 Table（组件里的 init 方法也一样）
  init() {
    this._super(...arguments);
    this.set('table', new Table(this.get('columns'), this.get('rows')));

    // 5. 现在去写模板
  },

  actions: {
    selectLanguage(language) {
      this.set('defaultLanguage', language);
      this.get('intl').setLocale(language.code);
    }
  }
});
