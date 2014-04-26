/*
 * instano.js - Instant NoScript Detection
 *
 * authors: Antony Lau and Zbyszek Tenerowicz
 * email: instano.js@gmail.com
 * license : MIT
 */

var instano = (function (settings) {
    "use strict";

    settings || (settings = {});

    settings.interval || (settings.interval = 100); // rejects 0
    (settings.displayStyle && settings.displayStyle === "block") || (settings.displayStyle = "inline-block");
    settings.indicator || (settings.indicator = false);
    //settings.reenabledCallback

    /* Testing for CSS animation support
     ***************************************************************************/

    var isAnimationSupported = false,
        domPrefixes = 'Webkit Moz O ms Khtml'.split(' '),
        testel = document.createElement('div');

    if(typeof testel.style.animationName !== "undefined") { isAnimationSupported = true; }

    if( isAnimationSupported === false ) {
        for( var i = 0; i < domPrefixes.length; i++ ) {
            if( typeof testel.style[ domPrefixes[i] + 'AnimationName' ] !== "undefined" ) {
                isAnimationSupported = true;
                break;
            }
        }
    }

    /* Detect if JavaScript is reenabled
     ***************************************************************************/
    var t1 = Date.now(),
        t1p = t1,
        dd = 0;

    // Detect if timestamp is updated with setInterval (resume upon reenabling)
    function t1check() {
        dd = t1 === t1p ? dd+1 : 0;
        if (dd >= 4) {
            // JavaScript is reenabled
            dd = 0;
            if (typeof settings.reenabledCallback === "function") settings.reenabledCallback(); // apply callback
            setTimeout(function(){t1update()}, 40); // restart update
        }
        t1p = t1;
    }
    setInterval(function(){t1check()}, 100);

    // Update timestamp with setTimeout (does not resume upon reenabling)
    function t1update() {
        t1 = Date.now();
        setTimeout(function(){t1update()}, 40);
    }
    setTimeout(function(){t1update()}, 40);

    /* Create the CSS animation class
     ***************************************************************************/
    if (isAnimationSupported) {
        var css =
            '.nojs_init { position:relative; display:inline-block; vertical-align:top; animation:nojs-animation 0.2s step-end; -moz-animation:nojs-animation 0.2s step-end; -webkit-animation:nojs-animation 0.2s step-end;  -o-animation:nojs-animation 0.2s step-end; } ' +
            '@keyframes nojs-animation { from {width:0px;height:0px;visibility:hidden;opacity:0;} to {width:1px;height:1px;visibility:visible;opacity:1;} } ' +
            '@-moz-keyframes nojs-animation { from {width:0px;height:0px;visibility:hidden;opacity:0;} to {width:1px;height:1px;visibility:visible;opacity:1;} } ' +
            '@-webkit-keyframes nojs-animation { from {width:0px;height:0px;visibility:hidden;opacity:0;} to {width:1px;height:1px;visibility:visible;opacity:1;} } ' +
            '@-o-keyframes nojs-animation { from {width:0px;height:0px;visibility:hidden;opacity:0;} to {width:1px;height:1px;visibility:visible;opacity:1;} }';
        if ('\v' == 'v') /* ie only */ {
            document.createStyleSheet().cssText = css;
        }
        else {
            var style = document.createElement('style');
            style.type = 'text/css';
            style.innerHTML = css;
            document.getElementsByTagName('head')[0].appendChild(style);
        }

        //start working immediately
        init(settings.indicator);
    }


    // Check if object o is a DOM element
    function isElement(o){
        return (
            typeof HTMLElement === "object" ? o instanceof HTMLElement : //DOM2
            o && typeof o === "object" && o.nodeType === 1 && typeof o.nodeName==="string"
        );
    }

    //inits
    function init(el){
        if (!el) {
            // Find all the noscript tags
            var nos = document.getElementsByTagName("noscript");
        } else if (Object.prototype.toString.call(el) === "[object Array]") {
            var nos = [];
            for (var i = 0; i < el.length; i++) {
                if (isElement(el[i])) {
                    var nosj = el[i].getElementsByTagName("noscript");
                    for (var j in nosj) {
                        if (isElement(nosj[j])) nos.push(nosj[j]);
                    }
                } else if (document.getElementById(el[i])) {
                    var nosj = document.getElementById(el[i]).getElementsByTagName("noscript");
                    for (var j in nosj) {
                        if (isElement(nosj[j])) nos.push(nosj[j]);
                    }
                }
            }
        } else if (isElement(el)) {
            // Find the noscript tags within an element
            var nos = el.getElementsByTagName("noscript");
        } else if (document.getElementById(el)) {
            var nos = document.getElementById(el).getElementsByTagName("noscript");
        }
        var elreplace = {};
        if (nos) {
            for (var i = 0; i < nos.length; i++) {
                var newone = document.createElement('div');
                newone.id = "jsdetect_" + i;
                newone.className = "nojs_init";
                newone.style.display = settings.displayStyle;
                newone.innerHTML = nos[i].textContent;
                elreplace[i] = {
                    parent: nos[i].parentNode,
                    newel: newone,
                    original: nos[i]
                };
            }
            for (var i in elreplace) {
                // Replace noscript with span
                elreplace[i].parent.replaceChild(elreplace[i].newel, elreplace[i].original);
            }
            // Continuously replace element to stop animation
            setInterval(function() {
                for (var i in elreplace) {
                    var el = document.getElementById(elreplace[i].newel.id);
                    var newone = el.cloneNode(true);
                    el.parentNode.replaceChild(newone, el);
                }
            }, settings.interval);
            // Bug fix for #3
            // Stop noscript tags from showing up in Firefox while reloading
            window.addEventListener("beforeunload", function() {
                // Hide all the noscript tags since in Firefox JavaScript will
                // stop running momentarily before the page is reloaded
                for (var i in elreplace) {
                    var el = document.getElementById(elreplace[i].newel.id);
                    el.style.display = "none";
                }
                // But in case the user canceled the reload in the onbeforeunload
                // prompt, restore the noscript tags so they will work again
                // Use two timeouts to detect cancellation. The first timeout will
                // not fire until the prompt is dismissed and the second timeout
                // will only fire when the prompt is cancelled.
                setTimeout(function() {
                    setTimeout(function() {
                        for (var i in elreplace) {
                            var el = document.getElementById(elreplace[i].newel.id);
                            el.style.display = settings.displayStyle;
                        }
                    }, 0);
                }, 0);
            });
        }
    }
    //init-end

});