instano
=======

instano.js - Instant NoScript Detection

instano.js allows you to instantly detect if JavaScript is disabled after the page is loaded. It modifies the standard `<noscript>` tags so that the messages inside can be shown immediately whenever JavaScript is disabled.

A CSS animation is used to display the message and a `setInterval` continuously stops the animation. Once JavaScript is disabled, the animation kicks in and the message is shown.

[Experimental]: Callback functions can be applied upon disabling and reenabling of JavaScript by taking advantage of the possible loophole that JavaScript continues to run under `requestAnimationFrame`.

See it in action: http://laucheukhim.github.com/instano/

## Basic Usage

    instano().init();
    
This tells instano.js to search for all the `<noscript>` tags on a page and convert them to instant noscript messages.

### Select elements

To specify the elements for processing, pass the element (or its id) or an array of elements (or their ids) as the parameter of `instano()`. 
    
    instano(<element>).init();
    instano(<array of elements>).init();

Make sure the elements contain at least one pair of `<noscript>` tags so that the message shows correctly when the page is first loaded with JavaScript disabled.

    <div id="nojs1"><noscript>First message</noscript></div>
    <div id="nojs2"><noscript>Second message</noscript></div>

- `instano(document.getElementById("nojs1")).init();` applies only to the first message.
- `instano(["nojs1","nojs2"]).init();` applies to both of the messages.

### Modify frequency and style

To specify the detection frequency and the display style of the messages, provide the following parameters for `init()`:

    instano().init(<frequency>, <style>);

- `instano().init(50, "block");` converts all the `<noscript>` tags into instant noscript messages with a detection frequency of 50ms and a CSS style of `display: block`.
- The default values are 100ms and `display: inline-block` respectively.
- Allowed values for frequency: 0 - 200 (A value of 0 is found to be CPU intensive. Choose it wisely)
- Allowed values for style: "block", "inline-block"

## Callback Functions (Experimental)

    instano()
    .disabled(function() { }, <setTimeout or setInterval>, <duration>) // The last two parameters are optional
    .reenabled(function() { });

This tells instano.js to run a function when JavaScript is disabled or reenabled. This is an experimental feature using a possible loophole in `requestAnimationFrame` being processed regarless of whether JavaScript is disabled or not. Use with caution.
