'use strict';

jest.dontMock('../src/bubble');

describe('bubble', function() {

	var React, ReactDOM, TestUtils, Validation;

	beforeEach(function() {
		React = require('react');
		ReactDOM = require('react-dom')
		TestUtils = require('react-addons-test-utils');
		Validation = require('../index');
	});


	it('contains the bubble message', function() {

		var bubble = TestUtils.renderIntoDocument(
			<Validation.Bubble message="The bubble message."/>
		);
		var bubbleNode = ReactDOM.findDOMNode(bubble);

		expect(bubbleNode.textContent).toBe('The bubble message.');

	});

	it('has the field-bubble css class', function() {

		var bubble = TestUtils.renderIntoDocument(
			<Validation.Bubble message="The bubble message."/>
		);
		var bubbleNode = ReactDOM.findDOMNode(bubble);

		expect(bubbleNode.className).toBe('field-bubble field-bubble-hidden');

	});

	it('has the field-bubble-show css class when visible', function() {

		var bubble = TestUtils.renderIntoDocument(
			<Validation.Bubble isVisible={true} message="The bubble message."/>
		);
		var bubbleNode = ReactDOM.findDOMNode(bubble);

		expect(bubbleNode.className).toContain('field-bubble-show');

	});

});
