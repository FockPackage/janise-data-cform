import UIDraggableComponent from 'ember-choice-ui/modules/ui-draggable/component';
import computed, { readOnly } from 'ember-computed';
import get from 'ember-metal/get';
import set from 'ember-metal/set';
import { htmlSafe } from 'ember-string';
import { bind } from 'ember-runloop';

export default UIDraggableComponent.extend({
  tagName: 'li',
  classNameBindings: ['showSerial:que-active'],
  localClassNameBindings: ['isCustom:custom-data', 'showSerials:serial-show'],

  dragHandle: true,
  draggableClassName: computed('sortable', function() {
    return get(this, 'sortable') ? 'drag' : '';
  }),

  visible: readOnly('presentation.visible'),
  visibleClassName: computed('presentation.visible', function() {
    return get(this, 'presentation.visible') ? 'que-active': '';
  }),

  serialClassName: computed('showSerials', function() {
    return get(this, 'showSerials') ? 'serial' : '';
  }),

  typeIcon: computed('presentation.bucket.type', function() {
    switch (get(this, 'presentation.bucket.type')) {
      case 1: return htmlSafe(`<i class="ic-report dark half ic-location-pin-half"></i>`);
      case 2: return htmlSafe(`<i class="ic-report dark half ic-checkmark-half"></i>`);
      case 3: return htmlSafe(`<i class="ic-report dark half ic-radio-half"></i>`);
      default: return null;
    }
  }),

  didInsertElement: function() {
    this.enableDragReady = bind(this, '_toggleDragReady', true);
    this.disableDragReady = bind(this, '_toggleDragReady', false);
    this.element.addEventListener('mouseover', this.enableDragReady);
    this.element.addEventListener('mouseout', this.disableDragReady);
  },

  _toggleDragReady(state, event) {
    if (event.target.classList.contains(get(this, 'styles.drag'))) {
      set(this, 'dragReady', state);
    }
  },

  actions: {
    toggleVisibility() {
      get(this, 'presentation').toggleProperty('visible');
    }
  }
}).reopenClass({ positionalParams: ['presentation'] });
