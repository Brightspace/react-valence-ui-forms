'use strict';

jest.dontMock('../src/form');
jest.dontMock('../src/input');
jest.dontMock('q');

var React = require('react'),
	ReactDOM = require('react-dom'),
	TestUtils = require('react-addons-test-utils'),
	Validation = require('../index'),
	Q = require('q');

describe('form', function() {

	var getSynchronousValidator = function(isValid, message) {
		return function(component, value) {
			return {
				isValid: isValid,
				message: message
			};
		};
	};

	var getAsynchronousValidator = function(isValid, message) {
		return function(component, value) {
			var	deferred = Q.defer();
			setTimeout(function() {
				deferred.resolve({
					isValid: isValid,
					message: message
				});
			},50);
			return deferred.promise;
		};
	};

	it('implements the onValidate function', function() {

		var form = TestUtils.renderIntoDocument(
			<Validation.Form />
		);

		expect(form.onValidate).toBeDefined();

	});

	describe('render', function() {

		it('renders with novalidate enabled', function() {

			var form = TestUtils.renderIntoDocument(
				<Validation.Form />
			);
			var formNode = ReactDOM.findDOMNode(form);

			expect(formNode.hasAttribute('novalidate')).toBeTruthy();

		});

		it('renders children', function() {

			var form = TestUtils.renderIntoDocument(
				<Validation.Form>some fields</Validation.Form>
			);
			var formNode = ReactDOM.findDOMNode(form);

			expect(formNode.textContent).toBe('some fields');

		});

	});

	describe('validate', function() {

		pit('provides isValid=true when all children are valid', function() {

			var form = TestUtils.renderIntoDocument(
				<Validation.Form>
					<Validation.Input type="text" validators={getSynchronousValidator(true)} />
					<Validation.Input type="text" validators={getSynchronousValidator(true)} />
				</Validation.Form>
			);

			return form.validate().then(function(isValid) {
				expect(isValid).toBeTruthy();
			});

		});

		pit('provides isValid=false when any of the children are invalid', function() {

			var form = TestUtils.renderIntoDocument(
				<Validation.Form>
					<Validation.Input type="text" validators={getSynchronousValidator(true)} />
					<Validation.Input type="text" validators={getSynchronousValidator(false)} />
				</Validation.Form>
			);

			return form.validate().then(function(isValid) {
				expect(isValid).toBeFalsy();
			});

		});

		pit('provides isValid=false when asynchronous validator returns false', function() {

			var form = TestUtils.renderIntoDocument(
				<Validation.Form>
					<Validation.Input type="text" validators={getSynchronousValidator(true)} />
					<Validation.Input type="text" validators={getAsynchronousValidator(false)} />
				</Validation.Form>
			);

			var promise = form.validate().then(function(isValid) {
				expect(isValid).toBeFalsy();
			});

			jest.runAllTimers();

			return promise;

		});

	});

});
