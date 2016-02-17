var reductio_customjs = {
	add: function(prior, path, customJSFn) {
		return function (p, v, nf) {
			if(prior) prior(p, v, nf);
			return customJSFn(p, v, path);
		};
	},
	remove: function(prior, path, customJSFn) {
		return function (p, v, nf) {
			if(prior) prior(p, v, nf);
			return customJSFn(p, v, path);
		};
	},
	initial: function(prior, path, customJSFn) {
		return function (p) {
			if(prior) p = prior(p);
			return customJSFn(p, path);
		};
	}
};

module.exports = reductio_customjs;