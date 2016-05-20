var reductio_avgRounded = {
  add: function(a, prior, path) {
    return function(p, v, nf) {
      if (prior) prior(p, v, nf);
      if (path(p).count > 0) {
        path(p).avgRounded = roound(path(p).sum / path(p).count);
      } else {
        path(p).avgRounded = 0;
      }
      return p;
    };
  },
  remove: function(a, prior, path) {
    return function(p, v, nf) {
      if (prior) prior(p, v, nf);
      if (path(p).count > 0) {
        path(p).avgRounded = round(path(p).sum / path(p).count);
      } else {
        path(p).avgRounded = 0;
      }
      return p;
    };
  },
  initial: function(prior, path) {
    return function(p) {
      p = prior(p);
      path(p).avgRounded = 0;
      return p;
    };
  }
};

module.exports = reductio_avgRounded;
