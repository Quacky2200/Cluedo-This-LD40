(function() {
	let i = 0;

	var explainAction = function(text) {
		return console.type(text, 1.5, false, false).then(() => {
			return new Promise(function(resolve, reject) {
				setTimeout(() => resolve(), 1500);
			}); 
		});
	};
	
	function Character(id) {
		let _id          = id || 'Character#' + (++i);
		let name         = '';
		let gender       = 'neutral';
		let description  = '';
		let inventory    = [];
		//let conversation = null;

		// 3 properties below are not properly implemented yet.
		let canHaveItems = true; 
		let canSendItems = true;
		let canGetItems  = true;

		this.canDescribe  = true;
		this.canConverse  = true;

		this.onTalk      = null;
		this.onDescribe  = null;

		this.setName = function(val) {
			if (val !== '' && name !== val) {
				name = val;
				return true;
			}
			return false;
		};

		this.getName = function(impersonal) {
			if (impersonal) {
				return name.replace(/(my |your )/i, '');
			}
			return name;
		};

		this.setDescription = function(val) {
			if (description !== val) {
				description = val;
			}
			return true;
		};

		this.setGender = function(val) {
			if (val && val.constructor.name == 'String') {
				switch (val.toLowerCase()) {
					case 'male':
					case 'boy':
					case 'men':
					case 'he':
					case 'him':
					case 'guy':
					case 'bloke':
					case 'chap':
					case 'fellow':
					case 'macho':
					case 'stud':
					case 'gentleman':
					case 'father':
					case 'brother':
					case 'nephew':
					case 'uncle':
					case 'king':
					case 'prince':
					case 'xy':
						gender = 'male';
						break;
					case 'woman':
					case 'girl':
					case 'women':
					case 'she':
					case 'her':
					case 'gal':
					case 'lady':
					case 'lassie':
					case 'honey':
					case 'miss':
					case 'mrs':
					case 'maid':
					case 'chick':
					case 'dame':
					case 'mother':
					case 'sister':
					case 'niece':
					case 'queen':
					case 'princess':
					case 'xx':
						gender = 'female';
						break;
					default:
						gender = 'neutral';
				}
				return true;
			}
			return false;
		};

		this.getGender = function() {
			return gender;
		};

		this.getDescription = function() {
			return description;
		};

		this.getID = function() {
			return _id;
		};

		this.setID = function(val) {
			if (val && (val.constructor.name == 'String' || val.constructor.name == 'Number') && val !== '') {
				_id = val;
				return true;
			}
			return false;
		};

		this.isValidItem = function(item) {
			return (
				item !== undefined &&
				item !== null &&
				item.constructor.name == Item.prototype.constructor.name
			);
		};

		this.hasItemByID = function(item_id) {
			return this.getItemByID(item_id) !== null;
		};

		this.hasItem = function(item) {
			return this.isValidItem(item) && inventory.indexOf(item) > -1;
		};

		this.getItemByID = function(item_id) {
			for (i in inventory) {
				if (inventory[i] && inventory[i].getID() == item_id) {
					return inventory[i];
				}
			}
			return null;
		};

		this.addItem = function(item) {
			if (this.isValidItem(item) && !this.hasItem(item)) {
				inventory.push(item);
				return true;
			}
			return false;
		};

		this.removeItem = function(item) {
			if (this.isValidItem(item) && this.hasItem(item)) {
				var index = inventory.indexOf(item);
				var item = inventory[index];
				delete inventory[index];
				return item;
			}
			return null;
		};

		this.getItems = function(item) {
			return Array.prototype.slice.call(inventory);
		};

		this.removeItemByItemID = function(item_id) {
			for (var i = inventory.length; i > -1; i--) {
				if (inventory[i].getID() === item_id) {
					var item = inventory[i];
					delete inventory[i];
					return item;
				}
			}
			return null;
		};

		this.updateItem = function(item_old, item_new) {
			if (this.isValidItem(item_old) && this.isValidItem(item_new)) {
				return this.updateItemWithItemID(item_old.getID(), item_new);
			}
			return false;
		};

		this.updateItemWithItemID = function(item_id, item) {
			for (var i = inventory.length; i > -1; i--) {
				if (inventory[i].getID() === item_id) {
					inventory[i] = item;
					return true;
				}
			}
			return false;
		};

		this.giveItem = function(character, item) {
			if (
				item &&
				this.isValidItem(item) &&
				character &&
				character.constructor.name == this.constructor.name
			) {
				return this.giveItemByID(character, item.getID());
			}
			return false;
		};

		this.giveItemByID = function(character, item_id) {
			if (
				item_id &&
				character.constructor.name == this.constructor.name &&
				(item_id.constructor.name == 'String' || item_id.constructor.name == 'Number') &&
				this.hasItemByID(item_id)
			) {
				var item = this.getItemByID(item_id);
				character.addItem(item);
				this.removeItem(item);
				return true;
			}
			return false;
		};

		/*this.setConversation = function(value) {
			conversation = value;
		}

		this.getConversation = function() {
			return conversation;
		}

		this.emptyConversation = function() {
			conversation = null;
		}*/
		this.talk = function(character) {
			if (!this.canConverse) {
				return console.log(this.getName() + ' can\'t talk with you at this time.');
			}
		};

		this.describe = function() {
			if (!this.canDescribe) {
				return explainAction('Sorry but you can\'t do that!');
			}
			var standard = function() {
				// Match simple things such as Wow!, Amazing?, Missing!??, or Missing in action
				if (this.canDescribe && this.getDescription().match(/([\w\!\?\£\$\%]+|(\w+[\W ]+){2,})/)) {
					return explainAction(this.getDescription());
				} else {
					return explainAction('Nothing very interesting');
				}
			};

			var func = null;

			if (this.onDescribe && this.onDescribe.constructor.name == 'Function') {
				func = this.onDescribe(this);
			}

			if (func && func.constructor.name == 'Promise') {
				return func.then((value) => {
					if (value === false) {
						return Promise.resolve();
					}
					return standard.apply(this, [this]);
					
				});
			} else if (func !== false) {
				return standard.apply(this, [this]);
			}
		}
	}
	
	let player = new Character('Player#1');
	Character.getPlayer = function() {
		return player;
	}
	Character.prototype.getPlayer = function() {
		return player;
	};


	return Character;
}());
