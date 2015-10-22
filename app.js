/* TODO
    - Reset game on win
    - Style board
    - Write tests
    - See if there is a more clever way of determining winner in checkStatus
*/

var app = {

    init: function() { 
        this.overlay = document.getElementById('overlay');
        this.setup = document.getElementById('setup');
        this.characters = this.setup.querySelectorAll('.character');
        this.chooseCharacters();
        this.board = document.getElementById('board'),
        this.spaces = this.board.children,
        this.setGameHandlers();
    },
    chooseCharacters: function() { 
        this.info_msg = this.setup.querySelector('.info');
        this.overlay.className = "active";
        this.setup.className = "active";
        this.choosePlayer();
        return true;
    },
    choosePlayer: function() { 
        var self = this,
            player,
            characters = Array.prototype.slice.call(this.characters);

        function selectPlayer(e) { 
            if (!e.currentTarget.classList.contains('selected')) {
                player = e.currentTarget.className;
                e.currentTarget.className += ' selected player';
                characters.forEach(function(character) {
                    character.removeEventListener('click', selectPlayer);
                });
                self.player = player;
                return self.chooseOpponent();
            }
        }
        
        this.info_msg.innerHTML = "Who would you like to play as?";
        
        characters.forEach(function(character) {
            character.addEventListener('click', selectPlayer, false);
        });
    },
    chooseOpponent: function() { 
        var self = this,
            opponent,
            characters = Array.prototype.slice.call(this.characters);

        function selectOpponent(e) { 
            if (!e.currentTarget.classList.contains('selected')) {
                opponent = e.currentTarget.className;
                e.currentTarget.className += ' selected opponent';
                characters.forEach(function(character) {
                    character.removeEventListener('click', selectOpponent);
                });
                self.opponent = opponent;
                self.overlay.className = "";
                self.setup.className = "";
                return opponent;
            }
        }

        this.info_msg.innerHTML = "Who would you like to challenge?";

        characters.forEach(function(character) {
            character.addEventListener('click', selectOpponent, false);
        });

        
    },
    clearBoard: function() { 
        spaces = Array.prototype.slice.call(this.spaces);
        spaces.forEach(function(space) {
            space.className = "";
        });
    },
    setGameHandlers: function() { 
        var self = this;
        board.addEventListener('click', function(e) { 
            if (e.target.classList.length <= 0) {
                self.initRound();
            }
        }, false);
    },
    checkStatus: function(spaces) {
        if ((spaces[0].className === spaces[1].className && spaces[1].className === spaces[2].className) && spaces[0].className !== "" ||
            (spaces[3].className === spaces[4].className && spaces[4].className === spaces[5].className) && spaces[3].className !== "" ||
            (spaces[6].className === spaces[7].className && spaces[7].className === spaces[8].className) && spaces[6].className !== "" ||
            (spaces[0].className === spaces[3].className && spaces[3].className === spaces[6].className) && spaces[0].className !== "" ||
            (spaces[1].className === spaces[4].className && spaces[4].className === spaces[7].className) && spaces[1].className !== "" ||
            (spaces[2].className === spaces[5].className && spaces[5].className === spaces[8].className) && spaces[2].className !== "" ||
            (spaces[0].className === spaces[4].className && spaces[4].className === spaces[8].className) && spaces[0].className !== "" ||
            (spaces[2].className === spaces[4].className && spaces[4].className === spaces[6].className) && spaces[2].className !== "") {
            return true;
        } 
    },  
    initRound: function() { 
        var winner;

        winner = this.playerTurn();
        
        if (winner) {
            var player = this.player.charAt(0).toUpperCase() + this.player.slice(1),
                again = confirm(player + " wins. Play again?");

            if (again) {
                this.clearBoard();
                this.init()
            } else {
                window.location.href = "http://vattuo.net"
            }
            return true;
        }

        winner = this.opponentTurn();
        
        if (winner) {
            var opponent = this.player.charAt(0).toUpperCase() + this.player.slice(1),
                again = confirm(opponent + " wins. Play again?");

            if (again) {
                this.clearBoard();
                this.init()
            } else {
                window.location.href = "http://vattuo.net"
            }
            return true;
        }
    },
    playerTurn: function() {
        event.target.className = this.player; 
        return this.checkStatus(this.spaces);
    },
    opponentTurn: function() { 
        var moved;
        
        // Give HTMLCollection properties of an array
        spaces = Array.prototype.slice.call(this.spaces);

        // Take winning move i.e. if there is a winning move, take it
        if (spaces.every(function(value, index, array) { return value.className !== "" })) { return false; }

        for (i=0; i<this.spaces.length; i++) {
            var clonedBoard = this.board.cloneNode(true),
                clonedSpaces = clonedBoard.children;
            if (clonedSpaces[i].className === "") {
                clonedSpaces[i].className = this.opponent;
                if (this.checkStatus(clonedSpaces)) {
                    this.spaces[i].className = this.opponent;
                    return true;
                }
            }
        }   

        // See if there’s a move the player can make that will cause the computer to lose the game. 
        for (i=0; i<this.spaces.length; i++) {
            var clonedBoard = this.board.cloneNode(true),
                clonedSpaces = clonedBoard.children;
            if (clonedSpaces[i].className === "") {
                clonedSpaces[i].className = this.player;
                // If there is, move there to block the player. Otherwise, go to step 3.
                if (this.checkStatus(clonedSpaces)) {
                    this.spaces[i].className = this.opponent;
                    return false;
                }
            }
        }

        // BS random move generator for testing purposes...
        while (!moved) {
            var choice = Math.floor(Math.random() * 8);

            if (this.spaces[choice].className === "") {
                this.spaces[choice].className = this.opponent;
                moved = true;
            }
        }

        return this.checkStatus(this.spaces);

        // Check if any of the corner spaces (spaces 1, 3, 7, or 9) are free. If so, move there. If no corner piece is free, then go to step 4.
        // Check if the center is free. If so, move there. If it isn’t, then go to step 5.
        // Move on any of the side pieces (spaces 2, 4, 6, or 8). There are no more steps, because if the execution reaches step 5 the side spaces are the only spaces left.
    }
};

app.init();