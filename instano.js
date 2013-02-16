/*
 * Instano.js - Instant NoScript Detection
 *
 * @author: Antony Lau (laucheukhim@gmail.com)
 */

var instano = (function (el) {
	
	// Testing for CSS animation support
	var animation = false,
		animationstring = 'animation',
		keyframeprefix = '',
		domPrefixes = 'Webkit Moz O ms Khtml'.split(' '),
		pfx  = '',
		testel = document.createElement('div');
	
	if( testel.style.animationName ) { animation = true; }    
	 
	if( animation === false ) {
	  for( var i = 0; i < domPrefixes.length; i++ ) {
		if( testel.style[ domPrefixes[i] + 'AnimationName' ] !== undefined ) {
		  pfx = domPrefixes[ i ];
		  animationstring = pfx + 'Animation';
		  keyframeprefix = '-' + pfx.toLowerCase() + '-';
		  animation = true;
		  break;
		}
	  }
	}
	if(animation){alert("animation");}
	if (animation) {
		// Create the CSS animation class
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
	}
	
	var func = function (el) {
		var selectAll = (arguments.length === 0) ? true : false;
		// Check if it is a DOM element
		function isElement(o){
			return (
				typeof HTMLElement === "object" ? o instanceof HTMLElement : //DOM2
				o && typeof o === "object" && o.nodeType === 1 && typeof o.nodeName==="string"
			);
		}
		return {
			init: function(interval, displayStyle) {
				interval = Math.round(typeof interval === "number" ? (interval >= 0 && interval <= 200 ?interval : 100) : 100);
				displayStyle = displayStyle === "block" || displayStyle === "inline-block" ? displayStyle : "inline-block";
				if (animation) {
					if (selectAll) {
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
							newone.style.display = displayStyle;
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
						// WARNING: An interval of 0 is found to be CPU intensive. Choose it wisely.
						setInterval(function() {
							for (var i in elreplace) {
								var el = document.getElementById(elreplace[i].newel.id);
								var newone = el.cloneNode(true);
								el.parentNode.replaceChild(newone, el);
							}
						}, interval);
					}
				}
			}
		};
	}
	
	return func;
})();
