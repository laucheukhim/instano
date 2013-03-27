/*
 * instano.hack.js - Instant NoScript Detection [hackers' edition]
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
	//settings.disabledCallback
	(settings.disabledCallbackDelay === "setTimeout" || settings.disabledCallbackDelay === "setInterval") || (settings.disabledCallbackDelay = false);
	(typeof settings.disabledCallbackDuration === "number" && settings.disabledCallbackDuration >= 0) || (settings.disabledCallbackDuration = false);





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

/* Detect if JavaScript is disabled and reenabled (not supported by Opera)
***************************************************************************/

	//requestAnimationFrame crossbrowser
	var reqFrame = (function() {
		var lastTime = 0, 
		vendors = ['ms', 'moz', 'webkit', 'o'],
		reqFrame = window.requestAnimationFrame;

		for(var x = 0; x < vendors.length && !reqFrame; ++x) {
			reqFrame = window[vendors[x]+'RequestAnimationFrame'];
		}

		if (!reqFrame){
			reqFrame = function(callback, element) {
				var currTime = Date.now();
				var timeToCall = Math.max(0, 16 - (currTime - lastTime));
				var id = window.setTimeout(function() { callback(currTime + timeToCall); }, 
					timeToCall);
				lastTime = currTime + timeToCall;
				return id;
			};
		}

		return reqFrame;
	})();

	var continuousTime = Date.now(), javascriptTime = Date.now(), reportStatus = true, 
	disabledDuration = 0, executeTimeout = false, executeInterval = false, executeTime;

	function step(timestamp) {
		continuousTime = Date.now();
		if (reportStatus) {
			if ((continuousTime - javascriptTime) >= 500) {
				disabledDuration++;
				if (disabledDuration > 10) {
	                // JavaScript is disabled
	                if (typeof settings.disabledCallback === "function") {
	                	if (settings.disabledCallbackDelay !== false && settings.disabledCallbackDuration !== false) {
	                		if (settings.disabledCallbackDelay === "setTimeout") executeTimeout = true;
	                		if (settings.disabledCallbackDelay === "setInterval") executeInterval = true;
	                		executeTime = continuousTime + settings.disabledCallbackDuration;
	                	} else {
	                		settings.disabledCallback();
	                	}
	                }
	                reportStatus = false;
	            }
	        }
	    } else {
	    	if ((continuousTime - javascriptTime) < 500) {
	            // JavaScript is reenabled
	            if (typeof settings.reenabledCallback === "function") {
	            	settings.reenabledCallback();
	            }
	            disabledDuration = 0;
	            executeTimeout = false;
	            executeInterval = false;
	            reportStatus = true;
	        }
	    }
	    if (executeTimeout) {
	    	if (continuousTime >= executeTime) {
	    		settings.disabledCallback();
	    		executeTimeout = false;
	    	}
	    }
	    if (executeInterval) {
	    	if (continuousTime >= executeTime) {
	    		settings.disabledCallback();
	    		executeTime = continuousTime + settings.disabledCallbackDuration;
	    	}
	    }
	    reqFrame(step);
	}
	//initialize 
	reqFrame(step);

	// standard reference timestamp
	setInterval(function() {
		javascriptTime = Date.now();
	}, 16);

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
	    }

	}
	//init-end

});