/**
 * Basic Intalisation Script
 * Reads out first run text and hosts a basic menu of all games present
 * @author Matthew James <Quacky2200@hotmail.com>
 */
(function () {
	Promise.all([
		$('games/index.json'),
	]).then(function (required) {
		let games = required[0];
		required = undefined;
		console.setTitle('Console');
		let commands = {
			'help': {
				description: 'Shows helpful information on the commands available',
				run: function () {
					return new Promise(function (resolve, reject) {
						var keys = Object.keys(commands).sort();
						var str = '';
						for (var i = 0; i < keys.length; i++) {
							var cmd = commands[keys[i]];

							str += keys[i] + "\n  " + cmd.description + '\n';
						}
						console.print(str).then(() => {
							reject();
						})
					});
				}
			},
			'set theme red': {
				description: 'Set the color of the terminal to a scrumptious blood red',
				run: function () {
					document.body.setAttribute('class', 'murdermystery');
					return Promise.reject();
				}
			},
			'set theme snowy': {
				description: 'Set the color of the terminal to snowy white christmas',
				run: function () {
					document.body.setAttribute('class', 'christmas');
					return Promise.reject();
				}
			},
			'set theme grey': {
				description: 'Set the color of the terminal to a boring linux shell',
				run: function() {
					document.body.setAttribute('class', 'sh');
					return Promise.reject();
				}
			},
			'set theme lime': {
				description: 'Set the color of the terminal to (lime) green',
				run: function () {
					document.body.setAttribute('class', 'terminal');
					return Promise.reject();
				}
			},
			'set theme blue': {
				description: 'Set the color of the terminal to blue',
				run: function () {
					document.body.setAttribute('class', 'doctorwho');
					return Promise.reject();
				}
			},
			'exit': {
				description: 'Exit the application',
				run: () => {
					history.go(-1);
					return Promise.resolve();
				}
			}
		};
		if (games && games.toString() !== '') {
			var len = Object.keys(games).length;
			var desc = (len == 1 ? 'One game is' : len + ' games are');
			var welcome = 'Welcome!\n' + desc + ' available to play.\n\nType help to see all commands';
			for (var item in games) {
				commands['play ' + item] = {
					description: 'Play the ' + item + ' text adventure game',
					run: function() {
						console.getPath = function() { return games[item]['path']};
						console.getFile = function() { return games[item]['file']};
						return $(console.getPath() + '/' + console.getFile());
					}
				}
			}
			inspector.log('%cUse the \'help\' command to see help', 'font-size: 9px; color: gray');
			var mainLoop = function () {
				console.getInput(undefined, Object.keys(commands)).then(function (command) {
					if (Object.keys(commands).indexOf(command.toLowerCase()) > -1) {
						commands[command.toLowerCase()].run().catch((err) => {console.log(err); mainLoop();});
					} else {
						console.print('Unknown command').then(() => mainLoop());
					}
				});
			};
			console.type(welcome, 1, true, true).then(() => mainLoop());
		} else {
			console.log('No text-adventure games are available to play at this moment.\n\nApologies for any inconvenience.');
		}
	});
}());
