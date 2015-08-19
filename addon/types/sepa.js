/* globals paymill:true */
import Ember from 'ember';
import DS from 'ember-data';
import PaymentType from 'ember-paymill/core/payment-type-model';

/**
 * PaymentType representing the SEPA payment
 * details.
 *
 * @class SEPA
 * @extends {PaymentType}
 */
export default PaymentType.extend({

	/**
	 * IBAN (Internation bank account Number) value.
	 *
	 * @property iban
	 * @type {String}
	 */
	iban: PaymentType.attr('iban', {
		errorKey: paymill.E_DD_INVALID_IBAN
	}),

	/**
	 * BIC (Bank identifier code) value.
	 *
	 * @property currency
	 * @type {String}
	 */
	bic: PaymentType.attr('bic', {
		errorKey: paymill.E_DD_INVALID_BIC
	}),

	/**
	 * Resolves the Bank name for the IBAN number.
	 *
	 * This method returns a Promise Proxy object which
	 * would contain the Bank name.
	 *
	 * @property bankName
	 * @type {String}
	 */
	bankName: Ember.computed({
		get: function() {
			var iban = this.get('iban'),
				bankCode = '';

			if(paymill.validateIban(iban)) {
				bankCode = paymill.getBlzFromBankParam(iban);
			}

			return DS.PromiseObject.create({
				promise: this.paymill.getBankName(bankCode)
			});
		}
	}).property('iban'),

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
