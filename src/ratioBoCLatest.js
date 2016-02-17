var _ = require('lodash');

var reductio_ratioBoCLatest = {
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
      if (!_.isUndefined(_val)) {
        path(p).depField[_depFieldVal]['total']++;
      }
      // path(p).depField[_depFieldVal]['total']++;

      // console.log("path(p).sortFieldMax = %o", path(p).sortFieldMax);
      var _sortFieldMaxKeys = _.keys(path(p).sortFieldMax);
      if (_.isEmpty(_sortFieldMaxKeys)) {
        path(p).sortFieldMax[_sortFieldVal] = _depFieldVal;
      } else {
        var _currentMax = _.first(_sortFieldMaxKeys);
        if (_sortFieldVal > _currentMax) {
          delete path(p).sortFieldMax[_currentMax]; // remove current max
          path(p).sortFieldMax[_sortFieldVal] = _depFieldVal; // set new current max
        }
      }

      var _latest = path(p).sortFieldMax[_.first(_.keys(path(p).sortFieldMax))];
      // console.log("latest = %o", _latest);

      path(p).ratioBoCLatest = path(p).depField[_latest]['countFiltered'] / path(p).depField[_latest]['total'];
      // console.log("path(p).ratioBoCLatest = %o", path(p).ratioBoCLatest);
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

      if (!_.isUndefined(_val)) {
        path(p).depField[_depFieldVal]['total']--;
      }
      // path(p).depField[_depFieldVal]['total']--;

      // console.log("path(p).sortFieldMax = %o", path(p).sortFieldMax);
      var _sortFieldMaxKeys = _.keys(path(p).sortFieldMax);
      if (_.isEmpty(_sortFieldMaxKeys)) {
        path(p).sortFieldMax[_sortFieldVal] = _depFieldVal;
      } else {
        var _currentMax = _.first(_sortFieldMaxKeys);
        if (_sortFieldVal > _currentMax) {
          delete path(p).sortFieldMax[_currentMax]; // remove current max
          path(p).sortFieldMax[_sortFieldVal] = _depFieldVal; // set new current max
        }
      }

      var _latest = path(p).sortFieldMax[_.first(_.keys(path(p).sortFieldMax))];
      // console.log("latest = %o", _latest);

      path(p).ratioBoCLatest = path(p).depField[_latest]['countFiltered'] / path(p).depField[_latest]['total'];
      // console.log("path(p).ratioBoCLatest = %o", path(p).ratioBoCLatest);
      return p;
    };
  },
  initial: function(prior, path, filterValue, depField, sortField) {
    return function(p) {
      if (prior) p = prior(p);
      path(p).depField = {}; // key = depFieldValue, value = {countFiltered: xxx, total: yyy}
      path(p).sortFieldMax = {}; // key = max sortField seen upto now, value = depFieldValue (segmentId)
      path(p).ratioBoCLatest = undefined;
      return p;
    };
  }
};

module.exports = reductio_ratioBoCLatest;
