import Component from 'ember-component';
import get from 'ember-metal/get';
import {isEmpty} from 'ember-utils';
import Chartist from 'chartist';

export default Component.extend({
  classNames: ['ct-chart', 'ct-octave'],
  localClassNames: ['chart'],

  didInsertElement() {
    this._super(...arguments);
    const {labels, series, options} = get(this, 'datum');
    if (isEmpty(labels) || isEmpty(series)) {
      return;
    }
    this.chart = new Chartist.Bar(this.element, {labels, series}, options);

    this.chart.on('draw', data => {
      if (data.type == 'bar') {
        data.element.animate({
          opacity: {
            begin: data.index * 100,
            dur: 400,
            from: 0,
            to: 1
          },
          y2: {
            begin: data.index * 100,
            dur: 200,
            from: data.y1,
            to: data.y2,
            easing: Chartist.Svg.Easing.easeInSine,
          }
        })
      }
    })
  }
}).reopenClass({positionalParams: ['datum']});
