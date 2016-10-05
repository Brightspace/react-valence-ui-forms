'use strict';

var objectAssign = require('lodash/assign'),
	objectOmit = require('lodash/omit'),
	messagePositions = require('./messagePositions'),
	React = require('react'),
	ValidationMixin = require('./mixin');

var Select = React.createClass({

	mixins: [ValidationMixin],

	getSelect: function() {
		return this.refs.select;
	},

	getValue: function() {
		var select = this.getSelect();
		if (!select) {
			return;
		}

		return select.value;
	},

	hasFocus: function() {
		var select = this.getSelect();
		return (select !== undefined && document.activeElement === this.getSelect());
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
					{
						key: 'select',
						ref: 'select'
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
