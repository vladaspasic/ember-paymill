/* globals paymill:true */
import Ember from 'ember';
import DS from 'ember-data';
import PaymentType from 'ember-paymill/core/payment-type-model';

/**
 * Payment Type Model representing the ELV (Elektronisches Lastschriftverfahren)
 * Direct debit payment method.
 *
 * @class SEPA
 * @extends {PaymentType}
 */
export default PaymentType.extend({

	/**
	 * Defines a Bank account number
	 *
	 * @property number
	 * @type {String}
	 */
	number: PaymentType.attr('number', {
		validator: 'validateAccountNumber',
		errorKey: paymill.E_DD_INVALID_NUMBER
	}),

	/**
	 * Bank code number, this number consists out of 8 digits.
	 *
	 * @property bank
	 * @type {String}
	 */
	bank: PaymentType.attr('bank', {
		validator: 'validateBankCode',
		errorKey: paymill.E_DD_INVALID_BANK
	}),

	/**
	 * Resolves the Bank name for the Bank code number.
	 *
	 * This method returns a Promise Proxy object which
	 * would contain the Bank name.
	 *
	 * @property bankName
	 * @type {String}
	 */
	bankName: Ember.computed({
		get: function() {
			var bankCode = this.get('bank');

			return DS.PromiseObject.create({
				promise: this.paymill.getBankName(bankCode)
			});
		}
	}).property('bank'),

	/**
	 * Name of the Bank account holder.
	 *
	 * This attribute is not required.
	 *
	 * @property number
	 * @type {String}
	 */
	holder: PaymentType.attr('accountholder', {
		required: false,
		validator: 'validateHolder',
		errorKey: paymill.E_DD_INVALID_HOLDER
	})
});
