import Component from 'ember-component';
import get from 'ember-metal/get';
import set from 'ember-metal/set';

export default Component.extend({
  tagName: '',

  didReceiveAttrs() {
    const id = get(this, 'destinationFolderId');
    const destinationFolder = get(this, 'folderList').findBy('FolderID', id);
    set(this, 'destinationFolder', destinationFolder);
  }
});
