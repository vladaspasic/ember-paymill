import Ember from 'ember';
import ENV from '../config/environment';

export function initialize(container, application) {
	if (ENV.paymill && ENV.paymill.async === true) {
		application.deferReadiness();

		if (typeof ENV.paymill.apiKey !== 'string') {
			throw new Error('You must define a `paymil.apiKey` in your Brocfile.js configuration.');
		}

		window['PAYMILL_PUBLIC_KEY'] = ENV.paymill.apiKey;
		Ember.$.getScript(ENV.paymill.script).always(function() {
			application.advanceReadiness();
		});
	}

}

export default {
	name: 'paymill',
	initialize: initialize
};
