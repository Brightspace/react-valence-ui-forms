'use strict';

var objectAssign = require('lodash/assign'),
	React = require('react'),
	ValidationMixin = require('./mixin');

var Form = React.createClass({

	mixins: [ValidationMixin],

	render: function() {

		return React.DOM.form(
			objectAssign({ noValidate: true }, this.props),
			this.props.children
		);

	},

	submit: function() {
		this.validate().then(function(isValid) {
			if (!isValid) {
				return;
			}
			this.getDOMNode().submit();
		}.bind(this)).done();
	},

	tryFocus: function(component) {
		if (!component || !component.tryFocus) {
			return false;
		}
		return component.tryFocus();
	},

	validate: function() {
		return this.emitValidate(this).then(function(results) {

			if (!results || results.length === 0) {
				return true;
			}

			var isValid = true, isFocusApplied;

			for (var i = 0; i < results.length; i++) {
				var result = results[i];
				if (result.value && !result.value.isValid) {
					isValid = false;
					if (!isFocusApplied) {
						isFocusApplied = this.tryFocus(result.value.component);
						break;
					}
				}
			}

			return isValid;

		}.bind(this));
	}

});

module.exports = Form;
