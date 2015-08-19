/* global paymill:true */
import Ember from 'ember';
import DS from 'ember-data';
import serialize from 'ember-paymill/core/serializer';
import validate from 'ember-paymill/core/validation';
import ValidationError from 'ember-paymill/errors/validation';

// Create the validator name from the attr type
function buildValidatorName(type) {
	// if(type === 'amount_int') {
	// 	return 'validateAmount';
	// }

	var classified = Ember.String.classify(type);
	return 'validate' + classified;
}

// Define the Attribute function
function attribute(type, options) {
	Ember.assert('You must define a type for this attribute.', typeof type === 'string');

	options = options || {};
	options.validator = options.validator || buildValidatorName(type);

	var meta = {
		type: type,
		options: options || {},
		isAttribute: true
	};

	return Ember.computed({
		get: function(key) {
			return Ember.get(this._data, key);
		},

		set: function(key, value) {
			var oldValue = Ember.get(this._data, key);

			if (oldValue !== value) {
				// Clear errors for this attribute
				Ember.get(this, 'errors').remove(key);

				return Ember.set(this._data, key, value);
			}
		}
	}).property('data').meta(meta);
}

/**
 * Represents a Base Paymill payment type Model
 * used by this Addon.
 *
 * @class PaymentType
 * @extends {Ember.Object}
 */
var PaymentType = Ember.Object.extend({

	/**
	 * This property holds all the attribute values
	 * defined for this Payment Type.
	 *
	 * @property _data
	 * @private
	 * @type {Object}
	 */
	_data: Ember.create(null),

	data: Ember.computed.readOnly('_data'),

	/**
	 * If this property is `true` the Model has no validation errors.
	 *
	 * @property isValid
	 * @type {Boolean}
	 * @readOnly
	 */
	isValid: Ember.computed.readOnly('errors.isEmpty'),

	/**
	 * Defines the Transaction amount. Should be formated
	 * like `9.99`
	 *
	 * @property amount
	 * @type {String}
	 */
	amount: attribute('amount_int', {
		errorKey: paymill.E_CC_INVALID_AMOUNT_INT
	}),

	/**
	 * Currency for the Transaction
	 *
	 * @property currency
	 * @type {String}
	 */
	currency: attribute('currency', {
		errorKey: paymill.E_CC_INVALID_CURRENCY
	}),

	init: function() {
		this._super();

		this.errors = DS.Errors.create();
	},

	/**
	 * Serialize the Payment Type attributes into a JSON Object.
	 *
	 * @method serialize
	 * @return {Object}
	 */
	serialize: function() {
		return serialize(this);
	},

	/**
	 * Validate each attribute against the Paymill validators.
	 *
	 * Returns `true` if the Model is valid, `false` otherwise.
	 *
	 * @method validate
	 * @return {Boolean}
	 */
	validate: function() {
		this.eachAttribute(function(name, meta) {
			validate(this, name, meta);
		}, this);

		return this.get('isValid');
	},

	/**
	 * Create a Token for this Payment Type.
	 *
	 * @return {Ember.RSVP.Promise} [description]
	 */
	createToken: function() {
		if(this.validate()) {
			return this.paymill.createToken(this);
		} else {
			var errors = this.get('errors');

			return Ember.RSVP.reject(new ValidationError(errors));
		}
	},

	eachAttribute: function(callback, binding) {
		this.constructor.eachAttribute(callback, binding);
	}
});

PaymentType.reopenClass({

	/**
	 * Defines an attribute on all Paymill Payment Type models.
	 *
	 * It uses the similar syntax and approach as
	 * `DS.attr` method. The only difference here is that the
	 * `type` argument is used when the Payment Type is serialized so that
	 * it matches the Paymill API.
	 *
	 * The second aguments is an Object defining the meta properties
	 * of the attribute.
	 *
	 * Available options:
	 * - `required` is the attribute required
	 * - `errorKey` error key code when validation fails
	 * - `validator` the validation function name in the `paymill` namespace for this type
	 *
	 * @method attr
	 * @static
	 * @param {Object} options
	 * @return {Attribute}
	 */
	attr: attribute,

	/**
	 * Map whose keys are the attribute names of the model (defined by the `attr`)
	 * and whose values are the meta object for the property.
	 *
	 * @property attributes
	 * @readOnly
	 * @static
	 * @return {Ember.Map}
	 */
	attributes: Ember.computed(function() {
		var map = Ember.Map.create();

		this.eachComputedProperty(function(name, meta) {
			if (meta.isAttribute) {
				meta.name = name;
				map.set(name, meta);
			}
		});

		return map;
	}).readOnly(),

	/**
	 * Itereate through each attribute of the Payment Type Model.
	 *
	 * @method eachAttribute
	 * @static
	 * @param  {Function} callback
	 * @param  {Object}   context
	 */
	eachAttribute: function(callback, context) {
		Ember.get(this, 'attributes').forEach(function(meta, name) {
			callback.call(context, name, meta);
		}, context);
	}
});

export {
	PaymentType,
	attribute
};

export default PaymentType;
