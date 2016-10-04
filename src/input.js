'use strict';

var objectAssign = require('object-assign'),
	React = require('react'),
	ReactDOM = require('react-dom'),
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
		return ReactDOM.findDOMNode(this).querySelector('input');
	},

	getValue: function() {
		if (!this.isMounted()) {
			return;
		}
		return this.getInput().value;
	},

	hasFocus: function() {
		if (!this.isMounted()) {
			return false;
		}
		return (document.activeElement === this.getInput());
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
					{},
					this.props,
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
