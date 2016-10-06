'use strict';

var objectAssign = require('lodash/assign'),
	objectOmit = require('lodash/omit'),
	React = require('react'),
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
		return this.refs.textarea;
	},

	getValue: function() {
		var textarea = this.getTextarea();
		if (!textarea) {
			return;
		}

		return textarea.value;
	},

	hasFocus: function() {
		var textarea = this.getTextarea();
		return (textarea !== undefined && document.activeElement === this.getTextarea());
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
					{
						key: 'textarea',
						ref: 'textarea'
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
