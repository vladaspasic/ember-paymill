/* globals paymill:true */
import PaymentType from 'ember-paymill/core/payment-type-model';
import computed from 'ember-new-computed';

/**
 * Model representing the Credit Card payment
 * details.
 *
 * @class CreditCard
 * @extends {PaymentType}
 */
export default PaymentType.extend({

	/**
	 * Defines a Credit Card number
	 *
	 * @property number
	 * @type {String}
	 */
	number: PaymentType.attr('number', {
		validator: 'validateCardNumber',
		errorKey: paymill.E_CC_INVALID_NUMBER
	}),

	/**
	 * Credit card verification value code.
	 *
	 * @property cvc
	 * @type {String}
	 */
	cvc: PaymentType.attr('cvc', {
		validator: function() {
			return true;
		},
		errorKey: paymill.E_CC_INVALID_CVC
	}),

	/**
	 * Expiry month of the credit card.
	 *
	 * @property expiry
	 * @type {String}
	 */
	expiryMonth: PaymentType.attr('exp_month', {
		errorKey: paymill.E_CC_INVALID_EXP_YEAR
	}),

	/**
	 * Expiry Year of the credit card.
	 *
	 * @property expiry
	 * @type {String}
	 */
	expiryYear: PaymentType.attr('exp_year', {
		errorKey: paymill.E_CC_INVALID_EXP_YEAR
	}),

	/**
	 * Name of the Credit card holder.
	 *
	 * This attribute is not required.
	 *
	 * @property number
	 * @type {String}
	 */
	holder: PaymentType.attr('cardholder', {
		required: false,
		validator: 'validateHolder',
		errorKey: paymill.E_CC_INVALID_HOLDER
	}),

	/**
	 * Resolve the Credit Card type from Number.
	 *
	 * @property cardType
	 * @type {String}
	 * @readOnly
	 */
	cardType: computed('number', {
		get: function() {
			var number = this.get('number');

			return paymill.cardType(number);
		}
	}),
});
