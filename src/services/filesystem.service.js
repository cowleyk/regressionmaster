(function() {
  'use strict';

  angular.module('app')
    .service('filesystem', service)

  function service() {
    this.fs = require('fs');
  }

}());
