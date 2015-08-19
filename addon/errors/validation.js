import Ember from 'ember';

/**
 * Error that is throw when a Model is invalid.
 *
 * @param {DS.Errors} errors
 * @class PaymillValidationError
 */
function PaymillValidationError(errors) {
	Ember.Error.call(this, 'Invalid payment data.');
	this.errors = errors;
}

PaymillValidationError.prototype = Ember.create(Ember.Error.prototype);

export default PaymillValidationError;
