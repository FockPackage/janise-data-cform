import Controller from 'ember-controller';
import styles from './index/styles';

export default Controller.extend({
  styles,
  queryParams: {
    currentViewID: { as: 'view' },
    currentFilterID: { as: 'filter' }
  },

  currentViewID: null,
  currentFilterID: null
});
