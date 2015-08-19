/* global paymill:true */
import Ember from 'ember';
import {
	serializeAttribute
} from './serializer';

function wrapError(model, name, key, validator) {
	var errors = model.get('errors'),
		isValid = false;

	try {
		isValid = Ember.run(null, validator);
	} catch(e) {
		if(typeof e === 'string') {
			key = e;
		}
	}

	var message = model.get('paymill').translationForKey('errors.' + key);

	if(!isValid) {
		errors.add(name, [message]);
	}
}

/**
 * Performs validation of the Payment Type Model.
 */
export default function validate(model, name, meta) {
	var options = meta.options,
		validator = options.validator,
		value = serializeAttribute(model, name, meta);

	if (options.required === false && !Ember.isPresent(value)) {
		return;
	}

	var errorKey = options.errorKey || 'unknown_error';

	if (typeof validator === 'function') {
		wrapError(model, name, errorKey, function customValidator() {
			return validator.call(model, value, name, meta);
		});
	} else if (Ember.canInvoke(paymill, validator)) {
		wrapError(model, name, errorKey, function paymilValidator() {
			return paymill[validator].call(paymill, value, true);
		});
	} else {
		Ember.Logger.warn('Unkown Paymill validator `' + validator + '`.');
	}
}

