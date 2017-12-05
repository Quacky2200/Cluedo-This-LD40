(function () {
  'use Strict';

  String.prototype.hasStrAt = function(str, i) {
    buildstr = '';
    var len = i + str.length;
    for (x = i; x < len; x += 1) {
      char = this.charAt(x);
      if (char !== undefined && char !== undefined && char !== '') {
        buildstr += char;
      } else {
        return false;
      }
    }
    return buildstr == str;
  };

  String.prototype.htmlEntities = function() {
    return this.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  };


  var fxpath = 'media/soundFX/keys/%s.mp3';
  var music = document.createElement('audio');
  var sounds = [];
  var soundVolume = 0.5;
  var musicVolume = 0.95;


  console = {
    preloadAudio: function(sounds) {
      var loaded = 0;
      return new Promise(function(resolve, reject) {
        var readyUp = function() {
          loaded++;
          if (loaded == sounds.length) {
            resolve();
          }
        };
        /*a.onloadeddata = function() {
          if (a.readyState == 4) {
            readyUp();
          }
        }*/
        var errorFn = function() {
            reject(new Error('\'' + this.src + '\' could not be preloaded'));
        };
        var count = Object.keys(sounds).length;
        for(i = 0; i < count; i +=1) {
          a = new Audio();
          a.onerror = errorFn;
          a.oncanplaythrough = readyUp;
          a.src = sounds[i];
        }
      });
    },
    playSound: function(sound) {
      // No need to add to DOM as it will still play without
      var snd = document.createElement('audio');
      sounds.push(snd);
      // Always remove sound effects in-case of spam
      snd.onended = function() {
        for (i = sounds.length - 1; i > -1; i -= 1) {
          if (sounds[i] === this) {
            sounds[i].remove();
            delete sounds[i];
            return;
          }
        }
      };
      snd.setAttribute('preload', 'none');
      snd.setAttribute('autoplay', true);
      snd.volume = soundVolume;
      snd.setAttribute('src', sound);
    },
    playMusic: function(file, loop) {
      loop = loop !== undefined ? (loop ? true : false) : true;
      // Level/Story music should always be looped to avoid silence.
      music.setAttribute('autoplay', true);
      music.onended = null;
      music.volume = musicVolume;
      music.setAttribute('src', file);
      music.loop = loop;
    },
    setMusicVolume: function(level) {
      musicVolume = Math.min(Math.max(level, 0), 1);
      music.volume = musicVolume;
    },
    getMusicVolume: function() {
      return musicVolume;
    },
    setSoundVolume: function(level) {
      sndVolume = Math.min(Math.max(level, 0), 1);
      var count = Object.keys(sounds).length();
      for (i = 0; i < count; i += 1) {
        sounds[i].volume = sndVolume;
      }
    },
    getSoundVolume: function() {
      return sndVolume;
    },
    stopMusic: function(toBeginning) {
      music.pause();
      if (toBeginning === true) {
        music.currentTime = 0;
      }
    },
    stopSounds: function() {
      var count = Object.keys(sounds).length();
      for (i = 0; i < count; i += 1) {
        sounds[i].pause();
        sounds[i].remove();
        delete sounds[i];
      }
    },
    setTitle: function(title) {
      document.title = title;
    },
    clear: function() {
      var b = document.body;
      while (b.firstChild) {
        b.removeChild(b.firstChild);
      }
      return new Promise(function(resolve, reject) {resolve();});
    },
    debug: function(...args) {
      // Print information to the screen in red
      var p = document.createElement('pre');
      p.style.color = 'red';
      p.innerText = args.join(' ');
      document.body.appendChild(p);
      scrollTo(p);
      return new Promise(function(resolve, reject) {resolve(p);});
    },
    error: function(...args) {
      // Print information to the screen in red
      var p = document.createElement('pre');
      p.style.color = 'red';
      p.innerText = args.join(' ');
      document.body.appendChild(p);
      scrollTo(p);
      return new Promise(function(resolve, reject) {resolve(p);});
    },
    print: function(text) {
      // Print to the screen
      var p = document.createElement('pre');
      p.innerText = text;
      document.body.appendChild(p);
      scrollTo(p);
      return new Promise(function(resolve, reject) {resolve(p);});
    },
    log: function(...args) {
      // Print all arguments to the screen (similar to console.log('hello', 'world'))
      var p = document.createElement('pre');
      p.innerText = args.join(' ');
      document.body.appendChild(p);
      scrollTo(p);
      return new Promise(function(resolve, reject) {resolve(p);});
    },
    type2: function(text, speed, canSkip, continueOnSkip) {
      speed = (speed !== undefined ? speed : 1);
      canSkip = (canSkip !== undefined ? canSkip : true);
      continueOnSkip = (continueOnSkip !== undefined ? continueOnSkip : false);

      var pre = document.createElement('pre');
      document.body.appendChild(pre);
      var elementStack = [];


      for (i = 0; i < text.length; i += 1) {
        char = text.charAt(i);
        char2 = text.charAt(i+1);

      }

    },
    type: function(text, speed, canSkip, continueOnSkip) {
      // Who doesn't love a typewriter?
      speed = (speed !== undefined ? speed : 1);
      canSkip = (canSkip !== undefined ? canSkip : true);
      continueOnSkip = (continueOnSkip !== undefined ? continueOnSkip : false);
      return new Promise(function(resolve, reject) {
        var p = document.createElement('pre');
        document.body.appendChild(p);

        var currentChar = -1;
        //var allChars = '';
        var exit = false;
        var elements = [];

        var charSpeed = (0.025 / speed);
        var punctSpeed = charSpeed * 20;
        var charFinalSpeed = charSpeed;
        var charExhaustionSpeed = punctSpeed / 1000;
        var waitParagraph = 1000;
        var punctuation = [',','?', '!', ';', '\n'];

        if (canSkip) {
          var skip = document.createElement('pre');
          skip.innerText = '[Enter] Skip';
          skip.style.position = 'absolute';
          skip.style.top = '0px';
          skip.style.right = '0px';
          skip.style.display = 'inline-block';
          skip.style.background = 'rgba(0, 0, 0, 0.5)';
          skip.style.padding = '10px';
          skip.style.margin = '0';
          skip.setAttribute('class', 'commandline');
          document.body.appendChild(skip);

          window.onkeypress = function(e) {
            switch (e.key) {
              case 'Enter':
              case 'Escape':
                exit = true;
                skip.remove();
                window.onkeypress = null;
                break;
            }
          };
        }

        var promise = promiseWhile(
          function() {
            return new Promise(function(resolve, reject) {
              currentChar++;
              if (exit || currentChar >= text.length) {
                if (canSkip) {
                  skip.remove();
                }
                resolve();
              } else {
                reject();
              }
            });
          },
          function() {
            return new Promise(function(resolve, reject) {
              function getCChar(i) {
                // Get current char at position i
                return (currentChar + i) >= text.length ? '' : text.charAt(currentChar + i);
              }
              var char = getCChar(0);
              var nextChar = getCChar(1);
              var currentElement = (elements.length > 0 ? elements[elements.length - 1] : null);
              // Example: This is an <b style='color: red' class='test'>IMPORTANT</b> test.
              if ((char == '<' && nextChar.match(/[a-z]/i)) || char == '<' && nextChar == '/') {
                // Start or end of element (e.g. <a or </)
                var elbuffer = char;
                var hasStarted = nextChar !== '/';

                while (nextChar !== ">") {
                  currentChar += 1;
                  char = getCChar(0);
                  nextChar = getCChar(1);
                  elbuffer += char;
                }
                elbuffer += nextChar;
                currentChar++;

                if (hasStarted) {
                  var s = document.createElement('span');
                  s.style.display = 'inline-block';
                  s.innerHTML = elbuffer + '</' + elbuffer.match(/<([a-z]+)[\ >]/)[1] + '>';
                  s = s.firstChild;
                  s.setAttribute('alt-data', 'animate');
                  if (elements.length > 0) {
                    elements[elements.length - 1].appendChild(s);
                  } else {
                    p.appendChild(s);
                  }
                  elements.push(s);
                } else {
                  currentElement = elements.pop();
                  currentElement.setAttribute('alt-data', null);
                }

              } else if (currentElement) {
                var isFormatted = currentElement.nodeName.toLowerCase() == 'b' || currentElement.nodeName.toLowerCase() == 'i';
                if (isFormatted) {
                  s = document.createElement('span');
                  s.append(char);
                  currentElement.appendChild(s);
                } else {
                  currentElement.append(char);
                }
                //allChars += '<span>' + char + '</span>';
              } else {
                p.append(char);
              }

              scrollTo(p);

              if ((punctuation.indexOf(char) > -1 && [' ', '\n'].indexOf(nextChar) > -1) || char == '.') {

                console.playSound(fxpath.replace('%s', genChars(1, 'fp')));
                charFinalSpeed = charSpeed;
                setTimeout(function() { resolve(); }, punctSpeed * 1000);
              } else {
                console.playSound(fxpath.replace('%s', genChars(1, 'abcdefghp')));
                charFinalSpeed += charExhaustionSpeed;
                // Formatted strings are animated (bold and italic and need more time to display due to animation)
                var isFormatted = (
                  currentElement &&
                  (currentElement.nodeName.toLowerCase() == 'b' || 
                  currentElement.nodeName.toLowerCase() == 'i')
                );
                setTimeout(function() {resolve();}, charFinalSpeed * (isFormatted ? 2500 : 1000));
              }
            });
          }
        );
        promise.then(function() {
          if (exit && canSkip) {
            /*
             * On adrupt exit...
             * Spit out all text
             */
            p.innerHTML = text;
            scrollTo(p);
            // Show confirmation to continue if we ask for it
            if (exit && !continueOnSkip) {
              console.getInput('[Enter] Continue...').then(function() {
                resolve([p, exit]);
              });
              return;
            }
          }
          setTimeout(function() {resolve([p, exit]);}, 500);
        });
      });
    },
    getInput: function(prefix, suggestions, regexCheck, regexFailMsg) {
      prefix = prefix !== undefined ? prefix : '> ';
      regexFailMsg = regexFailMsg !== undefined ? regexFailMsg : 'Input not accepted. Please try again.';
      // Ask for input and return it
      return new Promise(function(resolve, reject) {
        var cursor = '<span class=\'cursor\' style=\'display: inline-block; width: 0.4em; margin: 0 -0.20em;\'>|</span>';
        var cursorPosition = 0;
        var buffer = '';
        var p = document.createElement('pre');
        document.body.appendChild(p);
        var drawInput = function() {
          if (!document.contains(p)) {
            document.body.appendChild(p);
          }
          p.innerHTML = prefix + buffer.substring(0, cursorPosition).htmlEntities() + cursor + buffer.substring(cursorPosition, buffer.length).htmlEntities();
          scrollTo(p);
        }
        drawInput();
        var lastKeyDown = null;
        var lastKey = null;
        var key = null;

        var playTap = function() {
          var now = (new Date()).getTime();
          var difference = (now - lastKeyDown);
          var played = false;
          if (!(difference < 45 && lastKey == key) || lastKey !== key) {
            played = true;
            console.playSound(fxpath.replace('%s', genChars(1, 'fp')));
          }
          lastKeyDown = now;
          return played;
        };
        var playBackspace = function() {
          var now = (new Date()).getTime();
          var difference = (now - lastKeyDown);
          var played = false;
          if (!(difference < 45 && lastKey == key) || lastKey !== key) {
            played = true;
            console.playSound(fxpath.replace('%s', 'c' + genChars(1, '1234567')));
          }
          lastKeyDown = now;
          return played;
        }
        var showSuggestions = function() {
          if (buffer.length === 0) {
            return;
          }
          var filter = [];
          for (s in suggestions) {
            if (suggestions[s].indexOf(buffer) > -1) {
              filter.push(suggestions[s]);
            }
          }
          if (filter.length == 1) {
            buffer = filter[0];
            cursorPosition = buffer.length;
            drawInput();
          } else if (filter.length > 1) {
            var s = document.createElement('pre');
            s.innerHTML = filter.join(', ');
            document.body.insertBefore(s, p);
          }
        };
        window.onkeydown = function(e) {
          key = e.key;
          lastKey = key;
          if (key.match(/^[\w\W]{1}$/) && !e.ctrlKey) {
            // Normal key press (characters)
            playTap();
            cursorPosition++;
            buffer = buffer.substring(0, cursorPosition - 1) + key + buffer.substring(cursorPosition - 1, buffer.length);
            drawInput();
          } else if (key.match(/^[\w\W]{1}$/) && e.ctrlKey && key !== 'R') {
            if (key == 'Space') {
              // Tab is not always usable. Ctrl-Space alternative
              showSuggestions();
            } else {
              console.error('This is not a terminal').then(function(p) {
                setTimeout(function() { p.remove(); }, 2500);
              });
              e.preventDefault();
              return false;
            }
          } else {
            switch (key) {
              case 'Enter':
                playTap();
                //window.onkeyup = null;
                if (
                  regexCheck !== undefined &&
                  regexCheck !== null &&
                  !buffer.match(regexCheck)
                ) {
                  oldcursor = cursor;
                  cursor = '';
                  drawInput();
                  cursor = oldcursor;
                  delete this.oldcursor;
                  error = document.createElement('pre');
                  error.innerHTML = regexFailMsg;
                  document.body.appendChild(error);
                  p = document.createElement('pre');
                  document.body.appendChild(p);
                  buffer = '';
                  drawInput();
                } else {
                  window.onkeydown = null;
                  cursor = '';
                  drawInput();
                  resolve(buffer);
                }
                break;
              case 'Backspace':
                buffer = buffer.substring(0, Math.max(cursorPosition - 1), 0) + buffer.substring(cursorPosition, buffer.length);
                if (buffer === '') {
                  playBackspace();
                } else {
                  playTap();
                }
                cursorPosition = Math.max(cursorPosition - 1, 0);
                drawInput();
                e.preventDefault();
                return false;
              case 'Tab':
                playTap();
                showSuggestions();
                e.preventDefault();
                return false;
                break;
              case 'ArrowLeft':
                playTap();
                cursorPosition = Math.max(cursorPosition - 1, 0);
                drawInput();
                break;
              case 'ArrowRight':
                playTap();
                cursorPosition = Math.min(cursorPosition + 1, buffer.length);
                drawInput();
                break;
            }
          }
        };
      });
    },
    normalizeInput: function(input) {
      // List of "unimportant" words (feel free to add more)
      var skip_words = [
        'a', 'about', 'all', 'an', 'another', 'any', 'around', 'at',
        'bad', 'beautiful', 'been', 'better', 'big', 'can', 'every', 'for',
        'from', 'good', 'have', 'her', 'here', 'hers', 'his', 'how',
        'i', 'if', 'in', 'into', 'is', 'it', 'its', 'large', 'later',
        'like', 'little', 'main', 'me', 'mine', 'more', 'my', 'now',
        'of', 'off', 'oh', 'on', 'please', 'small', 'some', 'soon',
        'that', 'the', 'then', 'this', 'those', 'through', 'till', 'to',
        'towards', 'until', 'us', 'want', 'we', 'what', 'when', 'why',
        'wish', 'with', 'would'
      ];

      var no_punct = input.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, '').toLowerCase();
      var normalized = '';
      var split = no_punct.split(' ');
      for (index in split) {
        if (skip_words.indexOf(split[index]) === -1) {
          normalized += split[index] + ' ';
        }
      }
      return normalized.trim(' ');
    },
    explainSituation: function(typewriter, includeRoomDescription, finishText) {
      var room = Room.prototype.getCurrentRoom();
      var player = Character.prototype.getPlayer();

      typewriter = (typewriter === true ? true : false);
      includeRoomDescription = (includeRoomDescription === true ? true : false);

      if (!(
        finishText !== undefined &&
        finishText !== null &&
        finishText.constructor.name === String &&
        finishText !== ''
      )) {
        finishText = 'That\'s all folks!';
      }

      var func;
      var roomName = room.getName();
      var padding = ''.padStart(roomName.length + 2, '=');
      roomName = `${padding}\n ${roomName} \n${padding}`;

      if (typewriter === true) {
        func = console.type(roomName, 1, true, true);
      } else {
        func = console.type(roomName, 1e10, true, true);
      }
      
      return func.then(function(values) {
        var shouldType = values && values.constructor.name == 'Array' && values[1] === false;
        if (shouldType && includeRoomDescription) {
          return console.type(room.getDescription(), 1, true, true);
        } else if (includeRoomDescription) {
          return console.type(room.getDescription(), 1e10, true, true);
        }
      }).then(function(values) {
        // List inventory
        var shouldType = values && values.constructor.name == 'Array' && values[1] === false;
        inventory = player.getItems();
        var text = (inventory.length > 0 ? 'You have' : undefined);
        for (i in inventory) {
          var item = inventory[i];
          var plural = item.getPlural();
          var last = (i == (inventory.length - 1));
          var first = (i == 0);
          text += (first ? '' : (last ? ' and' : ',')) + ' ' + (plural ? 'some' : 'a') + ' ' + item.getName();
        }
        if (shouldType && text !== undefined) {
          return console.type(text, 1, true, true);
        } else if (!shouldType && text !== undefined) {
          return console.log(text);
        }
      }).then(function(values) {
        var shouldType = values && values.constructor.name == 'Array' && values[1] === false;
        roomItems = room.getItems();
        inventory = player.getItems();
        exits = room.getExits();

        if (roomItems.length == 0 && inventory.length == 0 && exits.length == 0) {
          if (shouldType) {
            return console.type(finishText, 0.75, false, false);
          } else {
            return console.log(finishText);
          }
        } else {
          var text = 'You can: \n';
          if (!includeRoomDescription) {
            text += 'REPEAT AGAIN to repeat the description\n';
          }
          for (direction in exits) {
            exit = exits[direction];
            text += 'GO ' + direction.toUpperCase() + ' to ' + exit.getName() + '\n';
          }
          for (i in inventory) {
            item = inventory[i];
            itemName = item.getName().toUpperCase().replace(' ', '-');
            if (item.canUse) {
              text += 'USE ' + itemName + ' to use your ' + item.getName() + '\n';
            }
            if (item.canDrop) {
              text += 'DROP ' + itemName + ' to drop your ' + item.getName() + '\n';
            }
            if (item.canDescribe) {
              text += 'DESCRIBE ' + itemName + ' to describe your ' + item.getName() + '\n';
            }
            if (item.canGive) {
              text += 'GIVE ' + itemName + ' to give your ' + item.getName() + ' to someone else\n';
            }
          }
          for (i in roomItems) {
            item = roomItems[i];
            itemName = item.getName().toUpperCase().replace(' ', '');
            if (item.canUse) {
              text += 'USE ' + itemName + ' to use the ' + item.getName() + '\n';
            }
            if (item.canPickup) {
              text += 'PICKUP ' + itemName + ' to pick up the ' + item.getName() + '\n';
            }
            if (item.canDescribe) {
              text += 'DESCRIBE ' + itemName + ' to describe the ' + item.getName() + '\n';
            }
          }
          var characters = room.getCharacters();
          for (i in characters) {
            characterName = characters[i].getName(true).split(' ')[0].toUpperCase();
            if (characters[i].canConverse) {
              text += 'TALK TO ' + characterName + ' to talk to ' + characters[i].getName() + '\n';
            }
            if (characters[i].canDescribe) {
              text += 'DESCRIBE ' + characterName + ' to describe ' + characters[i].getName() + '\n';
            }
          }
          if (shouldType) {
            return console.type(text, 2, true, true);
          } else {
            return console.log(text);
          }
        }
      });
    },
    startTextualEnvironment: function() {
      var lastRoom = Room.prototype.getCurrentRoom();

      var mainLoop = function() {
        return console.getInput().then(function(text) {
          return console.normalizeInput(text);
        }).then(function(text) {
          text = text.toLowerCase();
          var explainAction = function(text) {
            return console.type(text, 1.75, false, false).then(() => {
              return new Promise(function(resolve, reject) {
                setTimeout(() => resolve(), 500);
              }); 
            });
          };
          var args = text.toLowerCase().split(' ');
          var action = args[0];
          var player = Character.prototype.getPlayer();
          var room = Room.getCurrentRoom();
          switch(action) {
            case 'go':
              if (args.length > 1) {
                exits = room.getExits();
                for (direction in exits) {
                  if (text.toLowerCase().indexOf(direction) > -1) {
                    Room.prototype.setCurrentRoom(exits[direction]);
                  }
                }
              }
              break;
            case 'repeat':
              return true;
            case 'describe':
              if (args.length == 2) {
                var items = player.getItems();
                for (i in items) {
                  itemName = items[i].getName().toLowerCase().replace('', '');
                  if (itemName == args[1]) {
                    return items[i].describe();
                  }
                }
                items = room.getItems();
                for (i in items) {
                  itemName = items[i].getName().toLowerCase().replace('', '');
                  if (itemName == args[1]) {
                    return items[i].describe();
                  }
                }
                var characters = room.getCharacters();
                for (i in characters) {
                  characterName = characters[i].getName(true).split(' ')[0].toLowerCase();
                  if (args[1] == characterName) {
                    return characters[i].describe();
                  }
                }
                return explainAction('I don\'t know how to describe that.')
              } else {
                return explainAction('Describe what?');
              }
            case 'pickup':
              if (args.length == 2) {
                items = room.getItems();
                for (i in items) {
                  itemName = items[i].getName().toLowerCase().replace(' ', '');
                  if (itemName == args[1]) {
                    return items[i].pickup();
                  }
                }
                return explainAction('I don\'t know if I can pickup that.');
              } else {
                return explainAction('Pickup what?');
              }
            case 'use':
              if (args.length == 2) {
                var items = player.getItems();
                for (i in items) {
                  itemName = items[i].getName().toLowerCase().replace(' ', '');
                  if (itemName == args[1]) {
                    return items[i].use();
                  }
                }
                items = room.getItems();
                for (i in items) {
                  itemName = items[i].getName().toLowerCase().replace(' ', '');
                  if (itemName == args[1] && !items[i].canPickup && items[i].canUse) {
                    return items[i].use();
                  }
                }
                return explainAction('I don\'t know how to use that');
              } else {
                return explainAction('Use what?');
              }
            case 'drop':
              if (args.length == 2) {
                var items = player.getItems();
                for (i in items) {
                  itemName = items[i].getName().toLowerCase().replace(' ', '');
                  if (itemName == args[1]) {
                    return items[i].drop();
                    break;
                  }
                }
                return explainAction('I don\'t know if I can drop that.');
              } else {
                return explainAction('Drop what?');
              }
            case 'give':
              if (args.length == 2) {
                var items = player.getItems();
                for (i in items) {
                  itemName = items[i].getName().toLowerCase().replace(' ', '');
                  if (itemName == args[1]) {
                    return items[i].give();
                  }
                }
                return explainAction('I don\'t know if I can give that.');
              } else {
                return explainAction('Give what?');
              }
            case 'talk':
              if (args.length == 2) {
                var characters = room.getCharacters();
                for (i in characters) {
                  characterName = characters[i].getName(true).split(' ')[0].toLowerCase();
                  if (args[1] == characterName) {
                    return characters[i].talk();
                  } 
                }
                return explainAction('I don\'t know if I can talk to that');
              } else {
                return explainAction('Talk to who?');
              }
            default:
              return explainAction('Huh? This makes no sense.');
          }
        }).then(function(refreshState) {
          if (lastRoom !== Room.getCurrentRoom()) {
            lastRoom = Room.getCurrentRoom();
            return console.explainSituation(true, true);
          } else if (refreshState === true) {
            return console.explainSituation(true, true);
          } else {
            return console.explainSituation(false, false);
          }
        }).then(function() {
          return mainLoop();
        }).catch(function(err) {
          console.log('Fatal Interpreter Error?\n', err);
          return Promise.reject(err);
        });
      };

      return console.explainSituation(true, true).then(function() {
        return mainLoop();
      });
    }
  };

  return Promise.all([
    $('js/Character.js'),
    $('js/Item.js'),
    $('js/Room.js')
  ]).then(function(required) {
    [Character, Item, Room] = required;
    delete this.required;
    return new Promise(function(resolve, reject) {
      var keyfx = 'abcdefghp'.split('');
      console.setTitle('Loading...');
      for(index in keyfx) {
        if (keyfx[index] == 'c') {
          for (i = 1; i < 8; i++) {
            keyfx.push(fxpath.replace('%s', 'c' + i));
          }
        }
        keyfx[index] = fxpath.replace('%s', keyfx[index]);
      }
      console.preloadAudio(keyfx).then(() => {
        resolve(console)
      }).catch((err) => reject(err));
    });
  });



}());
