window.onload = function() {

var BasicGame = {};
var game = new Phaser.Game(800, 600, Phaser.AUTO, 'gameContainer');
game.state.add('js/Boot', BasicGame.Boot);
game.state.add('MainMenu', BasicGame.MainMenu);
game.state.add('js/Game', BasicGame.Game);
game.state.start('MainMenu');

};

