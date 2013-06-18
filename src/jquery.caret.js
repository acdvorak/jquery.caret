/*! jQuery Caret plugin v1.0.0 | (c) 2012, 2013 Andrew C. Dvorak | github.com/acdvorak/jquery.caret */
(function ($) {
    var _input = document.createElement('input');

    var features = {
        setSelectionRange: ('setSelectionRange' in _input) || ('selectionStart' in _input),
        createTextRange: ('createTextRange' in _input) || ('selection' in document)
    };

    $.fn.extend({

        /**
         * Usage: // Get position
         *        var pos = $('input:first').caret()
         *
         *        // Set position
         *        $('input:first').caret(15)
         *
         *        // Insert text at current position
         *        $('input:first').caret("Some text")
         */
        caret: function () {
            var el = this.length > 0 ? this[0] : null;
            var $el = $(el);

            var valid = this.length && this.is('input, textarea');
            var range;

            // getCaret()
            // From http://stackoverflow.com/questions/263743/how-to-get-cursor-position-in-textarea/263796#263796
            if (arguments.length === 0) {
                if (!valid) {
                    return;
                }

                // Mozilla, et al.
                if (features.setSelectionRange) {
                    return el.selectionStart;
                }
                // IE
                else if (features.createTextRange) {
                    $el.focus();

                    var r = document.selection.createRange();

                    if (r == null) {
                        return 0;
                    }

                    var tr1 = el.createTextRange();
                    var tr2 = tr1.duplicate();

                    tr1.moveToBookmark(r.getBookmark());
                    tr2.setEndPoint('EndToStart', tr1);

                    return tr2.text.length;
                }

                return 0;
            }
            // setCaret(position)
            // From http://parentnode.org/javascript/working-with-the-cursor-position/
            else if (typeof arguments[0] === 'number' && /^\d+$/.test(arguments[0])) {
                if (!valid) {
                    return this;
                }

                var pos = arguments[0] * 1;

                el.focus();

                // Mozilla, et al.
                if (features.setSelectionRange) {
                    el.setSelectionRange(pos, pos);
                }
                // IE
                else if (features.createTextRange) {
                    range = el.createTextRange();
                    range.move('character', pos);
                    range.select();
                }
            }
            // insertAtCaret(text)
            // From http://parentnode.org/javascript/working-with-the-cursor-position/
            else {
                if (!valid) {
                    return this;
                }

                var text = arguments[0];
                var curPos = this.caret();

                var newLength = (curPos + text.length + (el.value.length - curPos)) * 1;
                var maxLength = el.getAttribute('maxlength') * 1;

                // TODO: is there a better way to implement this?
                if(el.hasAttribute('maxlength') && newLength > maxLength) {
                    var delta = text.length - (newLength - maxLength);
                    text = text.substr(0, delta);
                }

                el.value = el.value.substr(0, curPos) + text + el.value.substr(curPos);

                this.caret(curPos + text.length);
            }

            return this;
        },

        range: function () {
            var el = this.length > 0 ? this[0] : null;
            var $el = $(el);

            var valid = this.length && this.is('input, textarea');
            var range = { start: 0, end: 0, length: 0, text: '' };

            // getRange() = { start: pos, end: pos }
            // From http://stackoverflow.com/questions/263743/how-to-get-cursor-position-in-textarea/263796#263796
            //      http://stackoverflow.com/a/2966703/467582
            if (arguments.length === 0) {
                if (!valid) {
                    return range;
                }

//                var $input = $(this);
//                var saved = $input.data('range');
//
//                if(saved) {
//                    $input.removeData('range')
//                    return range;
//                }

                // Mozilla, et al.
                if (features.setSelectionRange) {
                    range.start = el.selectionStart;
                    range.end = el.selectionEnd;

                    var min = Math.min(range.start, range.end);
                    var max = Math.max(range.start, range.end);

                    range.length = max - min;
                    range.text = el.value.substring(min, max);
                }
                // IE
                else if (features.createTextRange) {
                    $el.focus();

                    var sr = document.selection.createRange();

                    if (!sr) {
                        return range;
                    }

                    // http://stackoverflow.com/a/2966703/467582
                    if(false) {
                        e.focus();
                        var r = document.selection.createRange();
                        var tr = e.createTextRange();
                        var tr2 = tr.duplicate();
                        tr2.moveToBookmark(r.getBookmark());
                        tr.setEndPoint('EndToStart',tr2);
                        if (r == null || tr == null) return { start: e.value.length, end: e.value.length, length: 0, text: '' };
                        var text_part = r.text.replace(/[\r\n]/g,'.'); //for some reason IE doesn't always count the \n and \r in the length
                        var text_whole = e.value.replace(/[\r\n]/g,'.');
                        var the_start = text_whole.indexOf(text_part,tr.text.length);
                        return { start: the_start, end: the_start + text_part.length, length: text_part.length, text: r.text };
                    }

                    var tr_beginning = el.createTextRange();
                    var tr_selection = tr_beginning.duplicate();

                    tr_selection.moveToBookmark(sr.getBookmark());
                    tr_beginning.setEndPoint('EndToStart', tr_selection);

                    console.log('tr_beginning.text = ', tr_beginning.text);
                    console.log('tr_selection.text = ', tr_selection.text);

//                    logger.each(tr_beginning, 'tr_beginning');
//                    logger.each(tr_selection, 'tr_selection');

                    var text_selected_fixed = sr.text.replace(/[\r\n]/g, '.'); // for some reason IE doesn't always count the \n and \r in the length
                    var text_entire_fixed = el.value.replace(/[\r\n]/g, '.');

//                    range.start = Math.max(text_entire_fixed.indexOf(text_selected_fixed, tr_selection.text.length), 0);
                    range.start = tr_beginning.text.length;
                    range.end = range.start + text_selected_fixed.length;

                    range.length = text_selected_fixed.length;
                    range.text = sr.text;

                    if(range.length === 0) {
                        range.start = range.end = this.caret();
                    }

                    console.log('$(', el, ').range() = {');
                    console.log('    start: ',   range.start);
                    console.log('    end: ',     range.end);
                    console.log('    length: ',  range.length);
                    console.log('    text: "',   range.text, '"');
                    console.log('};');

                    console.log(' ');
                    console.log('~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~')
                    console.log(' ');
                }

                return range;
            }
            // setRange(startPos, endPos)
            // From http://parentnode.org/javascript/working-with-the-cursor-position/
            //      http://stackoverflow.com/a/2966703/467582
            else if (typeof arguments[0] === 'number' && /^\d+$/.test(arguments[0])) {
                if (!valid) {
                    return this;
                }

                var startPos = arguments[0] * 1,
                    endPos = arguments[1] * 1;

                console.warn('setRange: ', startPos, ', ', endPos);

//                el.focus();

                // Mozilla, et al.
                if (features.setSelectionRange) {
                    el.setSelectionRange(startPos, endPos);
                }
                // IE
                else if (features.createTextRange) {
                    // v1
//                    range = el.createTextRange();
//                    range.collapse(true);
//                    range.moveStart('character', startPos);
//                    range.moveEnd('character', endPos);
//                    range.select();

                    // v2

                    var tr = el.createTextRange();

                    // Fix IE from counting the newline characters as two separate characters
                    var stop_it = startPos;

                    for (var i = 0; i < stop_it; i++) {
                        if (el.value.substr(i, 1).search(/[\r\n]/) != -1) {
                            startPos = startPos - .5;
                        }
                    }

                    stop_it = endPos;

                    for (i = 0; i < stop_it; i++) {
                        if (el.value.substr(i, 1).search(/[\r\n]/) != -1) {
                            endPos = endPos - .5;
                        }
                    }

                    tr.moveEnd('textedit', -1);
                    tr.moveStart('character', startPos);
                    tr.moveEnd('character', endPos - startPos);
                    tr.select();
                }
            }
            // replaceRange(text)
            // From http://parentnode.org/javascript/working-with-the-cursor-position/
            else {
                if (!valid) {
                    return this;
                }

                var oldValue = $el.val();
                var replacementText = arguments[0];
                var selection = this.range();

                // TODO: This commented-out section throws an error in IE7
                var newLength = (selection.start + replacementText.length + (oldValue.length - selection.end)) * 1;
                var maxLength = $el.attr('maxlength') * 1;

                // TODO: is there a better way to implement this?
                if($el.is('[maxlength]') && newLength > maxLength) {
                    var delta = replacementText.length - (newLength - maxLength);
                    replacementText = replacementText.substr(0, delta);
                }

                // Now that we know what the user selected, we can replace it
                var startText = oldValue.substr(0, selection.start);
                var endText = oldValue.substr(selection.end);
                $el.val(startText + replacementText + endText);

                // Reset the selection
                var startPos = selection.start;
                var endPos = startPos + replacementText.length;

                console.info('restore selection startPos = ', startPos, ', endPos = ', endPos);

                this.range(selection.length ? startPos : endPos, endPos);
            }

            return this;
        }

    });
})(jQuery);