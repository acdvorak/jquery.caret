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

        var _e = function(tagName) {
            return document.createElement(tagName);
        };

        var _s = function(obj) {
            return JSON.stringify(obj, null, '    ');
        };

        var _support = {
            normalizesNewlines: (function () {
                var textarea = _e('textarea');
                textarea.value = '\r\n';
                return textarea.value === '\n';
            }())
        };

        var $fixture = $('#qunit-fixture');

        var _single = 'abcdefghijklmnop',
            _multi = 'abcd\r\nefg\r\nhijk\r\nlm',
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
                    // Note: Every browser handles automatic caret placement a little differently,
                    // which means our tests need to accommodate both placement strategies
                    // (at the beginning and end of the input/textarea).

                    it("Returns undefined when the jQuery object does not contain an input or textarea element", function() {
                        assert($().caret()).isUndefined();
                        assert($({}).caret()).isUndefined();
                        assert($('<div/>').caret()).isUndefined();
                        assert($([ _e('span'), _e('div'), _e('button') ]).caret()).isUndefined();
                    });

                    describe('<input>', function() {
                        it("Returns the caret position of the first input or textarea element in the jQuery object", function() {
                            var span = _e('span'),
                                div = _e('div'),
                                button = _e('button');

                            $input.val('abcdef').caret(3);

                            assert($([ span, div, button, $input[0] ]).caret()).equals(3);
                        });
                    });

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
                            assert($input.val(text).caret(2).caret()).equals(2);
                            assert($input.val(text).caret(mid - 2).caret()).equals(mid - 2);
                            assert($input.val(text).caret(mid - 1).caret()).equals(mid - 1);
                            assert($input.val(text).caret(mid).caret()).equals(mid);
                            assert($input.val(text).caret(mid + 1).caret()).equals(mid + 1);
                            assert($input.val(text).caret(mid + 2).caret()).equals(mid + 2);
                            assert($input.val(text).caret(len - 2).caret()).equals(len - 2);
                            assert($input.val(text).caret(len - 1).caret()).equals(len - 1);
                            assert($input.val(text).caret(len).caret()).equals(len);
                        });

                        it("Enforces length boundary", function() {
                            assert($input.val(text).caret(len + 1).caret()).equals(len);
                            assert($input.val(text).caret(len + 2).caret()).equals(len);
                        });

                        it("Allows negative position", function() {
                            assert($input.val(text).caret(-1).caret()).equals(len - 1);
                            assert($input.val(text).caret(-2).caret()).equals(len - 2);
                        });

                        it("Converts floating point values to integers", function() {
                            assert($input.val(text).caret(1.5).caret()).equals(1.0);
                            assert($input.val(text).caret(2.5).caret()).equals(2.0);
                        });
                    });

                    describe('<textarea>', function() {
                        var text = _multi,
                            len = text.norm().length,
                            nl1 = text.norm().indexOf('\n'),
                            nl2 = text.norm().lastIndexOf('\n');

                        it("Gets the same position that was set", function() {
                            assert($textarea.val(text).caret(0).caret()).equals(0);
                            assert($textarea.val(text).caret(1).caret()).equals(1);
                            assert($textarea.val(text).caret(2).caret()).equals(2);

                            assert($textarea.val(text).caret(nl1 - 2).caret()).equals(nl1 - 2);
                            assert($textarea.val(text).caret(nl1 - 1).caret()).equals(nl1 - 1);
                            assert($textarea.val(text).caret(nl1).caret()).equals(nl1);
                            assert($textarea.val(text).caret(nl1 + 1).caret()).equals(nl1 + 1);
                            assert($textarea.val(text).caret(nl1 + 2).caret()).equals(nl1 + 2);

                            assert($textarea.val(text).caret(nl2 - 2).caret()).equals(nl2 - 2);
                            assert($textarea.val(text).caret(nl2 - 1).caret()).equals(nl2 - 1);
                            assert($textarea.val(text).caret(nl2).caret()).equals(nl2);
                            assert($textarea.val(text).caret(nl2 + 1).caret()).equals(nl2 + 1);
                            assert($textarea.val(text).caret(nl2 + 2).caret()).equals(nl2 + 2);

                            assert($textarea.val(text).caret(len - 7).caret()).equals(len - 7);
                            assert($textarea.val(text).caret(len - 6).caret()).equals(len - 6);
                            assert($textarea.val(text).caret(len - 5).caret()).equals(len - 5);
                            assert($textarea.val(text).caret(len - 4).caret()).equals(len - 4);
                            assert($textarea.val(text).caret(len - 3).caret()).equals(len - 3);
                            assert($textarea.val(text).caret(len - 2).caret()).equals(len - 2);
                            assert($textarea.val(text).caret(len - 1).caret()).equals(len - 1);
                            assert($textarea.val(text).caret(len).caret()).equals(len);
                        });

                        it("Enforces length boundary", function() {
                            assert($textarea.val(text).caret(len + 1).caret()).equals(len);
                            assert($textarea.val(text).caret(len + 2).caret()).equals(len);
                        });

                        it("Allows negative position", function() {
                            assert($textarea.val(text).caret(-1).caret()).equals(len - 1);
                            assert($textarea.val(text).caret(-2).caret()).equals(len - 2);
                        });

                        it("Converts floating point values to integers", function() {
                            assert($textarea.val(text).caret(1.5).caret()).equals(1);
                            assert($textarea.val(text).caret(2.5).caret()).equals(2);
                        });
                    });
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

                        it("TODO: Test caret position AFTER insertion");
                    });

                    describe('<textarea>', function() {
                        it("Prepends text", function() {
                            assert($textarea.val('abc\ndef').caret(0).caret('123').val()).equals('123abc\ndef');
                        });

                        it("Appends text", function() {
                            assert($textarea.val('abc\ndef').caret(7).caret('123').val()).equals('abc\ndef123');
                            assert($textarea.val('abc\ndef').caret(8).caret('123').val()).equals('abc\ndef123');
                        });

                        it("Inserts text", function() {
                            assert($textarea.val('abc\ndef').caret(3).caret('123').val()).equals('abc123\ndef');
                            assert($textarea.val('abc\ndef').caret(4).caret('123').val()).equals('abc\n123def');
                        });

                        it("Respects maxlength attribute", function() {
                            $textarea.attr('maxlength', 9);
                            assert($textarea.val('abc\ndef').caret(0).caret('123').val()).equals('12abc\ndef');
                            assert($textarea.val('abc\ndef').caret(3).caret('123').val()).equals('abc12\ndef');
                            assert($textarea.val('abc\ndef').caret(4).caret('123').val()).equals('abc\n12def');
                            assert($textarea.val('abc\ndef\ng').caret(0).caret('123').val()).equals('abc\ndef\ng');
                            assert($textarea.val('abc\ndef\ng').caret(3).caret('123').val()).equals('abc\ndef\ng');
                            assert($textarea.val('abc\ndef\ng').caret(5).caret('123').val()).equals('abc\ndef\ng');
                        });

                        it("TODO: Test caret position AFTER insertion");
                    });
                });
            });

            describe('Range', function() {
                describe('Get', function () {
                    describe('<textarea>', function() {
                        it("Handles zero-length selections", function() {
                            assert(_s($textarea.val('abc\ndef').range(0, 0).range())).equals(_s({ start: 0, end: 0, length: 0, text: '' }));
                            assert(_s($textarea.val('abc\ndef').range(1, 1).range())).equals(_s({ start: 1, end: 1, length: 0, text: '' }));
                            assert(_s($textarea.val('abc\ndef').range(3, 3).range())).equals(_s({ start: 3, end: 3, length: 0, text: '' }));
                            assert(_s($textarea.val('abc\ndef').range(4, 4).range())).equals(_s({ start: 4, end: 4, length: 0, text: '' }));
                            assert(_s($textarea.val('abc\ndef').range(5, 5).range())).equals(_s({ start: 5, end: 5, length: 0, text: '' }));
                            assert(_s($textarea.val('abc\ndef').range(7, 7).range())).equals(_s({ start: 7, end: 7, length: 0, text: '' }));
                        });

                        it("Returns the correct range", function() {
                            assert(_s($textarea.val('abc\ndef').range(0, 7).range())).equals(_s({ start: 0, end: 7, length: 7, text: 'abc\ndef' }));
                            assert(_s($textarea.val('abc\ndef').range(2, 5).range())).equals(_s({ start: 2, end: 5, length: 3, text: 'c\nd' }));
                            assert(_s($textarea.val('abc\ndef').range(3, 4).range())).equals(_s({ start: 3, end: 4, length: 1, text: '\n' }));
                        });
                    });
                });

                describe('Set', function () {
                    describe('<textarea>', function() {
                        it("Accepts a single argument", function() {
                            assert(_s($textarea.val('abc\ndef').range(0).range())).equals(_s($textarea.val('abc\ndef').range(0, 7).range()));
                            assert(_s($textarea.val('abc\ndef').range(3).range())).equals(_s($textarea.val('abc\ndef').range(3, 7).range()));
                        });
                    });

                    describe('<textarea>', function() {
                        it("Accepts negative arguments", function() {
                            assert(_s($textarea.val('abc\ndef').range(-4).range())).equals(_s($textarea.val('abc\ndef').range(3).range()));
                            assert(_s($textarea.val('abc\ndef').range(0, -2).range())).equals(_s($textarea.val('abc\ndef').range(0, 5).range()));
                            assert(_s($textarea.val('abc\ndef').range(3, -2).range())).equals(_s($textarea.val('abc\ndef').range(3, 5).range()));
                            assert(_s($textarea.val('abc\ndef').range(-4, -2).range())).equals(_s($textarea.val('abc\ndef').range(3, 5).range()));
                        });
                    });
                });

                it("TODO: Test range positions AFTER replacement/insertion");
            });
        });

    });

}());