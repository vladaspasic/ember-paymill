/* jshint node: true */
'use strict';

module.exports = {
	name: 'ember-paymill',

	contentFor: function(type, config) {
		var content = [];

		if (type === 'head') {
			if (!config.paymill || !config.paymill.apiKey) {
				console.error('Please specify your paymill.apiKey in your configuration.');
			} else {
				content = [
					'<script type="text/javascript">',
					'\tvar PAYMILL_PUBLIC_KEY = "' + config.paymill.apiKey + '";',
					'</script>',
				];
			}
		}

		if(type === 'body-footer') {
			content = ['<script type="text/javascript" src="https://bridge.paymill.com/"></script>'];
		}

		return content;
	}
};
