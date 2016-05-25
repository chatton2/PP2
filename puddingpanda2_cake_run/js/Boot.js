BasicGame.Boot = function (game) {
 this.music = null;
 this.playButton = null;
 this.back = null;
 this.helpButton = null;
 this.helpScreen = null;
 this.display = null;
 this.isHelp = 0;
};

BasicGame.Boot.prototype = {

preload: function (){
	
},

create: function () {
	this.game.state.start('Game');
},

update: function () {



},
};