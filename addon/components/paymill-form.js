import Ember from 'ember';

/**
 * Component used to render the Paymill Payment Type models.
 *
 * This component would handle the validation and creation
 * of the Paymill Token object needed to complete the payment
 * transaction.
 *
 * When a Token is created, a `token` action is triggered with
 * the Token Model.
 *
 * If an error occurs during this process, an `error` action is
 * sent with the `PaymillError` object.
 *
 * In case the Payment Type model is invalid an `invalid` action
 * is sent with the `PaymillValidationError`.
 *
 * @class PaymillFormComponent
 * @extends {Ember.Component}
 */
export default Ember.Component.extend({
	tagName: 'form',
	classNames: 'paymill-form',

	/**
	 * Property that would be true when the Form is submited and the
	 * Token is beeing created.
	 *
	 * @property isPending
	 * @type {Boolean}
	 * @default false
	 */
	isPending: false,

	/**
	 * Parameter that must be defined with a valid Payment type model.
	 *
	 * @property content
	 * @type {PaymentType}
	 */
	content: null,

	init: function() {
		var content = this.get('content');
		Ember.assert('You must define the `content` parameter.', Ember.isPresent(content));

		this._super();
	},

	eventManager: {
		submit: function(e, view) {
			e.preventDefault();

			var content = view.get('content');

			view.set('isPending', true);

			content.createToken().then(function(token) {
				view.sendAction('token', token);
			}, function(error) {
				if (content.get('isValid')) {
					view.sendAction('error', error);
				} else {
					view.sendAction('invalid', error);
				}
			})['finally'](function() {
				view.set('isPending', false);
			});
		}
	}
});
