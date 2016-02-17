var _ = require('lodash');

var reductio_ratio = {
  add: function(prior, path, field, filterValue) {
    return function(p, v, nf) {
      if (prior) prior(p, v, nf);

      var _val = _.get(v, field);
      var _match = (_val === filterValue);
      if (_match) {
        path(p).countFiltered++;
      }
      if (!_.isUndefined(_val)) {
        path(p).total++;
      }
      path(p).ratio = path(p).countFiltered / path(p).total;
      return p;
    };
  },
  remove: function(prior, path, filterValue) {
    return function(p, v, nf) {
      if (prior) prior(p, v, nf);

      var _val = _.get(v, field);
      var _match = (_val === filterValue);
      if (_match) {
        path(p).countFiltered--;
      }
      if (!_.isUndefined(_val)) {
        path(p).total--;
      }
      path(p).ratio = path(p).countFiltered / path(p).total;
      return p;
    };
  },
  initial: function(prior, path, filterValue) {
    return function(p) {
      if (prior) p = prior(p);
      path(p).total = 0;
      path(p).countFiltered = 0;
      path(p).ratio = undefined;
      return p;
    };
  }
};

module.exports = reductio_ratio;
