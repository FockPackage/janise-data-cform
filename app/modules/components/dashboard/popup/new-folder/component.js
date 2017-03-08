import Component from 'ember-component';
import { A } from 'ember-array/utils';

export default Component.extend({
  tagName: '',

  didReceiveAttrs() {
    this._super(...arguments);

    const currentFolder = A(this.folderList).findBy('FolderID', this.currentFolderID);
    this.set('currentFolder', currentFolder);
  }
});
