instano
=======

instano.js - Instant NoScript Detection

> instano.js is in Alpha stage. Development use only.

instano.js allows you to instantly detect if JavaScript is disabled after the page is loaded. It modifies the standard `<noscript>` tags so that the messages inside can be shown immediately whenever JavaScript is disabled.

A CSS animation is used to display the message and a `setInterval` continuously stops the animation. Once JavaScript is disabled, the animation kicks in and the message is shown.

Aslo, callback functions can be applied upon reenabling of JavaScript.

See it in action: http://laucheukhim.github.com/instano/

## Basic Usage

    instano();
    
This tells instano.js to search for all the `<noscript>` tags on a page and convert them to instant noscript messages.

### Select elements

To specify the elements for processing, pass the element (or its id) or an array of elements (or their ids) as the parameter of `instano()`. 
    
    instano({
    	indicator:<element>
    	});

	instano({
    	indicator:<array of elements>
    	});



Make sure the elements contain at least one pair of `<noscript>` tags so that the message shows correctly when the page is first loaded with JavaScript disabled.

    <div id="nojs1"><noscript>First message</noscript></div>
    <div id="nojs2"><noscript>Second message</noscript></div>

- `instano({
    	indicator:document.getElementById("nojs1")
    });` applies only to the first message.
- `instano({
    	indicator:["nojs1","nojs2"]
    });` applies to both of the messages.

### Modify frequency and style

To specify the detection frequency and the display style of the messages, provide the following parameters for `init()`:

    instano({
		interval:<detect each X miliseconds>,
		displayStyle:<style>
    	});

- `instano({
		interval:50,
		displayStyle:"block"
    	});` converts all the `<noscript>` tags into instant noscript messages with a detection frequency of 50ms and a CSS style of `display: block`.
- The default values are 100ms and `display: inline-block` respectively.
- Allowed values for interval: numbers above 0 (small values are CPU intensive. Choose it wisely)
- Allowed values for style: "block", "inline-block"

## Callback Function 

    instano({
    	reenabledCallback:function(){}
    	})

This tells instano.js to run a function when JavaScript is reenabled.

###Hackers' edition (instano.hack.js)

Callback functions can be applied upon both disabling and reenabling of JavaScript by taking advantage of `requestAnimationFrame` to keep JavaScript running.

    instano({
        disabledCallback:function(){},
        [disabledCallbackDelay: <setTimeout or setInterval>,]
        [disabledCallbackDuration: <duration in miliseconds>,]
        reenabledCallback:function(){}
        })

This tells instano.hack.js to run a function when JavaScript is disabled and/or reenabled. The disabled callback function runs immediately after JavaScript is disabled. You can also run it after a delay or set it to run in repeating intervals by passing relevant parameters to disabledCallbackDelay and disabledCallbackDuration.
