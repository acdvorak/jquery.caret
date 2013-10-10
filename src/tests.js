(function() {

	/**
	 * Normalizes line endings by removing all \r (carriage return) characters.
	 * In IE, newlines in textareas are stored as \r\n instead of just \n, which screws up length calculations.
	 * All other browsers automatically remove \r characters when you set the value of the textarea.
	 * @returns {string}
	 */
	String.prototype.norm = function() {
		return this.replace(/\r/g, '');
	};

	pavlov.specify.extendAssertions({
		isOneOf: function(actual, expected, message) {
			ok(expected.indexOf(actual) !== -1, message);
		}
	});

	pavlov.specify('jQuery Caret Plugin', function() {

		var _support = {
			normalizesNewlines: (function () {
				var textarea = _e('textarea');
				var text = 'abc\r\ndef';
				textarea.value = text;
				return textarea.value.length === text.length - 1;
			}())
		};

		var $fixture = $('#qunit-fixture');

		var _single = 'abcdefghijklmnop',
			_multi = 'abcdefg\r\nhijklmnop',
			_short = 'abc',
			_long = 'abcdefghijklmnopqrstuvwxyz',
			_empty = '';

		describe('All Plugins', function() {
			var $input, $textarea;

			// befores and afters:

			before(function() {
				$input = $('<input/>').appendTo($fixture);
				$textarea = $('<textarea/>').appendTo($fixture);
			});

			// plugins:

			describe('Caret', function() {
				describe('Get', function() {
					// Note: Every browser handles caret placement a little differently.
					// Chrome always places the caret at the END of an <input>, but at the BEGINNING of a <textarea>;
					//
					// which means our tests need to accommodate both placement strategies.

					describe('<input>', function() {
						it("Returns zero (0) when no value has been set", function() {
							assert($input.caret()).equals(0);
						});
					});

					describe('<textarea>', function() {
						it("Returns zero (0) when no value has been set", function() {
							assert($textarea.caret()).equals(0);
						});
					});

					describe('<input>', function() {
						it("Returns zero (0) or value.length when a value has been set", function() {
							// In IE and FF, the caret remains at index 0 the first time a value is set;
							// the second time a value is set, the caret moves to the end of the input/textarea.
							assert($input.val(_single).caret()).isOneOf([ 0, _single.length ]);
							assert($input.val(_single).caret()).isOneOf([ 0, _single.length ]);
						});
					});

					describe('<textarea>', function() {
						it("Returns zero (0) or value.length when a value has been set", function() {
							// In IE and FF, the caret remains at index 0 the first time a value is set;
							// the second time a value is set, the caret moves to the end of the input/textarea.
							assert($textarea.val(_multi).caret()).isOneOf([ 0, _multi.norm().length ]);
							assert($textarea.val(_multi).caret()).isOneOf([ 0, _multi.norm().length ]);
						});
					});

					describe('<input>', function() {
						it("Returns zero (0) or value.length when the input's value changes", function() {
							assert($input.val(_short).caret()).isOneOf([ 0, _short.length ]);
							assert($input.val(_long).caret()).isOneOf([ 0, _long.length ]);
							assert($input.val(_short).caret()).isOneOf([ 0, _short.length ]);
							assert($input.val(_empty).caret()).isOneOf([ 0, _empty.length ]);
						});
					});

					describe('<textarea>', function() {
						it("Returns zero (0) or value.length when the textarea's value changes", function() {
							assert($textarea.val(_short).caret()).isOneOf([ 0, _short.length ]);
							assert($textarea.val(_long).caret()).isOneOf([ 0, _long.length ]);
							assert($textarea.val(_short).caret()).isOneOf([ 0, _short.length ]);
							assert($textarea.val(_empty).caret()).isOneOf([ 0, _empty.length ]);
						});
					});
				});

				describe('Set', function() {
					describe('<input>', function() {
						var text = _single,
							len = text.length,
							mid = Math.floor(len / 2);

						it("Gets the same position that was set", function() {
							assert($input.val(text).caret(0).caret()).equals(0);
							assert($input.val(text).caret(1).caret()).equals(1);
							assert($input.val(text).caret(mid - 2).caret()).equals(mid - 2);
							assert($input.val(text).caret(mid - 1).caret()).equals(mid - 1);
							assert($input.val(text).caret(mid).caret()).equals(mid);
							assert($input.val(text).caret(mid + 1).caret()).equals(mid + 1);
							assert($input.val(text).caret(mid + 2).caret()).equals(mid + 2);
							assert($input.val(text).caret(len - 1).caret()).equals(len - 1);
							assert($input.val(text).caret(len).caret()).equals(len);
						});

						it("Enforces start/end boundaries", function() {
							assert($input.val(text).caret(-1).caret()).equals(0);
							assert($input.val(text).caret(len + 1).caret()).equals(len);
						});

						it("Converts floating point values to integers", function() {
							assert($input.val(text).caret(1.5).caret()).equals(1.0);
							assert($input.val(text).caret(2.5).caret()).equals(2.0);
						});
					});

					describe('<textarea>', function() {
						var text = _multi,
							len = text.norm().length,
							mid = text.indexOf('\n');

						it("Gets the same position that was set", function() {
							assert($textarea.val(text).caret(0).caret()).equals(0);
							assert($textarea.val(text).caret(1).caret()).equals(1);
							assert($textarea.val(text).caret(mid - 2).caret()).equals(mid - 2);
							assert($textarea.val(text).caret(mid - 1).caret()).equals(mid - 1);
							assert($textarea.val(text).caret(mid).caret()).equals(mid);
							assert($textarea.val(text).caret(mid + 1).caret()).equals(mid + 1);
							assert($textarea.val(text).caret(mid + 2).caret()).equals(mid + 2);
							assert($textarea.val(text).caret(len - 1).caret()).equals(len - 1);
							assert($textarea.val(text).caret(len).caret()).equals(len);
						});

						it("Enforces start/end boundaries", function() {
							assert($textarea.val(text).caret(-1).caret()).equals(0);
							assert($textarea.val(text).caret(len + 1).caret()).equals(len);
							assert($textarea.val(text).caret(len + 2).caret()).equals(len);
						});

						it("Converts floating point values to integers", function() {
							assert($textarea.val(text).caret(1.5).caret()).equals(1);
							assert($textarea.val(text).caret(2.5).caret()).equals(2);
						});
					});

					it("Accepts negative positions");
				});

				describe('Insert', function() {
					describe('<input>', function() {
						it("Prepends text", function() {
							assert($input.val('abc').caret(0).caret('123').val()).equals('123abc');
						});

						it("Appends text", function() {
							assert($input.val('abc').caret(3).caret('123').val()).equals('abc123');
						});

						it("Inserts text", function() {
							assert($input.val('abcdef').caret(3).caret('123').val()).equals('abc123def');
						});

						it("Respects maxlength attribute", function() {
							$input.attr('maxlength', 5);
							assert($input.val('abc').caret(0).caret('123').val()).equals('12abc');
							assert($input.val('abc').caret(3).caret('123').val()).equals('abc12');
							assert($input.val('abcde').caret(0).caret('123').val()).equals('abcde');
							assert($input.val('abcde').caret(3).caret('123').val()).equals('abcde');
							assert($input.val('abcde').caret(5).caret('123').val()).equals('abcde');
						});
					});
				});
			});
		});

	});

}());