jQuery Caret Plugin
===================

## v1.2.0

Cross-browser jQuery plugin that allows you to manipulate the cursor position and selection range
of ```<input>``` and ```<textarea>``` elements, as well as highlight text on the page.

Tested in IE8+, Firefox, Chrome, and Safari.  May work in IE 6-7 but has not been tested.

Features
========

*   Get/set cursor position and selected range
*   Insert text at cursor position
*   Replace selected range with text
*   Handles differences in line endings between browsers
*   Select all text within a child-bearing element (e.g., ```<div>``` or ```<span>```)

API
===

## Caret

    $.fn.caret()

Interrogate and manipulate the cursor position of an input field at a single point without selecting any text.

### ```.caret()``` returns ```Number```

Get the cursor position of the first matched element.  If one or more characters are selected, the start position of the selected range is returned.

### ```.caret(pos)``` returns ```jQuery```

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

### ```.caret(text)``` returns ```jQuery```

Insert text at the current cursor position of the first matched element and place the cursor _after_ the inserted text.

*   ```text``` ```String```: Text to insert at the current cursor position.

Examples:

    // Insert some text at the current cursor position
    $('input').caret('Inserted Text');
    $('input').val('Held').caret(2).caret('llo Wor').val() === 'Hello World';

## Range

    $.fn.range()

Interrogate and manipulate the selected range of an input field.

### ```.range()``` returns ```Range```

Get the selected range (start and end position) of the first matched element, along with the value of the selected text and its length.
If no text is selected, the ```start``` and ```end``` position will be equal to the cursor position returned by ```.caret()```.

### ```.range(startPos [ , endPos ])``` returns ```jQuery```

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

    // Select everything after the 3rd character up to (and including) the 8th character
    $('input').range(3, 8);
    $('textarea').val('Hello\nWorld').range(3, 8).range().text === 'lo\nWo';

    // Select everything 5 characters from the end and later
    $('input').range(-5);
    $('textarea').val('Hello\nWorld').range(-5).range().text === 'World';

    // Select the 8th-last character through (but NOT including) the 3rd-last character
    $('input').range(-8, -3);
    $('textarea').val('Hello\nWorld').range(-8, -3).range().text === 'lo\nWo';

### ```.range(text)``` returns ```jQuery```

Replace the currently selected text of the first matched element with the given text and select the newly inserted text.

*   ```text``` ```{String}```: Text to replace the current selection with.

Examples:

    $('input').range('Replacement Text');

    $('textarea').val('Hello\nWorld').range(0, 5).range('Goodbye').val() === 'Goodbye\nWorld';
    $('textarea').val('Hello\nWorld').range(5, 6).range(' - ').val() === 'Hello - World';

    // Same as $('input').caret(2).caret('llo Wor')
    $('input').val('Held').range(2, 2).range('llo Wor').val() === 'Hello World';

## Highlight

    $.fn.highlight()

Highlights (selects) all text in child-bearing elements (e.g., ```<span>```, ```<div>```, but not ```<input>``` or ```<br/>```).

### ```.highlight()``` returns ```jQuery```

Types
=====

#### ```Range```:

    {
        start: Number,
        end: Number,
        length: Number,
        text: String
    }

Gotchas
=======

*   Line Endings (a.k.a. newlines)

    IE and Opera handle line endings differently than Chrome, Safari, and Firefox.

    From [JavaScript string newline character?][stackoverflow-newline] on Stack Overflow:

    > IE8 and Opera 9 on Windows use ```\r\n```. All the other browsers I tested (Safari 4 and Firefox 3.5 on Windows,
    > and Firefox 3.0 on Linux) use ```\n```. They can all handle ```\n``` just fine when setting the value, though
    > IE and Opera will convert that back to ```\r\n``` again internally.
    > There's a SitePoint article with some more details called [Line endings in Javascript][sitepoint-line-endings].

    > Note also that this is independent of the actual line endings in the HTML file itself
    > (both ```\n``` and ```\r\n``` give the same results).

    > When submitting the form, all browsers canonicalize newlines to ```\r\n``` (```%0D%0A``` in URL encoding).

    ```.caret()``` and ```.range()``` do not normalize line endings, so the following code will behave differently
    in IE than it does in all other browsers:

    ```javascript
    var $textarea = $('textarea');
    $textarea.val('Line 1\nLine 2');

    // All browsers: "ine 1"
    console.log($textarea.range(1, 6).range().text);

    // Internet Explorer:  "ine 1"
    // All other browsers: "ine 1\n"
    console.log($textarea.range(1, 7).range().text);

    // Internet Explorer:  "ine 1"
    // All other browsers: "ine 1\nL"
    console.log($textarea.range(1, 8).range().text);

    // Internet Explorer:  "ine 1\r\nL"
    // All other browsers: "ine 1\nLi"
    console.log($textarea.range(1, 9).range().text);
    ```

TODO
====

*  Verify assertions about normalizing line endings in "Gotchas" section

License
=======

MIT license.  See MIT-LICENSE.txt.

[sitepoint-line-endings]: http://www.sitepoint.com/line-endings-in-javascript/
[stackoverflow-newline]: http://stackoverflow.com/a/1156388/467582
