'use strict';

var objectAssign = require('object-assign'),
	messagePositions = require('./messagePositions'),
	React = require('react'),
	ReactDOM = require('react-dom'),
	ValidationMixin = require('./mixin');

var Select = React.createClass({

	mixins: [ValidationMixin],

	getSelect: function() {
		return ReactDOM.findDOMNode(this).querySelector('select');
	},

	getValue: function() {
		if (!this.isMounted()) {
			return;
		}
		return this.getSelect().value;
	},

	hasFocus: function() {
		if (!this.isMounted()) {
			return false;
		}
		return (document.activeElement === this.getSelect());
	},

	render: function() {

		var ariaProps = {};

		if (!this.state['validation:isValid']) {
			ariaProps['aria-invalid'] = true;
			ariaProps['aria-describedby'] = this.getValidationMessageId();
		}

		return this.renderContainer(
			React.DOM.select(
				objectAssign(
					{},
					this.props,
					ariaProps, {
						onFocus: this.handleFocus,
						onBlur: this.handleBlur
					}
				),
				this.props.children
			),
			( this.props.validateMessagePosition ) ? this.props.validateMessagePosition : messagePositions.ABOVE,
			this.props.validateMessageAnchorId
		);

	},

	tryFocus: function() {
		if (!this.isMounted()) {
			return false;
		}
		this.getSelect().focus();
		return true;
	},

	validate: function() {
		return this.onValidate(this);
	}

});

module.exports = Select;
