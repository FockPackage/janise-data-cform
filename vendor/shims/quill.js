(function() {
  function vendorModule() {
    'use strict';

    return { 'default': self['Quill'] };
  }

  define('quill', [], vendorModule);
})();
