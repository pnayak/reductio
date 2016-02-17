var _ = require('lodash');

var reductio_ratioBoCFirst = {
  add: function(prior, path, field, filterValue, depField, sortField) {
    return function(p, v, nf) {
      if (prior) prior(p, v, nf);

      var _depFieldVal = _.get(v, depField);
      var _sortFieldVal = _.get(v, sortField);
      var _val = _.get(v, field);
      var _match = (_val === filterValue);

      if (_.isUndefined(path(p).depField[_depFieldVal])) {
        path(p).depField[_depFieldVal] = {
          'countFiltered': 0,
          'total': 0
        };
      }

      if (_match) {
        path(p).depField[_depFieldVal]['countFiltered']++;
      }
      path(p).depField[_depFieldVal]['total']++;

      // console.log("path(p).sortFieldMax = %o", path(p).sortFieldMax);
      var _sortFieldMinKeys = _.keys(path(p).sortFieldMin);
      if (_.isEmpty(_sortFieldMinKeys)) {
        path(p).sortFieldMin[_sortFieldVal] = _depFieldVal;
      } else {
        var _currentMin = _.first(_sortFieldMinKeys);
        if (_sortFieldVal < _currentMin) {
          delete path(p).sortFieldMin[_currentMin]; // remove current min
          path(p).sortFieldMin[_sortFieldVal] = _depFieldVal; // set new current min
        }
      }

      var _first = path(p).sortFieldMin[_.first(_.keys(path(p).sortFieldMin))];
      // console.log("latest = %o", _latest);

      path(p).ratioBoCFirst = path(p).depField[_first]['countFiltered'] / path(p).depField[_first]['total'];
      // console.log("path(p).ratioBoCFirst = %o", path(p).ratioBoCFirst);
      return p;
    };
  },
  remove: function(prior, path, filterValue, depField, sortField) {
    return function(p, v, nf) {
      if (prior) prior(p, v, nf);

      var _depFieldVal = _.get(v, depField);
      var _sortFieldVal = _.get(v, sortField);
      var _val = _.get(v, field);
      var _match = (_val === filterValue);

      if (_.isUndefined(path(p).depField[_depFieldVal])) {
        path(p).depField[_depFieldVal] = {
          'countFiltered': 0,
          'total': 0
        };
      }

      if (_match) {
        path(p).depField[_depFieldVal]['countFiltered']--;
      }
      path(p).depField[_depFieldVal]['total']--;

      // console.log("path(p).sortFieldMax = %o", path(p).sortFieldMax);
      var _sortFieldMinKeys = _.keys(path(p).sortFieldMin);
      if (_.isEmpty(_sortFieldMinKeys)) {
        path(p).sortFieldMin[_sortFieldVal] = _depFieldVal;
      } else {
        var _currentMin = _.first(_sortFieldMinKeys);
        if (_sortFieldVal < _currentMin) {
          delete path(p).sortFieldMin[_currentMin]; // remove current min
          path(p).sortFieldMin[_sortFieldVal] = _depFieldVal; // set new current min
        }
      }

      var _first = path(p).sortFieldMin[_.first(_.keys(path(p).sortFieldMin))];
      // console.log("latest = %o", _latest);

      path(p).ratioBoCFirst = path(p).depField[_first]['countFiltered'] / path(p).depField[_first]['total'];
      // console.log("path(p).ratioBoCFirst = %o", path(p).ratioBoCFirst);
      return p;
    };
  },
  initial: function(prior, path, filterValue, depField, sortField) {
    return function(p) {
      if (prior) p = prior(p);
      path(p).depField = {}; // key = depFieldValue, value = {countFiltered: xxx, total: yyy}
      path(p).sortFieldMin = {}; // key = min sortField seen upto now, value = depFieldValue (segmentId)
      path(p).ratioBoCFirst = undefined;
      return p;
    };
  }
};

module.exports = reductio_ratioBoCFirst;
