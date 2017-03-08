(function() {
  function vendorModule() {
    'use strict';

    return { 'default': self['flatpickr'] };
  }

  define('flatpickr', [], vendorModule);
})();
