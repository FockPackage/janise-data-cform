import Component from 'ember-component';
import computed, { reads, filterBy } from 'ember-computed';
import get from 'ember-metal/get';
import { isPresent } from 'ember-utils';
import presentationTypes, { defaultType } from '../../../../lib/presentation-types';

export default Component.extend({
  tagName: '',

  // 单向绑定并读取原始数据中的每一个部分
  report: reads('model.report'),
  sources: reads('model.sources'),
  presentations: reads('model.presentations'),

  // 根据 isCustom 属性分割 presentations
  customPresentations: filterBy('presentations.[]', 'isCustom', true),
  originPresentations: filterBy('presentations.[]', 'isCustom', false),

  // 构造没有任何过滤条件的数据组
  _customGroup: computed('sources', 'customPresentations.[]', function() {
    const source = get(this, 'sources').filterBy('type', 0)[0];
    return { source, presentations: get(this, 'customPresentations') };
  }),
  _originGroups: computed('sources', 'originPresentations.[]', function() {
    const sources = get(this, 'report.sources').rejectBy('type', 0);
    const originPresentations = get(this, 'originPresentations');
    return sources.reduce((acc, source) => {
      acc.pushObject({ source, presentations: originPresentations.filter(
        p => get(p, 'bucket.source.id') === get(source, 'id')
      )});
      return acc;
    }, []);
  }),

  // 边栏搜索过滤条件
  searchTerm: null,
  _applySearchTermToCustomGroup(group, searchTerm) {
    const { source, presentations } = group;
    return { source, presentations: presentations.filter(
      p => get(p, 'bucket.name').search(searchTerm) > -1
    )};
  },
  _applySearchTermToOriginGroups(groups, searchTerm) {
    return groups.map(group => {
      const { source, presentations } = group;
      return { source, presentations: presentations.filter(
        p => get(p, 'bucket.name').search(searchTerm) > -1
      )};
    });
  },

  // 按所有可能的类型过滤
  currentTypeFilter: defaultType.type,
  presentationTypes: computed('presentations', function() {
    const types = get(this, 'presentations').reduce((acc, p) => {
      acc.pushObject(presentationTypes[get(p, 'bucket.type')]);
      return acc;
    }, [defaultType]);
    return types.uniqBy('type');
  }),
  _applyTypeFilterToCustomGroup(group, type) {
    const { source, presentations } = group;
    return { source, presentations: presentations.filterBy('bucket.type', type)};
  },
  _applyTypeFilterToOriginGroups(groups, type) {
    return groups.map(group => {
      const { source, presentations } = group;
      return { source, presentations: presentations.filterBy('bucket.type', type)};
    });
  },

  // 是否只显示那些可见的
  visibleOnly: false,
  _filterCustomGroupByVisibility(group) {
    const { source, presentations } = group;
    return { source, presentations: presentations.filterBy('visible', true)};
  },
  _filterOriginGroupsByVisibility(groups) {
    return groups.map(group => {
      const { source, presentations } = group;
      return { source, presentations: presentations.filterBy('visible', true)};
    });
  },

  // 针对所有可能的过滤条件进行重新计算最终输出的数据组
  customGroup: computed('_customGroup', 'searchTerm', 'currentTypeFilter', 'visibleOnly', function() {
    let group = get(this, '_customGroup');

    if (isPresent(get(this, 'searchTerm'))) {
      group = this._applySearchTermToCustomGroup(group, get(this, 'searchTerm'));
    }

    if (defaultType.type !== get(this, 'currentTypeFilter')) {
      group = this._applyTypeFilterToCustomGroup(group, get(this, 'currentTypeFilter'));
    }

    if (get(this, 'visibleOnly')) {
      group = this._filterCustomGroupByVisibility(group);
    }

    return group;
  }),
  originGroups: computed('_originGroups', 'searchTerm', 'currentTypeFilter', 'visibleOnly', function() {
    let groups = get(this, '_originGroups');

    if (isPresent(get(this, 'searchTerm'))) {
      groups = this._applySearchTermToOriginGroups(groups, get(this, 'searchTerm'));
    }

    if (defaultType.type !== get(this, 'currentTypeFilter')) {
      groups = this._applyTypeFilterToOriginGroups(groups, get(this, 'currentTypeFilter'));
    }

    if (get(this, 'visibleOnly')) {
      groups = this._filterOriginGroupsByVisibility(groups);
    }

    return groups;
  }),

  // 是否开启拖拽
  draggable: false,

  // 是否显示序号
  showSerials: false

  // isOnSettingFilter: true,

  // isOnSetting: false,

  // isMaximized: false,
}).reopenClass({ positionalParams: ['model'] });
