/* globals paymill:true */
import Ember from 'ember';
import PaymillError from 'ember-paymill/errors/paymill';
import {
	addTranslations,
	getTranslations
} from 'ember-paymill/core/translations';
import computed from 'ember-new-computed';

function resolvePaymentType(model) {
	return model &&
		model.constructor &&
		model.constructor.paymentType;
}

// Resolve the token callback with a Defered promise
function paymillCallbackResolver(service, resolver) {
	return function paymillCallback(error, token) {
		if (error) {
			var message = service.translationForKey('errors.' + error.apierror);

			resolver.reject(new PaymillError(message, error.apierror, error));
		} else {
			resolver.resolve(token);
		}
	};
}

// Create a 3-D Secure iFrame element
function createSecureIframe(data) {
	var url = data.url,
		params = data.params;

	var body = Ember.$('body');

	var iframe = document.createElement('iframe');
	iframe.className = 'paymil-iframe';
	iframe.setAttribute('data-paymill', 'iframe');

	body.prepend(iframe);

	var iframeDoc = iframe.contentWindow || iframe.contentDocument;

	if (iframeDoc.document) {
		iframeDoc = iframeDoc.document;
	}

	var form = iframeDoc.createElement('form');
	form.method = 'post';
	form.action = url;

	for (var k in params) {
		var input = iframeDoc.createElement('input');
		input.type = 'hidden';
		input.name = k;
		input.value = decodeURIComponent(params[k]);
		form.appendChild(input);
	}

	if (iframeDoc.body) {
		iframeDoc.body.appendChild(form);
	} else {
		iframeDoc.appendChild(form);
	}

	form.submit();
}

// Clear the 3-D Secure iFrame
function clearSecureIframe() {
	Ember.$('iframe[data-paymill="iframe"]').remove();
}

export default Ember.Service.extend({

	/**
	 * Current Locale, used to resolve the Message catalog.
	 *
	 * @property locale
	 * @type {String}
	 * @default en
	 */
	locale: 'en',

	/**
	 * Contains a translation Message registry for the current locale.
	 *
	 * @property translations
	 * @type {Object}
	 * @readOnly
	 */
	translations: computed('locale', {
		get: function() {
			var container = this.get('container'),
				locale = this.get('locale');

			var translations = getTranslations(container, locale);

			Ember.assert('No translation messages are registered for `' + locale + '` locale',
				Ember.isPresent(translations));

			return translations;
		}
	}),

	/**
	 * With this method you can add new translations at runtime.
	 *
	 * @method addTranslations
	 * @param {String} locale
	 * @param {Object} translations
	 */
	addTranslations: function(locale, translations) {
		addTranslations(this.get('container'), locale, translations);
	},

	/**
	 * Resolve the translation message for the given key.
	 *
	 * If nothing is found a debug message is returned.
	 *
	 * @method translationForKey
	 * @param  {String} key
	 * @return {String}
	 */
	translationForKey: function(key) {
		Ember.assert('Key must be a String.', typeof key === 'string');

		var translations = this.get('translations'),
			message = Ember.get(translations, key);

		if(Ember.isEmpty(message)) {
			message = '[could not find message for key `' + key + '`]';
		}

		return message;
	},

	/**
	 * Get the Payment Type Model instance for a wanted type.
	 *
	 * Paymill offers 3 different types of Payment `credit-card`,
	 * 'direct-debit' and 'sepa'.
	 *
	 * You are encouraged to create PaymentTypes using this method, rather
	 * than creating them on your own.
	 *
	 * @method paymentFor
	 * @return {PaymentType}
	 */
	paymentFor: function(type) {
		var container = this.get('container');
		var factory = container.lookupFactory('ember-paymill@type:' + type);

		Ember.assert('Unknow Paymill Payment Type `' + type + '`.',
			typeof factory === 'function' && typeof factory.create === 'function');

		factory.paymentType = type;

		return factory.create({
			paymill: this,
			container: container
		});
	},

	/**
	 * Returns a Promise that is resolved with a Bank name
	 * that matches the sent bank code, or `null` in case there is an error.
	 *
	 * @param  {String} bankCode
	 * @return {Ember.RSVP.Promise}
	 */
	getBankName: function(bankCode) {
		if (!paymill.validateBankCode(bankCode)) {
			return Ember.RSVP.resolve(null);
		}

		var resolver = Ember.RSVP.defer('paymill-bank-name');

		paymill.getBankName(bankCode, paymillCallbackResolver(this, resolver));

		return resolver.promise['catch'](function() {
			return null;
		});
	},

	/**
	 * Creates a unique Paymill Token which is used to create
	 * Payments and Transactions.
	 *
	 * This token should be transfered to the Server to finish the
	 * Purchase process.
	 *
	 * In case there is an error while creating this token, this
	 * Promise would be rejected with a `PaymillError` containing
	 * the error key code.
	 *
	 * @param  {PaymentType} model
	 * @return {Ember.RSVP.Promise}
	 */
	createToken: function(model) {
		var resolver = Ember.RSVP.defer('paymill-token');

		var params = model.serialize();
		paymill.createToken(params, paymillCallbackResolver(this, resolver));

		return resolver.promise;
	},

	/**
	 * Creates a unique Paymill Token which is used to create
	 * Payments and Transactions using 3-D Seucure gateway.
	 *
	 * This method will append an `iFrame` element in your page where the
	 * user can access his bank's website to authorize payment.
	 *
	 * You can optionally pass 2 callbacks when invoking this method, overriding
	 * the default behaviour.
	 *
	 * The first callback is invoked when you should create an `iFrame` element and
	 * present to the User.
	 *
	 * Second callback is invoked after the process has been finished,
	 * it should be used to preform `cleanup` from the 3-D Secure process.
	 *
	 * The obtained token should be transfered to the Server to finish the
	 * Purchase process.
	 *
	 * In case there is an error while creating this token, this
	 * Promise would be rejected with a `PaymillError` containing
	 * the error key code.
	 *
	 * @param  {PaymentType} model
	 * @return {Ember.RSVP.Promise}
	 */
	createTokenSecure: function(model, init, cleanup) {
		var type = resolvePaymentType(model);

		Ember.assert('Only Credit Card payment can be processed by 3-D Secure.', type === 'credit-card');

		if (arguments.length === 1) {
			init = createSecureIframe;
			cleanup = clearSecureIframe;
		} else if (arguments.length === 2) {
			cleanup = clearSecureIframe;
		}

		var resolver = Ember.RSVP.defer('paymill-token-3D');

		var params = model.serialize();
		paymill.createToken(params, paymillCallbackResolver(this, resolver), init, cleanup);

		return resolver.promise;
	}

});
