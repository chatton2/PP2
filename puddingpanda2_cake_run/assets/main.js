window.onload = function() {
var game = new Phaser.Game(800, 600, Phaser.CANVAS, '', { preload: preload, create: create, update: update, render: render });
function preload() {
    game.load.tilemap('level1', 'assets/chynlevel2.json', null, Phaser.Tilemap.TILED_JSON);
    game.load.image('tiles-1', 'assets/tiles-1.png');
    game.load.spritesheet('dude', 'assets/panda.png', 32, 48);
    game.load.spritesheet('droid', 'assets/droid.png', 32, 32);
    game.load.image('starSmall', 'assets/star.png');
    game.load.image('starBig', 'assets/star2.png');
    game.load.image('background', 'assets/background2.png');
    game.load.image('lollipop', 'assets/lollipop2.png');
	game.load.image('pineapple', 'assets/pineapple2.png');
	game.load.image('pudding', 'assets/pudding2.png');
	game.load.audio('staccato', ['assets/staccato.ogg','assets/staccato.mp3']);
       game.load.audio('lose', ['assets/disenchant.mp3']);
game.load.audio('got', ['assets/enchant.mp3']);
game.load.audio('win', ['assets/arrow_and_splat.mp3']);

}
var map;
var tileset;
var layer;
var player;
var facing = 'left';
var jumpTimer = 0;
var cursors;
var jumpButton;
var bg;
var pineapple;
var pineapples;
var introText;
var ball;
var music;
var pineFall;
var gameDone;
var thing;
var lollipop;
var lollGone;
var scoreText;
var score;
var loseNoise;
var gotNoise;
var winNoise;

function create() {
	gameDone = 0;
lollGone = 0;
	pineapples = game.add.group();
    music = game.add.audio('staccato',.5,true);
    music.play();
    loseNoise = game.add.audio('lose',1,true);
    gotNoise = game.add.audio('got',2,true);
    winNoise = game.add.audio('win',2,true);
    game.stage.backgroundColor = '#000000';
    bg = game.add.tileSprite(0, 0, 800, 600, 'background');
    bg.fixedToCamera = true;
    map = game.add.tilemap('level1');
    map.addTilesetImage('tiles-1');
    map.setCollisionByExclusion([ 13, 14, 15, 16, 46, 47, 48, 49, 50, 51 ]);
    layer = map.createLayer('Tile Layer 1');
    //  Un-comment this on to see the collision tiles
   // layer.debug = true;
    layer.resizeWorld();
    game.physics.gravity.y = 250;
    game.physics.setBoundsToWorld();
    pudding = game.add.sprite(750, 500, 'pudding');
    pudding.body.collideWorldBounds = true;
    lollipop = game.add.sprite(400, 300, 'lollipop');
    lollipop.body.collideWorldBounds = true;
    player = game.add.sprite(32, 32, 'dude');
    player.body.minVelocity.y = 5;
    player.body.collideWorldBounds = true;
    player.body.setRectangle(16, 32, 8, 16);
    player.animations.add('left', [0, 1, 2, 3], 10, true);
    player.animations.add('turn', [4], 20, true);
    player.animations.add('right', [5, 6, 7, 8], 10, true);
  //  player.debug = true;
    game.camera.follow(player);
    cursors = game.input.keyboard.createCursorKeys();
    jumpButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    introText = game.add.text(game.world.centerX, 400, '- click to start -', { font: "40px Tangerine", fill: "#FF0033", align: "center" });
    introText.anchor.setTo(0.5, 0.5);
	introText.visible = false;
	introText.fixedToCamera = true;
    scoreText = game.add.text(22, 570, 'Score: 0', { font: "30px Tangerine", fill: "#FF0033", align: "left" });
    score = 0;
	pineapples = game.add.group();
    pineFall = game.time.events.loop(Phaser.Timer.SECOND * .5,  createPine, this);
}
function update() {
  
    player.body.velocity.x = 0;
    if(gameDone == 1){
       thing = game.input.onDown.add(restart, this);
    }
    if (cursors.left.isDown)
    {
        player.body.velocity.x = -150;
        if (facing != 'left')
        {
            player.animations.play('left');
            facing = 'left';
        }
    }
    else if (cursors.right.isDown)
    {
        player.body.velocity.x = 150;
        if (facing != 'right')
        {
            player.animations.play('right');
            facing = 'right';
        }
    }
    else
    {
        if (facing != 'idle')
        {
            player.animations.stop();
            if (facing == 'left')
            {
                player.frame = 0;
            }
            else
            {
                player.frame = 5;
            }
            facing = 'idle';
        }
    }
    if (jumpButton.isDown && player.body.onFloor() && game.time.now > jumpTimer)
    {
        player.body.velocity.y = -250;
        jumpTimer = game.time.now + 750;
    }
	else
	{
		//game.physics.collide(pineapples, player, gameOver, null, this);
		game.physics.collide(player, layer);
		game.physics.collide(pudding, layer);
                game.physics.collide(lollipop, layer);
                game.physics.overlap(player, lollipop, addScore, null, this);
		game.physics.overlap(player, pineapples, gameOver, null, this);
		game.physics.overlap(player, pudding, gameWin, null, this);
	}
}

function callPine() {
	game.time.events.repeat(Phaser.Timer.SECOND * 1, 2, createPine, this);
}

function createPine() {
  
  pineapple = pineapples.create(Math.random() * (800 - 50) + 50, 50, 'pineapple');
}

function addScore () {
    gotNoise.play();
    lollipop.kill();
    score += 10;
    scoreText.content = 'Score: ' + score;
    lollGone = 1;
}

function gameOver () {
    loseNoise.play();
    introText.content = 'Game Over!';
    introText.visible = true;
    pudding.kill();
    if(lollGone == 0){
      lollipop.kill();
    }
    game.time.events.remove(pineFall, this);
    gameDone = 1;
}

function restart(){
    introText.visible = false;
    lollipop = game.add.sprite(400, 300, 'lollipop');
    lollipop.body.collideWorldBounds = true;
    lollGone = 0;
    pineFall = game.time.events.loop(Phaser.Timer.SECOND * .5,  createPine, this);
    player.x = 32;
    player.y = 32;
    pudding = game.add.sprite(750, 500, 'pudding');
    pudding.body.collideWorldBounds = true;
    gameDone = 0;
    score = 0;
    scoreText.content = 'Score: ' + score;
    game.input.onDown.removeAll();
}

function gameWin () {
    winNoise.play();
    introText.content = 'You Got The Pudding!';
    introText.visible = true;
    pudding.kill();
    if(lollGone == 0){
      lollipop.kill();
    }
    game.time.events.remove(pineFall, this);
    gameDone = 1;

}


function render () {
    if (player.debug)
    {
        game.debug.renderPhysicsBody(player.body);
        game.debug.renderBodyInfo(player, 16, 24);
    }
}
};
