jQuery Caret Plugin
===================

Cross-browser jQuery plugin that allows you to manipulate the cursor position and selection range
of ```<input>``` and ```<textarea>``` elements.

Works in IE 6+, Firefox, Chrome, and Safari.

Features
========

*   Get/set cursor position and selected range
*   Insert text at cursor position
*   Replace selected range with text
*   Handles differences in line endings between browsers

API
===

## ```$.fn.caret()```

Interrogate and manipulate the cursor position of an input field at a single point without selecting any text.

### ```.caret()``` returns ```Number```

Get the cursor position of the first matched element.  If one or more characters are selected, the start position of the selected range is returned.

### ```.caret(pos)``` returns ```jQuery```

Set the cursor position of the first matched element.

*   ```pos``` ```Number```: New cursor position.  Zero-based index relative to the beginning of the input's value.

### ```.caret(text)``` returns ```jQuery```

Insert text at the current cursor position of the first matched element and place the cursor _after_ the inserted text.

*   ```text``` ```String```: Text to insert at the current cursor position.

## ```$.fn.range()```

Interrogate and manipulate the selected range of an input field.

### ```.range()``` returns ```{ start: Number, end: Number, length: Number, text: String }```

Get the selected range (start and end position) of the first matched element, along with the value of the selected text and its length.
If no text is selected, the ```start``` and ```end``` position will be equal to the cursor position returned by ```.caret()```.

### ```.range(startPos, endPos)``` returns ```jQuery```

Set the selection range of the first matched element.

*   ```startPos``` ```Number```: New selection start position.  Zero-based index relative to the beginning of the input's value.
*   ```endPos``` ```Number```: New selection end position.  Zero-based index relative to the beginning of the input's value.

### ```.range(text)``` returns ```jQuery```

Replace the currently selected text of the first matched element with the given text and select the newly inserted text.

*   ```text``` ```{String}```: Text to replace the current selection with.

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

*  Normalize newlines?
*  Document how newlines are handled with respect to ```elem.value.length``` in IE
*  Accept negative offsets for cursor position arguments

License
=======

MIT license.  See MIT-LICENSE.txt.

[sitepoint-line-endings]: http://www.sitepoint.com/line-endings-in-javascript/
[stackoverflow-newline]: http://stackoverflow.com/a/1156388/467582
