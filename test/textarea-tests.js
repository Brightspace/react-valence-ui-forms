'use strict';

jest.dontMock('../src/textarea');

var React = require('react'),
	ReactDOM = require('react-dom'),
	TestUtils = require('react-addons-test-utils'),
	Validation = require('../index');

describe('textarea', function() {

	var getSynchronousValidator = function(isValid, message) {
		return function(component, value) {
			return {
				isValid: isValid,
				message: message
			};
		};
	};

	it('implements the onValidate function', function() {

		var textarea = TestUtils.renderIntoDocument(
			<Validation.Textarea />
		);

		expect(textarea.onValidate).toBeDefined();

	});

	describe('render', function() {

		it('renders children', function() {

			var textarea = TestUtils.renderIntoDocument(
				<Validation.Textarea defaultValue={"some content"} />
			);
			var textareaNode = ReactDOM.findDOMNode(textarea);

			expect(textareaNode.firstChild.textContent.replace('\n', '')).toBe('some content');

		});

		it('renders aria-required when HTML5 required attribute is specified', function() {

			var textarea = TestUtils.renderIntoDocument(
				<Validation.Textarea required />
			);
			var textareaNode = ReactDOM.findDOMNode(textarea);

			expect(textareaNode.firstChild.getAttribute('aria-required')).toBeTruthy();

		});

		it('does not render aria-required when HTML5 required attribute is not specified', function() {

			var textarea = TestUtils.renderIntoDocument(
				<Validation.Textarea />
			);
			var textareaNode = ReactDOM.findDOMNode(textarea);

			expect(textareaNode.firstChild.getAttribute('aria-required')).toBeNull();

		});

		pit('renders as invalid when validation returns isValid=false', function() {

			var textarea = TestUtils.renderIntoDocument(
				<Validation.Textarea validators={getSynchronousValidator(false,'a message')} />
			);
			var textareaNode = ReactDOM.findDOMNode(textarea);

			return textarea.validate().then(function(result) {
				expect(result.isValid).toBeFalsy();
				expect(result.message).toBe('a message');
				expect(textareaNode.firstChild.getAttribute('aria-invalid')).toBeTruthy();
			});

		});

		pit('renders as valid when validation returns isValid=true', function() {

			var textarea = TestUtils.renderIntoDocument(
				<Validation.Textarea validators={getSynchronousValidator(true)} />
			);
			var textareaNode = ReactDOM.findDOMNode(textarea);

			return textarea.validate().then(function(result) {
				expect(result.isValid).toBeTruthy();
				expect(textareaNode.firstChild.getAttribute('aria-invalid')).toBeNull();
			});

		});

	});

});
