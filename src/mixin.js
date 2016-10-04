'use strict';

var classNames = require('classnames'),
	messagePositions = require('./messagePositions'),
	React = require('react'),
	ReactDOM = require('react-dom'),
	Emitter = require('react-frau-events'),
	Bubble = require('./bubble'),
	Q = require('q');

var validationMessageIndex = 0;

var ValidationMixin = {

	mixins: [
		Emitter.ForEvent('validate')
	],

	propsTypes: {
		validateLive: React.PropTypes.bool
	},

	getInitialState: function() {
		return {
			'validation:hasInteracted': false,
			'validation:isValid': true
		};
	},

	getValidationMessageId: function() {
		if (this.validationMessageId) {
			return this.validationMessageId;
		}

		validationMessageIndex += 1;
		this.validationMessageId = 'vui-forms-msg-' + validationMessageIndex;
		return this.validationMessageId;
	},

	handleBlur: function(e) {
		this.forceUpdate();
		var promise = this.validate().then(function(result) {
			this.setState({
				'validation:hasInteracted': true,
				'validation:isValid': result.isValid
			});
			return result;
		}.bind(this));
		if (this.props.onBlur) {
			this.props.onBlur(e);
		}
		return promise;
	},

	handleChange: function(e) {
		var promise;
		if (this.props.validateLive) {
			promise = this.validate().then(function(result) {
				this.setState({
					'validation:isValid': result.isValid
				});
				return result;
			}.bind(this));
		}
		if (this.props.onChange) {
			this.props.onChange(e);
		}
		return promise;
	},

	handleFocus: function(e) {
		this.forceUpdate();
		if (this.props.onFocus) {
			this.props.onFocus(e);
		}
	},

	handleKeyUp: function(e) {
		if (this.props.validateLive && this.state['validation:hasInteracted']) {
			this.validate().then(function(result) {
				this.setState({
					'validation:isValid': result.isValid
				});
			}.bind(this));
		}
		if (this.props.onKeyUp) {
			this.props.onKeyUp(e);
		}
	},

	isAncestor: function(ancestorNode, node) {
		var currentNode = node;
		while (currentNode) {
			if (currentNode === ancestorNode) {
				return true;
			}
			currentNode = currentNode.parentNode;
		}
		return false;
	},

	shouldDisplayMessage: function() {
		return !this.state['validation:isValid'] &&
			this.state['validation:hasInteracted'] &&
			this.hasFocus && this.hasFocus();
	},

	renderContainer: function(innerView, validateMessagePosition, validateMessageAnchorId) {

		var classes = classNames({
			'field-interacted': this.state['validation:hasInteracted'],
			'field-invalid': !this.state['validation:isValid']
		});

		var bubble = React.createElement(
			Bubble,
			{
				anchorId: validateMessageAnchorId,
				id: this.getValidationMessageId(),
				key: 'bubble',
				message: this.state['validation:message'],
				isVisible: this.shouldDisplayMessage(),
				position: validateMessagePosition
			}
		);

		var childViews = validateMessagePosition !== messagePositions.ABOVE ?
			[ innerView, bubble ] : [ bubble, innerView ];

		return React.DOM.div(
			{ className: classes },
			childViews
		);

	},

	handleValidator: function(validator) {
		var	deferred = Q.defer();

		if (validator === undefined || validator === null) {
			deferred.resolve({ isValid: true, message: 'No validator.'});
			return deferred.promise;
		}

		if (typeof validator === 'function') {

			var currentValue;
			if (this.getValue) {
				currentValue = this.getValue();
			}
			var validatorResult = validator.call(validator, this, currentValue);

			// validationResult could be a validation result result or a promise
			// for a validation result... either we can resolve with it
			deferred.resolve(validatorResult);

		} else if (validator.constructor === Object) {

			deferred.resolve(validator);

		}

		return deferred.promise;
	},

	handleValidators: function(validators) {

		var promises = [];
		for (var i = 0; i < validators.length; i++) {
			promises.push(this.handleValidator(validators[i]));
		}

		return Q.allSettled(promises).then(function(validatorResults) {
			var isValid = true, message;
			for (var i = 0; i < validatorResults.length; i++) {
				if (!validatorResults[i].value.isValid) {
					isValid = false;
					message = validatorResults[i].value.message;
					break;
				}
			}
			return {isValid: isValid, message: message};
		});

	},

	onValidate: function(relatedComponent) {

		if (!relatedComponent ||
			!relatedComponent.isMounted() ||
			!this.isMounted() ||
			!this.isAncestor(ReactDOM.findDOMNode(relatedComponent), ReactDOM.findDOMNode(this))) {
			return;
		}

		var	deferred = Q.defer();
		var validators = this.props.validators;

		var handleResult = function(result) {
			result.component = this;
			this.setState({
				'validation:hasInteracted': true,
				'validation:isValid': result.isValid,
				'validation:message': result.message
			});
			deferred.resolve(result);
		}.bind(this);

		if (this.defaultValidate) {
			var defaultResult = this.defaultValidate();
			if (!defaultResult.isValid) {
				handleResult(defaultResult);
				return deferred.promise;
			}
		}

		if (validators) {

			var validatorHandler;
			if (validators.constructor === Array) {
				validatorHandler = this.handleValidators;
			} else {
				validatorHandler = this.handleValidator;
			}

			validatorHandler(validators)
				.then(function(validatorResult) {
					handleResult(validatorResult);
				});

		} else {
			handleResult({isValid: true});
		}

		return deferred.promise;

	}

};

module.exports = ValidationMixin;
