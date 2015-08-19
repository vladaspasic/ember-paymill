import Ember from 'ember';

function formatKey(locale) {
	Ember.assert('Local must be a String.', typeof locale === 'string');

	return `ember-paymill@translation:` + locale;
}

export function addTranslations(container, locale, translations) {
	var key = formatKey(locale);

	var existing = container.lookupFactory(key);

	if (existing == null) {
		existing = {};
		// There's no public API for registering factories at runtime.
		// See http://discuss.emberjs.com/t/whats-the-correct-way-to-register-new-factories-at-runtime/8018
		if(container._registry) {
			container._registry.register(key, existing);
		} else {
			container.register(key, existing);
		}
	}

	Ember.merge(existing, translations);
}

export function getTranslations(container, locale) {
	var key = formatKey(locale);

	return container.lookupFactory(key);
}
