'use strict';

jest.dontMock('../../src/validators/patternMatch');

var TestUtils = require('react-addons-test-utils'),
	Validation = require('../../index');

describe('patternMatch validator', function() {

	it('is defined', function() {

		expect(Validation.Validators.patternMatch).toBeDefined();

	});

	it('returns isValid=true when initialized invalid value is undefined', function() {

		var validator = Validation.Validators.patternMatch();

		expect(validator(null, 'some invalid').isValid).toBeTruthy();

	});

	it('returns isValid=true when a valid value is provided', function() {

		var validator = Validation.Validators.patternMatch(/apples/, 'a message');

		expect(validator(null, 'apples').isValid).toBeTruthy();

	});

	it('returns isValid=false when an invalid value is provided', function() {

		var validator = Validation.Validators.patternMatch(/apples/, 'a message');

		var result = validator(null, 'bananas');
		expect(result.isValid).toBeFalsy();
		expect(result.message).toBe('a message');

	});

});
