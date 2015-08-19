import Ember from 'ember';

/**
 * Serialize the Amount into a Paymill compatible format.
 *
 * Eg. 20.00 into 2000, or 19.99 into 1999
 */
export function serializeAmount(value) {
	var intValue = parseInt(value.replace(/[\.,]/, '.'), 10);

	return intValue * 100;
}

/**
 * Serialize an Attribute
 */
export function serializeAttribute(model, name) {
	var value = Ember.get(model, name);

	if (Ember.isEmpty(value)) {
		return null;
	}

	if (name === 'amount') {
		return serializeAmount(value);
	} else {
		return value;
	}
}

/**
 * Serialize the Payment Type Model Attribute
 */
export default function serialize(model) {
	var hash = {};

	model.eachAttribute(function(name, meta) {
		var key = meta.type;

		hash[key] = serializeAttribute(this, name, meta);
	}, model);

	return hash;

}
