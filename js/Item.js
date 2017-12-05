(function() {
	let i = 0;

	var explainAction = function(text) {
		return console.type(text, 1.5, false, false).then(() => {
			return new Promise(function(resolve, reject) {
				setTimeout(() => resolve(), 1500);
			}); 
		});
	};

	function Item(id) {
		let _id          = id || 'Item#' + (++i);
		let name         = '';
		let plural       = false;
		let callable     = null;
		let belongsTo    = false;
		let description  = '';

		this.canUse       = true;
		this.canDescribe  = true;
		this.canDrop      = true;
		this.canPickup    = true;
		this.canGive      = false;

		this.onUse        = null;
		this.onDrop       = null;
		this.onGive       = null;
		this.onPickup     = null;
		this.onDescribe   = null;
		
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

		this.setBelonging = function(character) {
			if (
				character === null ||
				(character !== undefined &&
				character.constructor.name === 'Character')
			) {
				belongsTo = character;
				return true;
			}
			return false;
		};

		this.getBelonging = function(character) {
			return belongsTo;
		};

		this.setPlural = function(val) {
			if (
				val !== undefined &&
				val !== null &&
				(val.constructor.name == 'String' || val.constructor.name == 'Number' || val.constructor.name == 'Boolean')
			) {
				plural = val;
				return true;
			}
			return false;
		};
		
		this.getPlural = function() {
			return plural;
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

		this.use = function(against) {
			if (!this.canUse) {
				return explainAction('Sorry but you can\'t do that!');
			}
			var standard = function() {
				return explainAction('Nothing happened.');
			}
			var func = null;
			if (this.onUse && this.onUse.constructor.name == 'Function') {
				func = this.onUse.apply(this, [this, against]);
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
		};

		this.drop = function() {
			console.log(this.getName());
			if (!this.canDrop) {
				return explainAction('Sorry but you can\'t do that!');
			}
			var standard = function() {
				var player = Character.prototype.getPlayer();
				var room = Room.prototype.getCurrentRoom();
				if (room) {
					var item = player.removeItem(this);
					console.log(item.getName());
					room.addItem(item);
				}
				return Promise.resolve();
			};

			var func = null;

			if (this.onDrop && this.onDrop.constructor.name == 'Function') {
				func = this.onDrop.apply(this, [this]);
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
		};

		this.pickup = function() {
			if (!this.canPickup) {
				return explainAction('Sorry but you can\'t do that!');
			}
			var standard = function() {
				var player = Character.prototype.getPlayer();
				var room = Room.prototype.getCurrentRoom();
				if (room) {
					player.addItem(room.removeItem(this));
				}
				return Promise.resolve();
			};

			var func = null;

			if (this.onPickup && this.onPickup.constructor.name == 'Function') {
				func = this.onPickup.apply(this, [this]);
			}

			if (func && func.constructor.name == 'Promise') {
				return func.then((value) => {
					if (value === false) {
						return;
					}
					return standard.apply(this, [this]);
					
				});
			} else if (func !== false) {
				return standard.apply(this, [this]);
			}
		};

		this.give = function(character) {
			if (!this.canGive) {
				return explainAction('Sorry but you can\'t do that!');
			}
			var standard = function() {
				var player = Character.prototype.getPlayer();
				if (character !== player) {
					var room = Room.prototype.getCurrentRoom();
					if (room && room.hasCharacter(character)) {
						character.addItem(player.removeItem(this));
						return Promise.resolve();
					} else if (room.isValidCharacter(character)) {
						return explainAction(character.getName() + ' is not presently available to give your ' + item.getName() + ' to.');
					} else {
						return explainAction('Your ' + item.getName() + ' can\'t be given to this person');
					}
				} else {
					return explainAction('You can\'t give an item to yourself');
				}
			};

			var func = null;

			if (this.onPickup && this.onPickup.constructor.name == 'Function') {
				func = this.onPickup.apply(this, [this]);
			}

			if (func && func.constructor.name == 'Promise') {
				return func.then((value) => {
					if (value === false) {
						return promise.resolve();
					}
					return standard.apply(this, [this]);
					
				});
			} else if (func !== false) {
				return standard.apply(this, [this]);
			}
		};
	}
	return Item;
}());