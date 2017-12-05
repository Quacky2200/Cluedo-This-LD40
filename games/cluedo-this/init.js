(function() {

	return console.getInput(
		'Enter first name or nickname:\n> ', 
		undefined, 
		/[a-zA-Z]+/
	).then(function(name) {
		console.clear();
		console.log('Hello there, Detective', name + '...');
		var player = Character.prototype.getPlayer();
		player.setName('Detective ' + name);
		player.canHaveItems = true;
		player.canSendItems = true;
		player.canGetItems = true;
		player.canDescribe = false;
		player.canConverse = false;
		player.setGender('male');
		return new Promise((resolve, reject) => {
			setTimeout(() => resolve(player), 1500);
		});
	}).then(function(player){
		console.clear();
		console.log('Loading...');
	}).then(() => {
		return Promise.all([
			$(console.getPath() + '/title.htm'),
			console.preloadAudio([
				console.getPath() + '/media/dreaded-things-approach-teknoaxe.mp3',
				console.getPath() + '/media/galactic-exploration-machinimasound.mp3',
				console.getPath() + '/media/panorama-machinimasound.mp3',
				console.getPath() + '/media/dystopia-machinimasound.mp3',
			])
		]);
	}).then(function([title]) {
		console.clear();
		console.setMusicVolume(1);
		//console.playMusic(console.getPath() + '/media/dreaded-things-approach-teknoaxe.mp3');
		//document.body.innerHTML = title;
		return new Promise(function(resolve, reject) {
			//setTimeout(() => {
				//volumedip = setInterval(function() {
					//if (console.getMusicVolume() === 0.0) {
						//console.stopMusic();
						//console.clear();
						//console.setMusicVolume(1);
						//clearInterval(volumedip);

						console.playMusic(console.getPath() + '/media/galactic-exploration-machinimasound.mp3');
						return $(console.getPath() + '/story.js');

					//} else {
					//	console.setMusicVolume(console.getMusicVolume() - 0.025);
					//}
				//}, 100);
			//}, 10000);
		});
	});
}());
