/* globals paymill:true */
import DS from 'ember-data';
import PaymentType from 'ember-paymill/core/payment-type-model';
import computed from 'ember-new-computed';

/**
 * Payment Type Model for Paypal
 *
 * @class Paypal
 * @extends {PaymentType}
 */
export default PaymentType.extend({

	/**
	 * Paypal transactions require a checksum generated
	 * on the server with the private key and the payment data
	 * which will be sent with the transaction
	 * see {@link https://developers.paymill.com/API/index?javascript#export-refunds-list|Paymill Api}
	 *
	 *
	 * @property checksum
	 * @type {String}
	 */
	checksum:  PaymentType.attr('string'),

	/**
	 * url to redirect to if payment was successful
	 *
	 * @property return_url
	 * @type {String}
	 */
	return_url: PaymentType.attr('string'),

	/**
	 * the url to return to if the user cancels the transaction
	 *
	 * @property cancel_url
	 * @type {String}
	 */
	cancel_url: PaymentType.attr('string'),

	/**
	 * one of transaction|payment
	 *
	 * @property action
	 * @type {String}
	 */
	action: PaymentType.attr('paymentAction')

});
