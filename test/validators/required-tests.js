'use strict';

jest.dontMock('../../src/validators/required');
jest.dontMock('../../src/validators/whitespaceOptions');

var TestUtils = require('react-addons-test-utils'),
	Validation = require('../../index');

describe('required validator', function() {

	it('is defined', function() {

		expect(Validation.Validators.required).toBeDefined();

	});

	it('returns isValid=true when a valid value is provided', function() {

		var validator = Validation.Validators.required('a message');

		expect(validator(null, 'some value').isValid).toBeTruthy();

	});

	it('returns isValid=true when a whitespace value is provided', function() {

		var validator = Validation.Validators.required('a message');

		expect(validator(null, ' ').isValid).toBeTruthy();

	});

	it('returns isValid=false with message when null value is provided', function() {

		var validator = Validation.Validators.required('a message');

		var result = validator(null, null);
		expect(result.isValid).toBeFalsy();
		expect(result.message).toBe('a message');

	});

	it('returns isValid=false with message when undefined value is provided', function() {

		var validator = Validation.Validators.required('a message');

		var result = validator(null);
		expect(result.isValid).toBeFalsy();
		expect(result.message).toBe('a message');

	});

	it('returns isValid=false with message when empty string is provided', function() {

		var validator = Validation.Validators.required('a message');

		var result = validator(null, '');
		expect(result.isValid).toBeFalsy();
		expect(result.message).toBe('a message');

	});

	it('returns isValid=true when a whitespace value is provided whitespaceOptions.KEEP is specified', function() {

		var validator = Validation.Validators.required(
			'a message', {
				whitespace: Validation.Validators.whitespaceOptions.KEEP
			}
		);

		expect(validator(null, ' ').isValid).toBeTruthy();

	});

	it('returns isValid=false when a whitespace value is provided whitespaceOptions.TRIM is specified', function() {

		var validator = Validation.Validators.required(
			'a message', {
				whitespace: Validation.Validators.whitespaceOptions.TRIM
			}
		);

		expect(validator(null, ' ').isValid).toBeFalsy();

	});

});
