'use strict';

jest.dontMock('../../src/validators/invalidValue');

var TestUtils = require('react-addons-test-utils'),
	Validation = require('../../index');

describe('invalidValue validator', function() {

	it('is defined', function() {

		expect(Validation.Validators.invalidValue).toBeDefined();

	});

	it('returns isValid=true when initialized invalid value is undefined', function() {

		var validator = Validation.Validators.invalidValue();

		expect(validator(null, 'some invalid').isValid).toBeTruthy();

	});

	it('returns isValid=true when a valid value is provided', function() {

		var validator = Validation.Validators.invalidValue('some invalid', 'a message');

		expect(validator(null, 'some valid').isValid).toBeTruthy();

	});

	it('returns isValid=false with message when an invalid value is provided', function() {

		var validator = Validation.Validators.invalidValue('some invalid', 'a message');

		var result = validator(null, 'some invalid');
		expect(result.isValid).toBeFalsy();
		expect(result.message).toBe('a message');

	});

});
