/* jshint node: true */
'use strict';

function defaults(obj, source) {
	if (source) {
		for (var prop in source) {
			if (obj[prop] === void 0) {
				obj[prop] = source[prop];
			}
		}
	}

	return obj;
}

module.exports = {
	name: 'ember-paymill',

	included: function(app) {
		this.options = app.options.paymill || {};
		this._super.included(app);
	},

	config: function(environment, config) {
		// Do nothing if the addon is not yet included
		if (!this.options) {
			return;
		}

		// Expose the options to the ENV configuration
		config.paymill = defaults(this.options, {
			apiKey: false,
			async: false,
			script: 'https://bridge.paymill.com'
		});
	},

	contentFor: function(type, config) {
		var content = [];

		// Only load if it's set to `true` as it could be
		// `null` or `undefined`, then we assume the user would load it
		if (config.paymill.async === true) {
			return content;
		}

		if(typeof config.paymill.apiKey !== 'string') {
			throw new Error('You must define a `paymil.apiKey` in your Brocfile.js configuration.');
		}

		if (type === 'head') {
			content = [
				'<script type="text/javascript">',
				'\tvar PAYMILL_PUBLIC_KEY = "' + config.paymill.apiKey + '";',
				'</script>',
			];
		}

		if (type === 'body-footer') {
			content = ['<script type="text/javascript" src="' + config.paymill.script + '"></script>'];
		}

		return content;
	}
};
