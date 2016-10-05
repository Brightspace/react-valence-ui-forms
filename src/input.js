'use strict';

var objectAssign = require('lodash/assign'),
	objectOmit = require('lodash/omit'),
	React = require('react'),
	ValidationMixin = require('./mixin');

var Input = React.createClass({

	mixins: [ValidationMixin],

	defaultValidate: function() {
		var inputNode = this.getInput();
		if (!inputNode.checkValidity) {
			return { isValid: true };
		}
		return {
			isValid: inputNode.checkValidity(),
			message: inputNode.validationMessage
		};
	},

	getInput: function() {
		return this.refs.input;
	},

	getValue: function() {
		var input = this.getInput();
		if (!input) {
			return;
		}

		return input.value;
	},

	hasFocus: function() {
		var input = this.getInput();
		return (input !== undefined && document.activeElement === this.getInput());
	},

	render: function() {

		var ariaProps = {};

		if (!this.state['validation:isValid']) {
			ariaProps['aria-invalid'] = true;
			ariaProps['aria-describedby'] = this.getValidationMessageId();
		}

		if (this.props.required) {
			ariaProps['aria-required'] = true;
		}

		return this.renderContainer(
			React.DOM.input(
				objectAssign(
					{
						key: 'input',
						ref: 'input'
					},
					objectOmit(this.props, [
						'ref',
						'validators',
						'validateLive',
						'validateMessageAnchorId',
						'validateMessagePosition'
					]),
					ariaProps, {
						onFocus: this.handleFocus,
						onBlur: this.handleBlur,
						onKeyUp: this.handleKeyUp
					}
				)
			),
			this.props.validateMessagePosition,
			this.props.validateMessageAnchorId
		);

	},

	tryFocus: function() {
		if (!this.isMounted()) {
			return false;
		}
		this.getInput().focus();
		return true;
	},

	validate: function() {
		return this.onValidate(this);
	}

});

module.exports = Input;
