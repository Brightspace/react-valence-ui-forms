'use strict';

jest.dontMock('../src/select');

var React = require('react'),
	ReactDOM = require('react-dom'),
	TestUtils = require('react-addons-test-utils'),
	Validation = require('../index');

describe('select', function() {

	var getSynchronousValidator = function(isValid, message) {
		return function(component, value) {
			return {
				isValid: isValid,
				message: message
			};
		};
	};

	it('implements the onValidate function', function() {

		var select = TestUtils.renderIntoDocument(
			<Validation.Select />
		);

		expect(select.onValidate).toBeDefined();

	});

	describe('render', function() {

		it('renders children', function() {

			var select = TestUtils.renderIntoDocument(
				<Validation.Select validateMessagePosition="below"><option>moose</option></Validation.Select>
			);
			var selectNode = ReactDOM.findDOMNode(select);

			expect(selectNode.firstChild.firstChild.textContent).toBe('moose');

		});

		pit('renders as invalid when validation returns isValid=false', function() {

			var select = TestUtils.renderIntoDocument(
				<Validation.Select validateMessagePosition="below" validators={getSynchronousValidator(false,'a message')} />
			);
			var selectNode = ReactDOM.findDOMNode(select);

			return select.validate().then(function(result) {
				expect(result.isValid).toBeFalsy();
				expect(result.message).toBe('a message');
				expect(selectNode.firstChild.getAttribute('aria-invalid')).toBeTruthy();
			});

		});

		pit('renders as valid when validation returns isValid=true', function() {

			var select = TestUtils.renderIntoDocument(
				<Validation.Select validateMessagePosition="below" validators={getSynchronousValidator(true)} />
			);
			var selectNode = ReactDOM.findDOMNode(select);

			return select.validate().then(function(result) {
				expect(result.isValid).toBeTruthy();
				expect(selectNode.firstChild.getAttribute('aria-invalid')).toBeNull();
			});

		});

	});

});
