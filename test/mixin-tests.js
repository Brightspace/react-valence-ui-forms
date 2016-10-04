'use strict';

jest.dontMock('../src/mixin');
jest.dontMock('q');

var React = require('react'),
	TestUtils = require('react-addons-test-utils'),
	Validation = require('../index'),
	Q = require('q');

var Input = React.createClass({
		mixins: [Validation.Mixin],
		defaultValidateCalled: false,
		defaultValidateIsValid: true,
		defaultValidate: function() {
			this.defaultValidateCalled = true;
			return { isValid: this.defaultValidateIsValid };
		},
		render: function() {
			return this.renderContainer(
				<input {...this.props} key="input1" />
			);
		},
		validate: function() {
			return this.onValidate(this);
		}
	});

describe('mixin', function() {

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

		var input = TestUtils.renderIntoDocument(
			<Input type="text" />
		);

		expect(input.onValidate).toBeDefined();

	});

	describe('onValidate', function() {

		it('returns a promise', function() {

			var input = TestUtils.renderIntoDocument(<Input type="text" />);

			var promise = input.validate();
			expect(promise).toBeDefined();
			expect(promise.then).toBeDefined();

		});

		pit('provides result.isValid=true when synchronous validator returns true', function() {

			var input = TestUtils.renderIntoDocument(
				<Input type="text" validators={getSynchronousValidator(true)} />
			);

			return input.validate()
				.then(function(result) {
					expect(result.isValid).toBeTruthy();
					expect(result.message).not.toBeDefined();
				});

		});

		pit('provides result.isValid=false with message when synchronous validator returns false', function() {

			var input = TestUtils.renderIntoDocument(
				<Input type="text" validators={getSynchronousValidator(false, 'a message')} />
			);

			return input.validate()
				.then(function(result) {
					expect(result.isValid).toBeFalsy();
					expect(result.message).toBe('a message');
				});

		});

		pit('provides result.isValid=true when multiple synchronous validators return true', function() {

			var input = TestUtils.renderIntoDocument(
				<Input type="text" validators={[
						getSynchronousValidator(true),
						getSynchronousValidator(true)
					]} />
			);

			return input.validate()
				.then(function(result) {
					expect(result.isValid).toBeTruthy();
					expect(result.message).not.toBeDefined();
				});

		});

		pit('provides result.isValid=false with message when multiple synchronous validators return with at least one false', function() {

			var input = TestUtils.renderIntoDocument(
				<Input type="text" validators={[
						getSynchronousValidator(true),
						getSynchronousValidator(false, 'this is a message for validator2')
					]} />
			);

			return input.validate()
				.then(function(result) {
					expect(result.isValid).toBeFalsy();
					expect(result.message).toBe('this is a message for validator2');
				});

		});

		pit('provides result.isValid=true when asynchronous validator returns true', function() {

			var input = TestUtils.renderIntoDocument(
				<Input type="text" validators={getAsynchronousValidator(true)} />
			);

			var promise = input.validate()
				.then(function(result) {
					expect(result.isValid).toBeTruthy();
					expect(result.message).not.toBeDefined();
				});

			jest.runAllTimers();

			return promise;

		});

		pit('provides result.isValid=false with message when asynchronous validator returns false', function() {

			var input = TestUtils.renderIntoDocument(
				<Input type="text" validators={getAsynchronousValidator(false, 'a message')} />
			);

			var promise = input.validate()
				.then(function(result) {
					expect(result.isValid).toBeFalsy();
					expect(result.message).toBe('a message');
				});

			jest.runAllTimers();

			return promise;

		});

		pit('provides result.isValid=true when multiple asynchronous validators return true', function() {

			var input = TestUtils.renderIntoDocument(
				<Input type="text" validators={[
						getAsynchronousValidator(true),
						getAsynchronousValidator(true)
					]} />
			);

			var promise = input.validate()
				.then(function(result) {
					expect(result.isValid).toBeTruthy();
					expect(result.message).not.toBeDefined();
				});

			jest.runAllTimers();

			return promise;

		});

		pit('provides result.isValid=true when multiple asynchronous validators return true', function() {

			var input = TestUtils.renderIntoDocument(
				<Input type="text" validators={[
						getAsynchronousValidator(true),
						getAsynchronousValidator(false, 'this is a message for validator2')
					]} />
			);

			var promise = input.validate()
				.then(function(result) {
					expect(result.isValid).toBeFalsy();
					expect(result.message).toBe('this is a message for validator2');
				});

			jest.runAllTimers();

			return promise;

		});

		pit('calls defaultValidate on component if it exists', function() {

			var input = TestUtils.renderIntoDocument(
				<Input type="text" validators={getSynchronousValidator(true)} />
			);

			return input.validate()
				.then(function(result) {
					expect(input.defaultValidateCalled).toBeTruthy();
				});

		});

		pit('provides result.isValid=true when defaultValidate returns true', function() {

			var input = TestUtils.renderIntoDocument(
				<Input type="text" validators={getSynchronousValidator(true)} />
			);
			input.defaultValidateIsValid = true;

			return input.validate()
				.then(function(result) {
					expect(result.isValid).toBeTruthy();
				});

		});

		pit('provides result.isValid=false when defaultValidate returns false', function() {

			var input = TestUtils.renderIntoDocument(
				<Input type="text" validators={getSynchronousValidator(true)} />
			);
			input.defaultValidateIsValid = false;

			return input.validate()
				.then(function(result) {
					expect(result.isValid).toBeFalsy();
				});

		});

	});

	describe('handleBlur', function() {

		pit('triggers validation', function() {

			var input = TestUtils.renderIntoDocument(<Input type="text" />);

			return input.handleBlur().then(function() {
				expect(input.defaultValidateCalled).toBeTruthy();
			});

		});

		pit('sets validation:isValid to true when validator returns true', function() {

			var input = TestUtils.renderIntoDocument(
				<Input type="text" validators={getSynchronousValidator(true)} />
			);

			return input.handleBlur().then(function(result) {
				expect(result.isValid).toBeTruthy();
				expect(input.state["validation:isValid"]).toBeTruthy();
			});

		});

		pit('sets validation:isValid to false when validator returns false', function() {

			var input = TestUtils.renderIntoDocument(
				<Input type="text" validators={getSynchronousValidator(false)} />
			);

			return input.handleBlur().then(function(result) {
				expect(result.isValid).toBeFalsy();
				expect(input.state["validation:isValid"]).toBeFalsy();
			});

		});

	});

	describe('handleChange', function() {

		pit('triggers validation when validateLive is true', function() {

			var input = TestUtils.renderIntoDocument(
				<Input type="text" validateLive={true} />
			);

			return input.handleChange().then(function() {
				expect(input.defaultValidateCalled).toBeTruthy();
			});

		});

		it('does not trigger validation when validateLive is false', function() {

			var input = TestUtils.renderIntoDocument(
				<Input type="text" validateLive={false} />
			);

			var promise = input.handleChange();
			expect(promise).not.toBeDefined();
			expect(input.defaultValidateCalled).toBeFalsy();

		});

		pit('sets validation:isValid to true when validator returns true', function() {

			var input = TestUtils.renderIntoDocument(
				<Input type="text" validateLive={true} validators={getSynchronousValidator(true)} />
			);

			return input.handleChange().then(function(result) {
				expect(result.isValid).toBeTruthy();
				expect(input.state["validation:isValid"]).toBeTruthy();
			});

		});

		pit('sets validation:isValid to true when validator returns true', function() {

			var input = TestUtils.renderIntoDocument(
				<Input type="text" validateLive={true} validators={getSynchronousValidator(false)} />
			);

			return input.handleChange().then(function(result) {
				expect(result.isValid).toBeFalsy();
				expect(input.state["validation:isValid"]).toBeFalsy();
			});

		});

	});

});
