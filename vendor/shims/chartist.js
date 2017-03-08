(function() {
  function vendorModule() {
    'use strict';

    return { 'default': self['Chartist'] };
  }

  define('chartist', [], vendorModule);
})();
