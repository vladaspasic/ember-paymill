import Ember from 'ember';

/**
 * Component used to render the Paymill Credit Card or
 * Direct Debit models.
 *
 * This component would handle the validation and creation
 * of the Paymill Token object needed to complete the payment
 * transaction.
 *
 * When a Token is created, a `token` action is triggered with
 * the Token Model.
 *
 * If an error occurs during this process, or the data is invalid,
 * an `error` action is triggered with the Error object.
 *
 * @class PaymillFormComponent
 * @extends {Ember.Component}
 */
export default Ember.Component.extend({
	tagName: 'form',
	classNames: 'paymill-form',

	isPending: false,

	model: null,

	init: function() {
		var model = this.get('model');
		Ember.assert('You must define the `model` parameter.', Ember.isPresent(model));

		this._super();
	},

	eventManager: {
		submit: function(e, view) {
			var model = view.get('model');

			view.set('isPending', true);

			try {
				model.createToken(model).then(function(token) {
					console.log(token);

					view.sendAction('token', token);
				}, function(error) {
					console.warn(error);

					view.sendAction('error', error);
				})['finally'](function() {
					view.set('isPending', false);
				});
			} catch (e) {
				console.log(e);
			}

			return false;
		}
	}
});
