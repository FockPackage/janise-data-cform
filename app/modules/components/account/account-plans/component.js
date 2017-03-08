import Component from 'ember-component';
import inject from 'ember-service/inject';

export default Component.extend({
  bodyScroll: inject('cform-body-scroll'),
  isShow: { upgradePlan: false },

  actions: {
    toggleModal(type) {
      this.toggleProperty(`isShow.${type}`)
      this.get('bodyScroll').toggle();
    },

    clickBackground(type, e) {
      if (e.target.className === 'static-background') {
        this.get('actions').toggleModal.call(this, type);
      }
    },
  }
});
