jQuery Caret Plugin
===================

## v1.5.2

Cross-browser jQuery plugin that allows you to manipulate the cursor position and selection range
of ```<input>``` and ```<textarea>``` elements, as well as highlight text on the page.

## Browser Compatibility

Tested in:

*  IE6+
*  Chrome
*  Firefox

Features
========

*   Get/set cursor position and selected range
*   Insert text at cursor position
*   Replace selected range with text
*   Handles differences in line endings between browsers
*   Select/deselect all text within any element

API
===

## Caret

    $.fn.caret()

Interrogate and manipulate the cursor position of an input field at a single point without selecting any text.

### ```.caret()``` returns ```Number```

Get the cursor position of the first matched element.  If one or more characters are selected, the start position of the selected range is returned.

### ```.caret(pos)``` returns ```jQuery``` object

Set the cursor position of the first matched element.

*   ```pos``` ```Number```: New cursor position.  Zero-based index relative to the beginning of the input's value.
    Negative numbers are relative to the end of the input's value.

Examples:

    // Place cursor after the 3rd character
    $('input').caret(3);
    $('input').val('Hello World').caret(3).caret() === 3;

    // Place cursor before the 3rd-last character
    $('input').caret(-3);
    $('input').val('Hello World').caret(-3).caret() === 8;

### ```.caret(text)``` returns ```jQuery``` object

Insert text at the current cursor position of the first matched element and place the cursor _after_ the inserted text.

*   ```text``` ```String```: Text to insert at the current cursor position.

Examples:

    // Insert some text at the current cursor position
    $('input').caret('Inserted Text');
    $('input').val('Held').caret(2).caret('llo Wor').val() === 'Hello World';
    $('input').val('Held').caret(2).caret('llo Wor').caret() === 9;

## Range

    $.fn.range()

Interrogate and manipulate the selected range of an input field.

### ```.range()``` returns ```Range```

Get the selected range (start and end position) of the first matched element, along with the value of the selected text and its length.
If no text is selected, the ```start``` and ```end``` position will be equal to the cursor position returned by ```.caret()```.

### ```.range(startPos [ , endPos ])``` returns ```jQuery``` object

Set the selection range of the first matched element.

*   ```startPos``` ```Number```: New selection start position.
    Zero-based index relative to the beginning of the input's value.
    Negative numbers are relative to the end of the input's value.

*   ```endPos``` ```Number``` ```(optional)```: New selection end position.
    Zero-based index relative to the beginning of the input's value.
    Negative numbers are relative to the end of the input's value.
    If omitted, defaults to ```value.length```.

Examples:

    // Select everything after the 6th character
    $('input').range(6);
    $('textarea').val('Hello\nWorld').range(6).range().text === 'World';

    // Select everything after the 3rd character through (and including) the 8th character
    $('input').range(3, 8);
    $('textarea').val('Hello\nWorld').range(3, 8).range().text === 'lo\nWo';

    // Select everything 5 characters from the end and later
    $('input').range(-5);
    $('textarea').val('Hello\nWorld').range(-5).range().text === 'World';

    // Select the 8th-last character up to (but NOT including) the 3rd-last character
    $('input').range(-8, -3);
    $('textarea').val('Hello\nWorld').range(-8, -3).range().text === 'lo\nWo';

### ```.range(text)``` returns ```jQuery``` object

Replace the currently selected text of the first matched element with the given text and select the newly inserted text.

*   ```text``` ```String```: Text to replace the current selection with.

Examples:

    $('input').range('Replacement Text');

    $('textarea').val('Hello\nWorld').range(0, 5).range('Goodbye').val() === 'Goodbye\nWorld';
    $('textarea').val('Hello\nWorld').range(5, 6).range(' - ').val() === 'Hello - World';

    // Same as inserting text via $('input').caret(2).caret('llo Wor')
    $('input').val('Held').range(2, 2).range('llo Wor').val() === 'Hello World';

## Select All

    $.fn.selectAll()

Selects all text in any element (```div```, ```span```, ```input```, ```textarea```, ```label```, etc.).

### ```.selectAll()``` returns ```jQuery``` object

## Deselect All

    $.deselectAll()

Deselects all text on the page.

### ```$.deselectAll()``` returns ```jQuery``` function

Types
=====

#### ```Range```:

    {
        start: Number,
        end: Number,
        length: Number,
        text: String
    }

Technical Notes
===============

## Line Endings (a.k.a. newlines)

IE and Opera handle line endings differently than Chrome, Safari, and Firefox.

From [JavaScript string newline character?][stackoverflow-newline] on Stack Overflow:

> IE8 and Opera 9 on Windows use ```\r\n```. All the other browsers I tested (Safari 4 and Firefox 3.5 on Windows,
> and Firefox 3.0 on Linux) use ```\n```. They can all handle ```\n``` just fine when setting the value, though
> IE and Opera will convert that back to ```\r\n``` again internally.
> There's a SitePoint article with some more details called [Line endings in Javascript][sitepoint-line-endings].

> Note also that this is independent of the actual line endings in the HTML file itself
> (both ```\n``` and ```\r\n``` give the same results).

> When submitting the form, all browsers canonicalize newlines to ```\r\n``` (```%0D%0A``` in URL encoding).

```.caret()``` and ```.range()``` smooth out these differences for you by normalizing line endings so they
behave properly in all browsers.  More specifically, they strip ```\r``` characters so that newlines are always
represented by a single ```\n``` character.  As a result, positioning the caret before or after a newline
works the way you expect without any fuss.

**IMPORTANT**: **_Always_** access input/textarea values using jQuery's ```.val()``` method instead.
**_DO NOT_** use the browser's native ```.value``` property.  Doing so will bypass newline normalization
and return strings containing ```\r``` in IE and Opera which will almost certainly screw up length and
position calculations.

Here's a quick test you can do to see if your browser normalizes line endings to ```\n```:

```javascript
// true in Chrome, Safari, and Firefox
// false in IE and Opera on Windows
var normalizesNewlines = (function () {
    var textarea = document.createElement('textarea');
    textarea.value = '\r\n';
    return textarea.value === '\n';
}());
```

## Detached Elements

It is not possible to **set** the selection range/caret position of a detached element in any browser.
The element **must** be in the DOM to be able to manipulate its caret/range.

Wrong:

```javascript
// false in all browsers
$('<input/>').val('abcdef').caret(3).caret() === 3;
```

Right:

```javascript
// true in all browsers
$('<input/>').appendTo($('body')).val('abcdef').caret(3).caret() === 3;
```

## Selection State

All browsers except IE track selection range on a per-element basis.  In other words, each element remembers
its own selection range and caret position so that switching focus from one input to another doesn't lose
the original input's selection range/caret position.

Predictably, IE only has a single global selection range for the entire page and can only track one element at a time.
Thus placing the cursor in the middle of an input and pressing <kbd>Tab</kbd> followed by <kbd>Shift</kbd> + <kbd>Tab</kbd>
loses the original input's caret position.

While not necessarily a huge issue, it's something to be aware of.

# Browser Bugs

## Deselecting Text in IE 6-10

In all versions of IE (6-10), clicking _inside_ selected text returns the wrong selection range and caret position.

Run ```test/manual/newline-range.html``` in any version of IE and select some text in the textarea.
Then click anywhere **inside** the selection (without moving the mouse) to see the bug in action.

Clicking _outside_ the selection works just fine.

License
=======

MIT license.  See ```MIT-LICENSE.txt```.

[sitepoint-line-endings]: http://www.sitepoint.com/line-endings-in-javascript/
[stackoverflow-newline]: http://stackoverflow.com/a/1156388/467582
