import UISortableComponent from 'ember-choice-ui/modules/ui-sortable/component';
import computed, { alias, empty, readOnly } from 'ember-computed';
import get from 'ember-metal/get';
import styles from '../styles';

export default UISortableComponent.extend({
  styles,
  tagName: 'section',
  localClassNames: ['data-source'],
  localClassNameBindings: ['collapsed:minimize', 'isEmpty:empty'],

  isEmpty: empty('group.presentations'),

  collapsed: false,

  titleEditable: false,
  titleIconName: computed('isCustomGroup', function() {
    return get(this, 'isCustomGroup') ? 'graph2' : 'files-documents';
  }),
  titleClassNames: computed('isCustomGroup', function() {
    const basename = get(this, 'styles')['data-source-title'];
    if (get(this, 'isCustomGroup')) {
      return `${basename} ${get(this, 'styles')['custom-title']}`;
    } else {
      return basename;
    }
  }),

  didUpdate() {
    this._super(...arguments);
    if (get(this, 'titleEditable')) {
      this.$('.ember-content-editable').focus();
    }
  },

  allVisible: computed('group.presentations.@each.visible', function() {
    return get(this, 'group.presentations').filterBy('visible', false).length === 0;
  }),

  sortingScope: readOnly('group.source.id'),
  sortableObjectList: alias('group.presentations'),

  actions: {
    saveTitle() {
      this.set('titleEditable', false);
    },

    changeGroupVisibility() {
      const presentations = get(this, 'group.presentations');
      presentations.setEach('visible', !get(this, 'allVisible'));
    }
  }
}).reopenClass({ positionalParams: ['group'] });
