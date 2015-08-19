import Ember from 'ember';
import CreditCard from 'ember-paymill/types/credit-card';
import SEPA from 'ember-paymill/types/sepa';
import ELV from 'ember-paymill/types/direct-debit';

function modelFor(type) {
	return Ember.computed(function(key) {
		return this.get('paymill').paymentFor(type);
	});
}

export default Ember.Controller.extend({
	paymill: Ember.inject.service(),

	model: modelFor('credit-card'),
	sepa: modelFor('sepa'),
	elv: modelFor('direct-debit')
});
