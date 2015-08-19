export default {
	'credit-card': 'Credit card',
	'direct-debit': 'Direct debit',
	'sepa': 'SEPA',
	errors: {
		internal_server_error: 'An error occurred, but nothing was billed. Please try again',
		invalid_public_key: 'Invalid Paymill API key.',
		invalid_payment_data: 'Invalid payment data or this method is not supported for this payment type',
		unknown_error: 'Sorry, an unexpected error occurred. Please try again later',
		'3ds_cancelled': 'Payment was canceled by user',
		field_invalid_card_number: 'Invalid card number',
		field_invalid_card_exp_year: 'Invalid expiry date',
		field_invalid_card_exp_month: 'Invalid expiry date',
		field_invalid_card_exp: 'Invalid expiry date',
		field_invalid_card_cvc: 'Invalid CVC',
		field_invalid_card_holder: 'Please enter the card holder name',
		field_invalid_amount_int: 'Invalid payment amount',
		field_invalid_currency: 'Invalid currency format',
		field_invalid_account_number: 'Please enter a valid account number',
		field_invalid_account_holder: 'Please enter the account holder name',
		field_invalid_bank_code: 'Please enter a valid bank code',
		field_invalid_iban: 'Please enter a valid IBAN',
		field_invalid_bic: 'Please enter a valid BIC',
		field_invalid_country: 'Invalid country',
		field_invalid_bank_data: 'Invalid bank data'
	}
};
