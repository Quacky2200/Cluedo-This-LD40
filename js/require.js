/*jshint esversion: 6 */
/*global window, document, console, media*/
(function () {
	const inspector = window.console;

	const $ = function (file) {
		return new Promise( function(resolve, reject) {
			var xhttp = new XMLHttpRequest();
			xhttp.onreadystatechange = function () {
				if (this.readyState === 4 && this.status === 200) {
					if (file.match(/\.(php|htm[l]?|txt)$/)) {
						resolve(this.responseText);
					} else if (file.match(/\.(js)$/)) {
						inspector.log(this.responseText);
						var fn = eval(this.responseText + '\n// File: ' + file);
						if (fn && fn.constructor.name == 'Promise') {
							// Try to get the resolved promise if one is given to us
							fn.then((value) => resolve(value)).catch((value) => reject(value));
						} else {
							resolve(fn);
						}
						resolve(fn);
					} else if (file.match(/\.(json)$/)) {
						try {
							resolve(JSON.parse(this.responseText));
						} catch (e) {
							console.error('Error in ' + file + '\n' + e.message);
						}
					} else if (file.match(/http[s]?\:\/\//)) {
						resolve(this.responseText);
					} else {
						reject(new Error('This function cannot handle that file type!'));
					}
				} else if (this.readyState === 4 && this.status !== 200) {
					window.console.log(this.status + ' response code for ' + file);
				}
			};
			xhttp.open("GET", file, true); //'chapters/' + chapter + '.php', true);
			xhttp.send();
		});
	};

	const genChars = function (len, chars) {
		len = len || 10;
		chars = chars || "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
		var text = "";
		for (var i = 0; i < len; i += 1) {
			text += chars.charAt(Math.floor(Math.random() * chars.length));
		}
		return text;
	};
	const randInt = function (min, max) {
		return Math.floor((Math.random() * max) + min);
	};

	const promiseWhile = function(cond, fn) {
		// Create new promise for us to resolve
		return new Promise(function (resolve, reject) {
			/**
			 * Create a generator that will try to keep
			 * running the function when the condition
			 * is rejected and resolve it when it's met.
			 */
			var generate = function() {
				// See whether we are worthy
				var result = cond();
				// If we have been resolved (exit from loop)
				result.then(function() {
					// Resolve the main promise we had
					resolve();
				})
				// Otherwise, when rejected...
				.catch(function() {
					// Run the function during before the cycle ends
					fn().then(function() {
						// After we run the function, cycle
						generate();
					});
				});
			};
			// Start cycle
			generate();
		});
	};

	const sleepMs = function(ms) { return new Promise(function(resolve, reject) { setTimeout(resolve, ms); }); };
	const sleepS = function(s) { return sleepMs(s * 1000); };
	const scrollTo = function(e) { window.scrollBy(0, e.offsetTop + e.offsetHeight); };
	let console;

	Promise.all([
		$('js/console.js'),
	]).then(function (required) {
	    [console] = required;
		required = undefined;
		window.$ = $;
		window.console = console;
		document.onreadystatechange = function () {
			if (document.readyState === 'complete') {

				$('js/init.js');

				document.onreadystatechange = null;
			}
		};
		// Run in-case the document state has already changed by this time
		document.onreadystatechange();

	}).catch((err) => {
		inspector.log('Oh no! ' + err);
	});
}());
