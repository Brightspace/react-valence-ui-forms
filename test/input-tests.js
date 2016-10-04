'use strict';

jest.dontMock('../src/input');

var React = require('react'),
	ReactDOM = require('react-dom'),
	TestUtils = require('react-addons-test-utils'),
	Validation = require('../index');

describe('input', function() {

	var getSynchronousValidator = function(isValid, message) {
		return function(component, value) {
			return {
				isValid: isValid,
				message: message
			};
		};
	};

	it('implements the onValidate function', function() {

		var input = TestUtils.renderIntoDocument(
			<Validation.Input type="text" />
		);

		expect(input.onValidate).toBeDefined();

	});

	describe('render', function() {

		it('renders aria-required when HTML5 required attribute is specified', function() {

			var input = TestUtils.renderIntoDocument(
				<Validation.Input type="text" required />
			);
			var inputNode = ReactDOM.findDOMNode(input);

			expect(inputNode.firstChild.getAttribute('aria-required')).toBeTruthy();

		});

		it('does not render aria-required when HTML5 required attribute is not specified', function() {

			var input = TestUtils.renderIntoDocument(
				<Validation.Input type="text" />
			);
			var inputNode = ReactDOM.findDOMNode(input);

			expect(inputNode.firstChild.getAttribute('aria-required')).toBeNull();

		});

		pit('renders as invalid when validation returns isValid=false', function() {

			var input = TestUtils.renderIntoDocument(
				<Validation.Input type="text" validators={getSynchronousValidator(false,'a message')} />
			);
			var inputNode = ReactDOM.findDOMNode(input);

			return input.validate().then(function(result) {
				expect(result.isValid).toBeFalsy();
				expect(result.message).toBe('a message');
				expect(inputNode.firstChild.getAttribute('aria-invalid')).toBeTruthy();
			});

		});

		pit('renders as valid when validation returns isValid=true', function() {

			var input = TestUtils.renderIntoDocument(
				<Validation.Input type="text" validators={getSynchronousValidator(true)} />
			);
			var inputNode = ReactDOM.findDOMNode(input);

			return input.validate().then(function(result) {
				expect(result.isValid).toBeTruthy();
				expect(inputNode.firstChild.getAttribute('aria-invalid')).toBeNull();
			});

		});

	});

});
