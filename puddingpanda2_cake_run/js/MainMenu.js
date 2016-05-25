
BasicGame.MainMenu = function (game) {

 this.music = null;
 this.playButton = null;
 this.back = null;
 this.helpButton = null;
 this.helpScreen = null;
 this.display = null;
 this.isHelp = 0;

};

BasicGame.MainMenu.prototype = {

preload: function (){
	this.load.tilemap('level1', 'assets/base_level2.json', null, Phaser.Tilemap.TILED_JSON);
    this.load.image('tiles-1', 'assets/tiles-1.png');
    this.load.spritesheet('dude', 'assets/panda.png', 32, 48);
	this.load.image('pudding', 'assets/pudding2.png');
    this.load.audio('got', ['assets/enchant.mp3']);
    this.load.audio('win', ['assets/arrow_and_splat.mp3']);
	this.load.spritesheet('button', 'assets/button.png',193, 71);
	this.load.image('titlepage', 'assets/menu_background.png');
	this.load.image('background', 'assets/background2.png');
	this.load.image('helpscreen','assets/helpscreenie.png');
	this.load.spritesheet('button', 'assets/button.png',193, 71);
	this.load.spritesheet('helpbutton', 'assets/help_button.png',193, 71);
	this.load.image('load_bar', 'assets/load_bar.png');
	this.load.audio('crumble', ['assets/crumbling.mp3']);
},

create: function () {
	this.back = this.add.sprite(0, 0, 'titlepage');
	this.back.fixedToCamera = true;
	this.playButton = this.add.button(200, 450, 'button', this.startGame, this, 2,1,0);
	this.helpButton = this.add.button(400, 450, 'helpbutton', this.helpGame, this, 2,1,0);
	this.helpScreen = this.add.sprite(5, 25, 'helpscreen');
	this.helpScreen.visible = false;

},

update: function () {



},
helpGame: function (pointer) {
	if(this.isHelp == 0){
		this.helpScreen.visible = true;
		this.isHelp = 1;
	}
	else{
		this.helpScreen.visible = false;
		this.isHelp = 0;
	}
},
startGame: function (pointer) {
	this.game.state.start('Game');
}
};