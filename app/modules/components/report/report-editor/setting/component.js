import Component from 'ember-component';
import inject from 'ember-service/inject';
import computed from 'ember-computed';
import get from 'ember-metal/get';

export default Component.extend({
  classNames: ['setting-row'],
  localClassNames: ['setting'],

  intl: inject(),
  tabs: computed(function() {
    const intl = this.get('intl');
    return [
      { name: 'chart', text: intl.t('chart-editor.chart') },
      { name: 'axis', text: intl.t('chart-editor.axis') },
      { name: 'series', text: intl.t('chart-editor.series') },
      { name: 'style', text: intl.t("chart-editor.style") }
    ];
  }),

  currentTabName: 'chart',
  correspondingComponent: computed('currentTabName', function() {
    return `report/report-editor/setting/${get(this, 'currentTabName')}`;
  }),

  actions: {
    setCurrentTab(name) {
      this.set('currentTabName', name);
    }
  }
});
