(function() {

	let i = 0;
	let currentRoom = null;
	let rooms = [];

	function Room(id) {
		let _id          = id || 'Room#' + (++i);
		let name         = '';
		let description  = '';
		let items        = [];
		let exits        = {};
		let characters   = [];

		Room.prototype.addRoom(this);

		this.isEnabled = true;
		this.allowExit = true;

		this.setName = function(val) {
			if (val !== '' && name !== val) {
				name = val;
				return true;
			}
			return false;
		};

		this.getName = function() {
			return name;
		};

		this.setDescription = function(val) {
			if (description !== val) {
				description = val;
			}
			return true;
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
				item.constructor.name === Item.prototype.constructor.name
			);
		};

		this.hasItemByID = function(item_id) {
			return this.getItemByID(item_id) !== null;
		};

		this.hasItem = function(item) {
			return this.isValidItem(item) && items.indexOf(item) > -1;
		};

		this.getItems = function() {
			return Array.prototype.slice.call(items);
		}

		this.getItemByID = function(item_id) {
			for (i in items) {
				if (items[i] && items[i].getID() == item_id) {
					return items[i];
				}
			}
			return null;
		};

		this.addItem = function(item) {
			if (this.isValidItem(item) && !this.hasItem(item)) {
				items.push(item);
				return true;
			}
			return false;
		};

		this.removeItem = function(item) {
			if (this.isValidItem(item) && this.hasItem(item)) {
				var index = items.indexOf(item);
				var item = items[index];
				delete items[index];
				return item;
			}
			return false;
		};

		this.removeItemByItemID = function(item_id) {
			for (i in items) {
				if (items[i].getID() === item_id) {
					return items.pop(items[i]);
				}
			}
			return false;
		};

		this.updateItem = function(item_old, item_new) {
			if (this.isValidItem(item_old) && this.isValidItem(item_new)) {
				return this.updateItemWithItemID(item_old.getID(), item_new);
			}
			return false;
		};

		this.updateItemWithItemID = function(item_id, item) {
			for (var i = items.length; i > -1; i--) {
				if (items[i].getID() === item_id) {
					items[i] = item;
					return true;
				}
			}
			return false;
		};

		this.pickupItem = function(character, item) {
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

		this.pickupItemByID = function(character, item_id) {
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

		this.getCharacters = function() {
			return characters;
		};

		this.addCharacter = function(character) {
			if (this.isValidCharacter(character) && !this.hasCharacter(character)) {
				characters.push(character);
				return true;
			}
			return false;
		};

		this.removeCharacter = function(character) {
			if (this.isValidCharacter && this.hasCharacter(character)) {
				for (var item in characters) {
					if (characters[item] === character) {
						delete characters[item];
						return true;
					}
				}
			}
			return false;
		};

		this.getCharacterByID = function(character_name) {
			for (var item in characters) {
				if (characters[item].getName() === character_name) {
					return characters[item];
				}
			}
			return null;
		};

		this.hasCharacter = function(character) {
			if (this.isValidCharacter(character)) {
				return this.getCharacterByID(character.getID()) !== null;
			}
		};

		this.isValidCharacter = function(character) {
			return (
				character !== undefined &&
				character !== null &&
				character.constructor.name == 'Character' &&
				character.getID !== undefined && 
				character.getID.constructor.name == 'Function' &&
				character.getID() != undefined
			);
		};

		this.hasExit = function(direction) {
			return (
				direction !== undefined &&
				direction !== null &&
				direction !== '' &&
				direction.constructor.name == 'String' &&
				exits !== undefined &&
				exits !== null &&
				Object.keys(exits).indexOf(direction) !== -1
			)
		}

		this.addExit = function(direction, room) {
			inspector.log(direction, room);
			if (!this.hasExit(direction)) {
				exits[direction] = room;
				inspector.log(exits);
				return true;
			}
			return false;
		};

		this.removeExit = function(direction) {
			if (this.hasExit(direction)) {
				delete exits[direction];
				return true;
			}
			return false;
		};

		this.getExits = function() {
			return exits;
		};

		this.destroy = function() {
			// TODO: Add more destructive functionality
			Room.prototype.removeRoom(this);
		};
	}

	Room.getCurrentRoom = function() {
		return currentRoom;
	}

	Room.prototype.getCurrentRoom = function() {
		return currentRoom;
	};

	Room.setCurrentRoom = function(room) {
		if (
			room !== undefined &&
			room !== null &&
			room.constructor.name === 'Room'
		) {
			currentRoom = room;
			return true;
		}
		return false;
	}

	Room.prototype.setCurrentRoom = function(room) {
		if (
			room !== undefined &&
			room !== null &&
			room.constructor.name === 'Room'
		) {
			currentRoom = room;
			return true;
		}
		return false;
	};

	Room.addRoom = function(room) {
		rooms.push(room);
	};

	Room.removeRoom = function(room) {
		rooms.pop(room);
	};

	Room.prototype.addRoom = function(room) {
		rooms.push(room);
	};

	Room.prototype.removeRoom = function(room) {
		rooms.pop(room);
	};

	Room.prototype.getRooms = function() {
		return rooms;
	};

	return Room;
}());
