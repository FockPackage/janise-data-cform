import Component from 'ember-component';

export default Component.extend({
  tagName: '',

  actions: {
    openNewWindow(url) {
      window.open(url);
    }
  }
});
