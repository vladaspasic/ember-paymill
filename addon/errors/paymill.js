import Ember from 'ember';

/**
 * Error that is throw by the Paymill service
 * when using the Paymill Bridge API.
 *
 * @param {String} message
 * @param {String} key
 * @class PaymillError
 */
function PaymillError(message, key, error) {
	Ember.Error.call(this, message);
	this.key = key;
	this.error = error;
}

PaymillError.prototype = Ember.create(Ember.Error.prototype);

export default PaymillError;
