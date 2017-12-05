(function() {

	var player = Character.prototype.getPlayer();

	wal = new Item('detective_wallet');
	wal.setName('wallet');
	wal.setDescription('Contains a bob or two and a small black \'n white picture of my Wife. I could do with a new one.');
	wal.canUse      = false;
	wal.canPickup   = true;
	wal.canDescribe = true;
	wal.canGive     = false;
	wal.setBelonging(player);

	keys = new Item('detective_keys');
	keys.setName('keys');
	keys.setPlural(true);
	keys.setDescription('Opens a couple of locked things.');
	keys.canUse     = true;
	keys.canPickup  = true;
	keys.canDrop    = true;
	keys.canGive    = false;
	keys.canDescribe = true;
	keys.setBelonging(player);

	player.addItem(wal);
	player.addItem(keys);

	var masterbedroom = new Room('detective_bedroom');
	var clothes = new Item('clothes');
	clothes.canPickup = true;
	clothes.canDrop = false;
	clothes.canUse = false;
	clothes.used = false;
	clothes.setDescription('Put on some clothes to go to the crime scene in day clothes.');
	clothes.onPickup = function() {
		Room.getCurrentRoom().removeItem(this);
		return console.type('You put on some smart clothes to impress others of your cleansiness.').then(() => {return false});
	};
	Room.prototype.setCurrentRoom(masterbedroom);

	masterbedroom.setName('Master Bedroom');

	masterbedroom.setDescription('You lie awake on a warm bed next to your Wife. She is loudly snoring and must have been tired from today. Your mind is racing through various thoughts; many of them doubts at your ability as a Detective. From others, the `one and only`, best in the striving town of Burdock, UK since the 1850\'s.\n\nParticular thoughts surround your last case. Mindy Croushaw who was very difficult to bring peace to. She was her Mother and Father\'s dream girl. Artistic and talented. The evidence was hard to find and the suspects, hard to identify and the richer they are, the easier it is for them to lie, and to cover up the truth.\n\nFor you, discovering the truth is an important aspect of your life and your work. Mindy\'s case nearly got you fired due to the lack of suspects for a miserable 2 years. The pay decreased and life became stingy. Your newborn; now four months old was born in the midst of the case and money is tight. \n\nYou dream of a better house. One where...\n\nThe phone in the downstairs hallway starts to ring...\n\nYour Wife sleeping beside you turns over; facing away from the bed...');

	var wife = new Character('detective_wife');

	wife.setName('your Wife');
	wife.setDescription('My beautiful darling Wife. I love her so much.');
	wife.onTalk = function() {
		return console.type('<span style=\'color: crimson\'>' + this.getName(true) + ' </span>[faint mumble]</span>\n<span style=\'color: aqua\'>Translation</span>`You go...ZzZzZz. (high-pitched fart)`');
	};
	wife.canHaveItems = false;
	wife.canSendItems = false;
	wife.canGetItems  = false;
	wife.canDescribe  = true;
	wife.canConverse  = true;

	masterbedroom.addCharacter(wife);

	var stairway = new Room('detective_stairway');

	stairway.setName('Main Stairway');

	stairway.setDescription('The phone is still ringing downstairs. A baby cries in the distance');

	stairway_ls = new Item('detective_stairway_light');
	stairway_ls.setName('light switch');
	stairway_ls.value       = false;
	stairway_ls.prefix      = 'Controls the lights. Currently ';
	stairway_ls.canUse      = true;
	stairway_ls.canPickup   = false;
	stairway_ls.canDescribe = false;
	stairway_ls.getDescription = function() {
		return this.prefix + (this.value ? 'on' : 'off');
	};
	stairway_ls.onUse = function() {
		this.value = (this.value + 1) % 2;
		return console.type('The stairway light is now ' + (this.value ? 'on' : 'off') + (this.value ? '. The light flickers for a brief few seconds. The bulb could do with a change.' : '. The place is slightly lit by the moonlight overcasting the house.')).then(() => {return true});
	};
	stairway.addItem(stairway_ls);

	var nursery = new Room('detective_nursery');
	nursery.setName('the Nursery');
	nursery.setDescription('You slowly open the door to reveal the nursery with white furniture. An slight orange glow emits from the dimmed floor lamp that overhangs a comfortable rocking chair; covered with a large blanket. Your newborn\'s sleep disrupted by the phone ringing');
	var baby = new Item('detective_baby');
	baby.setName('distressed baby');
	baby.canUse      = false;
	baby.canDescribe = true;
	baby.canPickup   = true;
	baby.canDrop     = false;
	baby.canGive     = false;
	baby.onPickup = function() {
		return console.type('You chose to comfort your distressed newborn').then(() => {return true});
	};
	// We should give Characters a role that allows child-bearing.
	// For now, however, it's easy to create a baby item to pickup
	// We will be able to 'pass' the baby by allowing the give options later
	nursery.addItem(baby);

	var frontdoor = new Room('detective_frontdoor');
	frontdoor.setName('front door');
	frontdoor.canUse = true;
	frontdoor.canPickup = false;
	frontdoor.canDrop = false;
	frontdoor.canDescribe = true;
	frontdoor.setDescription('Go outside');

	var hallway = new Room('detective_hallway');
	hallway.setName('Hallway');
	hallway.phoneConvo = false;
	hallway.getDescription = function() {
		baby.canDrop = true;
		baby.canPickup = false;
		baby.onDrop = function() {
			if (Room.getCurrentRoom() !== nursery || Room.getCurrentRoom() !== masterbedroom) {
				return console.log('You can\'t place your newborn here.').then(() => {return false});
			}
			return console.type('Your newborn is feeling better');
		};

		masterbedroom.addItem(clothes);
		hallway.addItem(frontdoor);

		frontdoor.onUse = function() {
			Room.setCurrentRoom();
		};

		return 'You go down the stairs slowly one by one in your tired state. ' + (player.hasItem(baby) ? 'You hold onto the railings forcefully' + (!stairway_ls.value ? ' but on the fifth step down you miss a step and your heart skips a beat as you wonder how you are still alive with your newborn' : ' but get down to the bottom safely') : (!stairway_ls.value ? 'You rush down the stairs eagily trying to get to the ringing phone. You end up missing the second to last step and fall quite some distance. Your heart beaten, you feel quite shaken.' : 'You rush down the stairs in a frantic panic trying to get to the phone as quick as possible. You managed to get down the stairs in a remarkable speed.')) + '\n\nYou manage to answer the phone in time.\n\n<span style=\'color: blue\'>Sergeant</span>Morning ' + player.getName() + ', I apologise for the early call but it\'s important that you come down to <i>5 Burrow Road</b> straight away<b>!!!</b>\n\n<span style=\'color: purple\'>' + player.getName() + '</span>A new case?\n\n<span style=\'blue\'>Sergeant</span>Yes, I\'m afraid so. Unfortunately you\'re going to have to deal with a rich family. It seems that people can\'t keep their hands off each other during Christmas. They\'re all in quite a lot of shock.\n\n<span style=\'purple\'>' + player.getName() + '</span>I can imagine! I\'ll come right away but you owe me!\n\n<span style=\'blue\'>Sergeant</span> <i>[Chuckles]</i> We\'ll see how you hold up...';
	};

	masterbedroom.addExit('out', stairway);
	stairway.addExit('back', masterbedroom);
	stairway.addExit('right', nursery);
	stairway.addExit('down', hallway);
	hallway.addExit('up', stairway);
	nursery.addExit('out', stairway);

	var outside = new Room('outside');
	outside.setName('Front Yard');
	outside.setDescription('The winterery weather hits you as soon as you close the door. Everything is dark and a couple lampposts partially light up the foggy street.');


	// Scene 1 - Go to house - everyone in distress, find every bit of evidence
/*
	var fy = new Room('front_yard');

	fy.setName('Front Garden');

	fy.description = 'Everyone is standing outside. It\'s cold outside. People are wearing party clothes; not the suitable type for a cold winters night.';

	masterbedroom.addExit('random', fy);*/

	return console.startTextualEnvironment();

}());
