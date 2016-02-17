var _ = require('lodash');

var reductio_jsCustom = {
  add: function(prior, path, field, jsCustomAdd, jsCustomRemove, jsCustomInitial) {
    return function(p, v, nf) {
      if (prior) prior(p, v, nf);

      var addFn = new Function(['p', 'v', 'path'], '"use strict";' + jsCustomAdd);

      addFn(p, v, path);
      
      return p;
    };
  },
  remove: function(prior, path, field, jsCustomAdd, jsCustomRemove, jsCustomInitial) {
    return function(p, v, nf) {
      if (prior) prior(p, v, nf);

      var removeFn = new Function(['p', 'v', 'path'], '"use strict";' + jsCustomRemove);

      removeFn(p, v, path);

      return p;
    };
  },
  initial: function(prior, path, field, jsCustomAdd, jsCustomRemove, jsCustomInitial) {
    return function(p) {
      if (prior) p = prior(p);

      var initialFn = new Function(['p', 'path'], '"use strict";' + jsCustomInitial);

      initialFn(p, path);

      return p;
    };
  }
};

module.exports = reductio_jsCustom;
