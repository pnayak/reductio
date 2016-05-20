var reductio_filter = require('./filter.js');
var reductio_count = require('./count.js');
var reductio_customjs = require('./customjs.js');
var reductio_ratio = require('./ratio.js');
var reductio_ratioBoCFirst = require('./ratioBoCFirst.js');
var reductio_ratioBoCLatest = require('./ratioBoCLatest.js');
var reductio_jsCustom = require('./jsCustom.js');
var reductio_sum = require('./sum.js');
var reductio_avg = require('./avg.js');
var reductio_avgRounded = require('./avgRounded.js');
var reductio_median = require('./median.js');
var reductio_min = require('./min.js');
var reductio_max = require('./max.js');
var reductio_value_count = require('./value-count.js');
var reductio_value_list = require('./value-list.js');
var reductio_exception_count = require('./exception-count.js');
var reductio_exception_sum = require('./exception-sum.js');
var reductio_histogram = require('./histogram.js');
var reductio_sum_of_sq = require('./sum-of-squares.js');
var reductio_std = require('./std.js');
var reductio_nest = require('./nest.js');
var reductio_alias = require('./alias.js');
var reductio_alias_prop = require('./aliasProp.js');
var reductio_data_list = require('./data-list.js');

function build_function(p, f, path) {
  // We have to build these functions in order. Eventually we can include dependency
  // information and create a dependency graph if the process becomes complex enough.

  if (!path) path = function(d) {
    return d;
  };

  // Keep track of the original reducers so that filtering can skip back to
  // them if this particular value is filtered out.
  var origF = {
    reduceAdd: f.reduceAdd,
    reduceRemove: f.reduceRemove,
    reduceInitial: f.reduceInitial
  };

  if (p.count || p.std) {
    f.reduceAdd = reductio_count.add(f.reduceAdd, path);
    f.reduceRemove = reductio_count.remove(f.reduceRemove, path);
    f.reduceInitial = reductio_count.initial(f.reduceInitial, path);
  }

  if (p.customjs) {
    // console.log("$$$$$$ build: build_functio () - p = %o f = %o path = %o", p, f, path);

    var customAddFn = new Function(['p', 'v', 'path'], '"use strict";' + p['customJS']['jsCustomAdd']);
    var customRemoveFn = new Function(['p', 'v', 'path'], '"use strict";' + p['customJS']['jsCustomRemove']);
    var customInitialFn = new Function(['p', 'path'], '"use strict";' + p['customJS']['jsCustomInitial']);

    f.reduceAdd = reductio_customjs.add(f.reduceAdd, path, customAddFn);
    f.reduceRemove = reductio_customjs.remove(f.reduceRemove, path, customRemoveFn);
    f.reduceInitial = reductio_customjs.initial(f.reduceInitial, path, customInitialFn);
  }

  if (p.ratio) {
    // console.log("$$$$$$ build: build_functio () - p = %o f = %o path = %o", p, f, path);
    f.reduceAdd = reductio_ratio.add(f.reduceAdd, path, p.ratioField, p.ratioFilterValue);
    f.reduceRemove = reductio_ratio.remove(f.reduceRemove, path, p.ratioField, p.ratioFilterValue);
    f.reduceInitial = reductio_ratio.initial(f.reduceInitial, path, p.ratioField, p.ratioFilterValue);
  }

  if (p.ratioBoCFirst) {
    // console.log("$$$$$$ build: build_functio () - p = %o f = %o path = %o", p, f, path);
    f.reduceAdd = reductio_ratioBoCFirst.add(f.reduceAdd, path, p.ratioBoCFirstField, p.ratioBoCFirstFilterValue, p.ratioBoCFirstDepField, p.ratioBoCFirstSortField);
    f.reduceRemove = reductio_ratioBoCFirst.remove(f.reduceRemove, path, p.ratioBoCFirstField, p.ratioBoCFirstFilterValue, p.ratioBoCFirstDepField, p.ratioBoCFirstSortField);
    f.reduceInitial = reductio_ratioBoCFirst.initial(f.reduceInitial, path, p.ratioBoCFirstField, p.ratioBoCFirstFilterValue, p.ratioBoCFirstDepField, p.ratioBoCFirstSortField);
  }

  if (p.ratioBoCLatest) {
    // console.log("$$$$$$ build: build_functio () - p = %o f = %o path = %o", p, f, path);
    f.reduceAdd = reductio_ratioBoCLatest.add(f.reduceAdd, path, p.ratioBoCLatestField, p.ratioBoCLatestFilterValue, p.ratioBoCLatestDepField, p.ratioBoCLatestSortField);
    f.reduceRemove = reductio_ratioBoCLatest.remove(f.reduceRemove, path, p.ratioBoCLatestField, p.ratioBoCLatestFilterValue, p.ratioBoCLatestDepField, p.ratioBoCLatestSortField);
    f.reduceInitial = reductio_ratioBoCLatest.initial(f.reduceInitial, path, p.ratioBoCLatestField, p.ratioBoCLatestFilterValue, p.ratioBoCLatestDepField, p.ratioBoCLatestSortField);
  }

  if (p.jsCustom) {
    // console.log("$$$$$$ build: build_functio () - p = %o f = %o path = %o", p, f, path);
    f.reduceAdd = reductio_jsCustom.add(f.reduceAdd, path, p.jsCustomField, p.jsCustomAdd, p.jsCustomRemove, p.jsCustomInitial);
    f.reduceRemove = reductio_jsCustom.remove(f.reduceRemove, path, p.jsCustomField, p.jsCustomAdd, p.jsCustomRemove, p.jsCustomInitial);
    f.reduceInitial = reductio_jsCustom.initial(f.reduceInitial, path, p.jsCustomField, p.jsCustomAdd, p.jsCustomRemove, p.jsCustomInitial);
  }

  if (p.sum) {
    f.reduceAdd = reductio_sum.add(p.sum, f.reduceAdd, path);
    f.reduceRemove = reductio_sum.remove(p.sum, f.reduceRemove, path);
    f.reduceInitial = reductio_sum.initial(f.reduceInitial, path);
  }

  if (p.avg) {
    if (!p.count || !p.sum) {
      console.error("You must set .count(true) and define a .sum(accessor) to use .avg(true).");
    } else {
      f.reduceAdd = reductio_avg.add(p.sum, f.reduceAdd, path);
      f.reduceRemove = reductio_avg.remove(p.sum, f.reduceRemove, path);
      f.reduceInitial = reductio_avg.initial(f.reduceInitial, path);
    }
  }

  if (p.avgRounded) {
    if (!p.count || !p.sum) {
      console.error("You must set .count(true) and define a .sum(accessor) to use .avgRounded(true).");
    } else {
      f.reduceAdd = reductio_avgRounded.add(p.sum, f.reduceAdd, path);
      f.reduceRemove = reductio_avgRounded.remove(p.sum, f.reduceRemove, path);
      f.reduceInitial = reductio_avgRounded.initial(f.reduceInitial, path);
    }
  }

  // The unique-only reducers come before the value_count reducers. They need to check if
  // the value is already in the values array on the group. They should only increment/decrement
  // counts if the value not in the array or the count on the value is 0.
  if (p.exceptionCount) {
    if (!p.exceptionAccessor) {
      console.error("You must define an .exception(accessor) to use .exceptionCount(true).");
    } else {
      f.reduceAdd = reductio_exception_count.add(p.exceptionAccessor, f.reduceAdd, path);
      f.reduceRemove = reductio_exception_count.remove(p.exceptionAccessor, f.reduceRemove, path);
      f.reduceInitial = reductio_exception_count.initial(f.reduceInitial, path);
    }
  }

  if (p.exceptionSum) {
    if (!p.exceptionAccessor) {
      console.error("You must define an .exception(accessor) to use .exceptionSum(accessor).");
    } else {
      f.reduceAdd = reductio_exception_sum.add(p.exceptionAccessor, p.exceptionSum, f.reduceAdd, path);
      f.reduceRemove = reductio_exception_sum.remove(p.exceptionAccessor, p.exceptionSum, f.reduceRemove, path);
      f.reduceInitial = reductio_exception_sum.initial(f.reduceInitial, path);
    }
  }

  // Maintain the values array.
  if (p.valueList || p.median || p.min || p.max) {
    f.reduceAdd = reductio_value_list.add(p.valueList, f.reduceAdd, path);
    f.reduceRemove = reductio_value_list.remove(p.valueList, f.reduceRemove, path);
    f.reduceInitial = reductio_value_list.initial(f.reduceInitial, path);
  }

  // Maintain the data array.
  if (p.dataList) {
    f.reduceAdd = reductio_data_list.add(p.dataList, f.reduceAdd, path);
    f.reduceRemove = reductio_data_list.remove(p.dataList, f.reduceRemove, path);
    f.reduceInitial = reductio_data_list.initial(f.reduceInitial, path);
  }

  if (p.median) {
    f.reduceAdd = reductio_median.add(f.reduceAdd, path);
    f.reduceRemove = reductio_median.remove(f.reduceRemove, path);
    f.reduceInitial = reductio_median.initial(f.reduceInitial, path);
  }

  if (p.min) {
    f.reduceAdd = reductio_min.add(f.reduceAdd, path);
    f.reduceRemove = reductio_min.remove(f.reduceRemove, path);
    f.reduceInitial = reductio_min.initial(f.reduceInitial, path);
  }

  if (p.max) {
    f.reduceAdd = reductio_max.add(f.reduceAdd, path);
    f.reduceRemove = reductio_max.remove(f.reduceRemove, path);
    f.reduceInitial = reductio_max.initial(f.reduceInitial, path);
  }

  // Maintain the values count array.
  if (p.exceptionAccessor) {
    f.reduceAdd = reductio_value_count.add(p.exceptionAccessor, f.reduceAdd, path);
    f.reduceRemove = reductio_value_count.remove(p.exceptionAccessor, f.reduceRemove, path);
    f.reduceInitial = reductio_value_count.initial(f.reduceInitial, path);
  }

  // Histogram
  if (p.histogramValue && p.histogramThresholds) {
    f.reduceAdd = reductio_histogram.add(p.histogramValue, f.reduceAdd, path);
    f.reduceRemove = reductio_histogram.remove(p.histogramValue, f.reduceRemove, path);
    f.reduceInitial = reductio_histogram.initial(p.histogramThresholds, f.reduceInitial, path);
  }

  // Sum of Squares
  if (p.sumOfSquares) {
    f.reduceAdd = reductio_sum_of_sq.add(p.sumOfSquares, f.reduceAdd, path);
    f.reduceRemove = reductio_sum_of_sq.remove(p.sumOfSquares, f.reduceRemove, path);
    f.reduceInitial = reductio_sum_of_sq.initial(f.reduceInitial, path);
  }

  // Standard deviation
  if (p.std) {
    if (!p.sumOfSquares || !p.sum) {
      console.error("You must set .sumOfSq(accessor) and define a .sum(accessor) to use .std(true). Or use .std(accessor).");
    } else {
      f.reduceAdd = reductio_std.add(f.reduceAdd, path);
      f.reduceRemove = reductio_std.remove(f.reduceRemove, path);
      f.reduceInitial = reductio_std.initial(f.reduceInitial, path);
    }
  }

  // Nesting
  if (p.nestKeys) {
    f.reduceAdd = reductio_nest.add(p.nestKeys, f.reduceAdd, path);
    f.reduceRemove = reductio_nest.remove(p.nestKeys, f.reduceRemove, path);
    f.reduceInitial = reductio_nest.initial(f.reduceInitial, path);
  }

  // Alias functions
  if (p.aliasKeys) {
    f.reduceInitial = reductio_alias.initial(f.reduceInitial, path, p.aliasKeys);
  }

  // Alias properties - this is less efficient than alias functions
  if (p.aliasPropKeys) {
    f.reduceAdd = reductio_alias_prop.add(p.aliasPropKeys, f.reduceAdd, path);
    // This isn't a typo. The function is the same for add/remove.
    f.reduceRemove = reductio_alias_prop.add(p.aliasPropKeys, f.reduceRemove, path);
  }

  // Filters determine if our built-up priors should run, or if it should skip
  // back to the filters given at the beginning of this build function.
  if (p.filter) {
    f.reduceAdd = reductio_filter.add(p.filter, f.reduceAdd, origF.reduceAdd, path);
    f.reduceRemove = reductio_filter.remove(p.filter, f.reduceRemove, origF.reduceRemove, path);
  }

  // Values go last.
  if (p.values) {
    Object.getOwnPropertyNames(p.values).forEach(function(n) {
      // Set up the path on each group.
      var setupPath = function(prior) {
        return function(p) {
          p = prior(p);
          path(p)[n] = {};
          return p;
        };
      };
      f.reduceInitial = setupPath(f.reduceInitial);
      build_function(p.values[n].parameters, f, function(p) {
        return p[n];
      });
    });
  }
}

var reductio_build = {
  build: build_function
};

module.exports = reductio_build;
