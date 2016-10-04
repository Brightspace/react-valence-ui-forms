'use strict';

var objectAssign = require('object-assign'),
	React = require('react'),
	ReactDOM = require('react-dom'),
	ValidationMixin = require('./mixin');

var Textarea = React.createClass({

	mixins: [ValidationMixin],

	defaultValidate: function() {
		var textareaNode = this.getTextarea();
		if (!textareaNode.checkValidity) {
			return { isValid: true };
		}
		return {
			isValid: textareaNode.checkValidity(),
			message: textareaNode.validationMessage
		};
	},

	getTextarea: function() {
		return ReactDOM.findDOMNode(this).querySelector('textarea');
	},

	getValue: function() {
		if (!this.isMounted()) {
			return;
		}
		return this.getTextarea().value;
	},

	hasFocus: function() {
		if (!this.isMounted()) {
			return false;
		}
		return (document.activeElement === this.getTextarea());
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
			React.DOM.textarea(
				objectAssign(
					{},
					this.props,
					ariaProps, {
						onFocus: this.handleFocus,
						onBlur: this.handleBlur,
						onKeyUp: this.handleKeyUp
					}
				),
				this.props.children
			),
			this.props.validateMessagePosition,
			this.props.validateMessageAnchorId
		);

	},

	tryFocus: function() {
		if (!this.isMounted()) {
			return false;
		}
		this.getTextarea().focus();
		return true;
	},

	validate: function() {
		return this.onValidate(this);
	}

});

module.exports = Textarea;
