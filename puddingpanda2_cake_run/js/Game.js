
BasicGame.Game = function (game) {
this.map;
this.tileset;
this.layer;
this.player;
this.facing = 'left';
this.jumpTimer = 0;
this.soundTimer = 0;
this.jumTimer = 0;
this.muteTimer = 0;
this.cursors;
this.jumpButton;
this.bg;
this.introText;
this.ball;
this.music;
this.gameDone;
this.thing;
this.scoreText;
this.score;
this.loseNoise;
this.gotNoise;
this.winNoise;
this.blocks;
this.speed = 1;
this.highScore;
};

BasicGame.Game.prototype = {

preload: function(){
var textText = this.add.text(320, 200, 'LOADING', { font: "30px Tangerine", fill: "#0086FF", align: "left" });
var cPoo = this.add.sprite(110, 300, 'load_bar');
	cPoo.body.allowGravity = false;
	this.load.setPreloadSprite(cPoo);
	this.load.image('cPudding', 'assets/pudding2.png');
	this.load.image('cookie', 'assets/cracker.png');
    this.load.spritesheet('dude', 'assets/panda.png', 32, 48);
    this.load.image('starSmall', 'assets/star.png');
    this.load.image('background', 'assets/background_wide.png');
	this.load.image('cake', 'assets/pineapple_upside_down_cake.png');
	this.load.image('vPudding', 'assets/van_pudding.png');
	this.load.image('panWin', 'assets/panda_win.png');
	this.load.image('game_over_text', 'assets/game_over_text.png');
	this.load.image('game_win_text', 'assets/game_win_text.png');
	this.load.image('crumbs', 'assets/crumbs.png');
	this.load.image('crumbs2', 'assets/crumb2.png');
	this.load.image('cubelets', 'assets/cubelets.png');
	this.load.image('jello', 'assets/jello.png');
	this.load.image('glow', 'assets/fGlow.png');
	this.load.image('flowerBig', 'assets/flower_big.png');
	this.load.image('flowerMed', 'assets/flower_mid.png');
	this.load.image('pineapple', 'assets/pineapple2.png');
	this.load.tilemap('level1', 'assets/level_1.json', null, Phaser.Tilemap.TILED_JSON);
    this.load.image('tiles-1', 'assets/tiles-1.png');
	this.load.image('screen', 'assets/screen.png');
	this.load.image('soundOn', 'assets/sound_on.png');
	this.load.image('soundOff', 'assets/sound_off.png');
	this.load.image('cookieOver', 'assets/game_over.png');
	this.load.audio('rumble', ['assets/rumble.mp3']);
	this.load.audio('staccato', ['assets/background.mp3']);
	this.load.audio('lose', ['assets/disenchant.mp3']);
	this.load.audio('footstep', ['assets/footstep.mp3']);
},

create : function() {
    this.gameSave = JSON.parse(localStorage.getItem('user'));
    if(this.gameSave)
    {
        console.log('LOADED!!');
        this.highScore = this.gameSave.highScore;
		console.log(JSON.parse(localStorage.getItem('user')));
    }
    else{
		this.gameSave = {};
		this.highScore = 0;
	}	
	this.gameDone = 0;
	this.music = this.add.audio('staccato',1,true);
	this.music.loop = true;
	this.music.play();
	this.rumble = this.add.audio('rumble');
	this.rumble.loop = true;
	this.rumble.volume = .4;
	this.rumble.play();
    this.loseNoise = this.add.audio('lose',1,true);
    this.gotNoise = this.add.audio('got',2,true);
	this.crumbNoise = this.add.audio('crumble',2,true);
    this.winNoise = this.add.audio('win',2,true);
	this.footStep = this.add.audio('footstep',2,true);
    this.stage.backgroundColor = '#000000';
	this.bg = this.add.sprite(0, 192,'background');
    this.map = this.add.tilemap('level1');
    this.map.addTilesetImage('tiles-1');
    this.map.setCollisionByExclusion([ 13, 14, 15, 16, 46, 47, 48, 49, 50, 51 ]);
    this.layer = this.map.createLayer('Tile Layer 1');
    this.layer.resizeWorld();
    this.physics.gravity.y = 500;
    this.physics.setBoundsToWorld();
	this.bg.body.collideWorldBounds = true;
    this.player = this.add.sprite(600, 0, 'dude');
    this.player.body.minVelocity.y = 5;
    this.player.body.collideWorldBounds = true;
    this.player.body.setRectangle(16, 32, 8, 16);
    this.player.animations.add('left', [0, 1, 2, 3], 10, true);
    this.player.animations.add('turn', [4], 20, true);
    this.player.animations.add('right', [5, 6, 7, 8], 10, true);
    this.camera.x = 0;
    this.camera.y = -500;
    this.cursors = this.input.keyboard.createCursorKeys();
    this.jumpButton = this.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
	this.flow1 = this.add.sprite(258, 275, 'flowerBig');
	this.flow1.visible = false;
	this.flow1.fixedToCamera = true;
	this.flow1.anchor.setTo(0.5, 0.5);
	this.flow1.body.angularVelocity = 100;
	this.flow2 = this.add.sprite(675, 355, 'flowerMed');
	this.flow2.visible = false;
	this.flow2.fixedToCamera = true;
	this.flow2.anchor.setTo(0.5, 0.5);
	this.flow2.body.angularVelocity = -200;
    this.score = 0;
	this.cubes = this.add.group();
	this.blocks = this.add.group();
	this.glow = this.add.sprite(730, 4400, 'glow');
	this.cPudding = this.add.sprite(730, 4400, 'cPudding');
	this.vPudding = this.add.sprite(750, 4400, 'vPudding');
	this.playWin = this.add.sprite(750, 4400, 'panWin');
	this.player.body.minVelocity.y = 5;
	this.player.body.collideWorldBounds = true;
	this.makeBlock(this);
	this.speed = 1; 
	this.stuck = 0;
	this.fast = 0;
	this.fluid = 0;
	this.pineapples = this.add.group();
	this.stars = this.add.group();
	this.pineFall = this.time.events.loop((Phaser.Timer.SECOND * 3) / this.speed,  this.createPine, this);
	this.createThing = 0;
	this.mute = 0;
	this.muteKey = this.input.keyboard.addKey(Phaser.Keyboard.M);
	this.screen = this.add.sprite(0, 0, 'screen');
	this.screen.fixedToCamera = true;
	this.screen.visible = false;
	this.winText = this.add.sprite(300, 275,'game_win_text');
	this.winText.visible = false;
	this.winText.body.allowGravity = false;
	this.winText.fixedToCamera = true;
	this.scoreText = this.add.text(22, 10, 'Score: 0', { font: "30px Tangerine", fill: "#0086FF", align: "left" });
    this.scoreText.fixedToCamera = true;
	this.losses = 0;
	this.loseText = this.add.text(650, 570, 'Losses: 0', { font: "30px Tangerine", fill: "#0086FF", align: "right" });
    this.loseText.fixedToCamera = true;
	this.highScoreText = this.add.text(22, 570, 'High Score: 0', { font: "30px Tangerine", fill: "#0086FF", align: "left" });
    this.highScoreText.fixedToCamera = true;
	this.ex = this.add.sprite(4700, 215, 'cookie');
	this.ex.body.allowGravity = false;
	this.ex.body.immovable = true;
	this.ex.body.moves = false;
	this.cake = this.add.sprite(150,0, 'cake');
	this.overText = this.add.sprite(200, 200,'cookieOver');
	this.overText.visible = false;
	this.overText.body.allowGravity = false;
	this.overText.fixedToCamera = true;
	this.soundOn = this.add.sprite(760, 10,'soundOn');
	this.soundOn.body.allowGravity = false;
	this.soundOn.fixedToCamera = true;
	this.soundOff = this.add.sprite(760, 10,'soundOff');
	this.soundOff.visible = false;
	this.soundOff.body.allowGravity = false;
	this.soundOff.fixedToCamera = true;
},
update : function() { 
	if(this.muteKey.isDown && this.time.now > this.muteTimer){
		this.muteTimer = this.time.now + 500;
		if(this.mute == 0){
			this.music.volume = 0;
			this.rumble.volume = 0;
			this.soundOn.visible = false;
			this.soundOff.visible = true;
			this.mute = 1;
		}
		else if(this.mute == 1){
			this.music.volume = .4;
			this.rumble.volume = .4;
			this.soundOn.visible = true;
			this.soundOff.visible = false;
			this.mute = 0;
		}
	}
	this.thing = this.input.onDown.add(this.restart, this);
	if(this.player.body.y > 700 && this.gameDone != 2){
		this.gameOver(this);
	}
	if(this.player.body.x > 4400 && this.player.body.y < 200 && this.gameDone != 1 && this.gameDone != 2){
		this.gameWin(this);
	}
	if(this.gameDone == 1){
		if(this.playWin.body.y > 160){
			this.playWin.body.velocity.y = -200;
		}
	}
	if(this.physics.overlap(this.player, this.cPudding)){
		this.fluid = 1;
		this.cPudding.kill();
		this.player.alpha = .5;
		if(this.mute == 0){
			this.winNoise.play();
		}
	}
	if(this.physics.overlap(this.player, this.vPudding)){
		this.fast = 1;
		this.vPudding.kill();
		this.player.tint = '0xff00ff';
		this.starBomb = this.time.events.loop((Phaser.Timer.SECOND) / 3,  this.starGen, this);
		if(this.mute == 0){
			this.winNoise.play();
		}
	}
	this.camera.y = 50;
	if(!this.physics.collide(this.player, this.blocks) || !this.player.body.onFloor()){
		this.camera.x = this.player.body.x - 500;
	}
	if(this.physics.overlap(this.player, this.cubes) && this.fluid == 0){
		this.stuck = 1;
	}
	else{
		this.stuck = 0;
	}
	if(this.stuck == 0){
		this.physics.gravity.y = 500;
	}
	else{
		this.physics.gravity.y = 10;
	}
    this.player.body.velocity.x = 0;
	if(this.cake.body.y > 90){
		this.cake.anchor.setTo(0.5, 0.5);
		this.cake.body.angularVelocity = 50;
		this.cake.body.velocity.x = 100;
	}
	else{
		this.cake.anchor.setTo(0.5, 0.5);
		this.cake.body.angularVelocity = 0;
		this.cake.body.velocity.x = 0;
	}
	if(this.cake.body.y > 4000){
		this.rumble.stop();
	}
    if (this.cursors.left.isDown)
    {
		if(this.player.body.y > 460 || (this.player.body.y > 364 && this.player.body.y < 370) || (this.player.body.y > 164 && this.player.body.y < 170)){
			if(this.time.now > this.soundTimer && this.time.now > this.jumpTimer && this.mute == 0 &&(this.physics.collide(this.player, this.blocks) || this.player.body.onFloor() || this.player.y > 460)){
				this.soundTimer = this.time.now + 300;
				this.footStep.play();
			}
			if(this.stuck == 1){
				this.player.body.velocity.x = -50;
			}
			else if (this.fast == 1){
				this.player.body.velocity.x = -600;// * this.speed;
			}
			else{
				this.player.body.velocity.x = -300;// * this.speed;
			}
		}
		else{
			if (this.fast == 1){
				this.player.body.velocity.x = -500 * this.speed;
			}
			else{
				this.player.body.velocity.x = -200;
			}
		}
        if (this.facing != 'left')
        {
            this.player.animations.play('left');
            this.facing = 'left';
        }
    }
    else if (this.cursors.right.isDown)
    {
        if(this.player.body.y > 460 || (this.player.body.y > 364 && this.player.body.y < 370) || (this.player.body.y > 164 && this.player.body.y < 170)){
			if(this.time.now > this.soundTimer && this.time.now > this.jumpTimer && this.mute == 0 &&(this.physics.collide(this.player, this.blocks) || this.player.body.onFloor() || this.player.y > 460)){
				this.soundTimer = this.time.now + 300;
				this.footStep.play();
			}
			if(this.stuck == 1){
				this.player.body.velocity.x = 50;
			}
			else if (this.fast == 1){
				this.player.body.velocity.x = 600;// * this.speed;
			}
			else{
				this.player.body.velocity.x = 300;// * this.speed;
			}
		}
		else{
			if (this.fast == 1){
				this.player.body.velocity.x = 500 * this.speed;
			}
			else{
				this.player.body.velocity.x = 200;
			}
		}
        if (this.facing != 'right')
        {
            this.player.animations.play('right');
            this.facing = 'right';
        }
    }
    else
    {
        if (this.facing != 'idle')
        {
			this.player.animations.stop();
            if (this.facing == 'left')
            {
                this.player.frame = 0;
            }
            else
            {
                this.player.frame = 5;
            }
            this.facing = 'idle';
        }
    }
    if (this.jumpButton.isDown && this.time.now > this.jumpTimer &&(this.physics.collide(this.player, this.blocks) || this.player.body.onFloor() || this.player.y > 460))
    {
			if(this.stuck == 0){
				this.physics.gravity.y = 0;
				this.player.body.velocity.y = -450;
				this.jumpTimer = this.time.now + 1000;
			}
			else{
				this.physics.gravity.y = 0;
				this.player.body.velocity.y = 0;
				this.jumpTimer = this.time.now + 1000;
			}
    }
	else
	{
		this.physics.collide(this.player, this.layer);
		this.physics.collide(this.player, this.blocks);
		this.physics.collide(this.playWin, this.layer);
		this.physics.collide(this.playWin, this.blocks);
		this.physics.collide(this.player, this.cake, this.gameOver,null,this);
		this.physics.collide(this.blocks, this.blocks);
		this.physics.collide(this.cake, this.layer);
		this.physics.collide(this.cPudding, this.layer);
		this.physics.collide(this.cPudding, this.blocks);
		this.physics.collide(this.vPudding, this.layer);
		this.physics.collide(this.vPudding, this.blocks);
		this.physics.overlap(this.cake, this.blocks, this.killBlock, null, this);
		this.physics.overlap(this.cake, this.cubes, this.killCube, null, this);
		this.physics.overlap(this.player, this.pineapples, this.gameOver, null, this);
	}
	this.scoreText.content = 'Score: ' + this.score;
	this.highScoreText.content = 'High Score: ' + this.highScore;
	this.loseText.content = 'Losses: ' + this.losses;
},

makeBlock : function(){
q = 4;
cPudOut = 0;
vPudOut = 0;
outCount = 0;
tooManyBlanks = 0;
this.block = this.blocks.create(3900, 415, 'cookie');
this.block.body.allowGravity = false;
this.block.body.immovable = true;
this.block.body.moves = false;
	for(i = 4000; i < 4700; i = i + 100){
		this.block = this.blocks.create(i, 215, 'cookie');
		this.block.body.allowGravity = false;
		this.block.body.immovable = true;
		this.block.body.moves = false;
	}
for(i = 3800; i >= 700; i = i - 100){
		if(tooManyBlanks == 9){
			this.blocky = this.blocks.create(i, 415, 'cookie');
			this.blocky.body.allowGravity = false;
			this.blocky.body.immovable = true;
			this.blocky.body.moves = false;
			q = 4;
			tooManyBlanks = 0;
		}
		else if(i == 700){
			j = Math.floor(Math.random() * (4 - 1 + 1)) + 1;
			if(j == 2){
				this.block = this.blocks.create(i, 215, 'cookie');
				this.block.body.allowGravity = false;
				this.block.body.immovable = true;
				this.block.body.moves = false;
				this.blocky = this.blocks.create(i, 415, 'cookie');
				this.blocky.body.allowGravity = false;
				this.blocky.body.immovable = true;
				this.blocky.body.moves = false;
				q = 2;
			}
			else if(j == 4 || j == 1 || j == 3){
				this.blocky = this.blocks.create(i, 415, 'cookie');
				this.blocky.body.allowGravity = false;
				this.blocky.body.immovable = true;
				this.blocky.body.moves = false;
				q = 4;
			}
		}
		else{
			if((cPudOut == 1 && vPudOut == 0) || (cPudOut == 0 && vPudOut == 1)){
				outCount = outCount + 1;
			}
			if(i < 3000 && i > 800 && (cPudOut == 0 || vPudOut == 0) && (outCount == 0 || outCount == 5)){
				isOut = Math.floor(Math.random() * (5 - 1 + 1)) + 1;
				if(isOut == 2){
					outCount = 1;
					if(cPudOut == 1){
						which = 1;
						vPudOut = 1;
					}
					else if(vPudOut == 1){
						which = 2;
						cPudOut = 1;
					}
					else{
						which = Math.floor(Math.random() * (2 - 1 + 1)) + 1;
						if(which == 1){
							vPudOut = 1;
						}
						else if(which == 2){
							cPudOut = 1;
						}
						else{
							which = 1;
							vPudOut = 1;
						}
					}
					isOut = Math.floor(Math.random() * (2 - 1 + 1)) + 1;
					if(isOut == 1){
						isOu = Math.floor(Math.random() * (2 - 1 + 1)) + 1;
						if(isOu == 1){
							this.block = this.blocks.create(i, 215, 'cookie');
							this.block.body.allowGravity = false;
							this.block.body.immovable = true;
							this.block.body.moves = false;	
							if(which == 2){
								this.cPudding.x = i + 30;
								this.cPudding.y = 154;
							}
							else if(which == 1){
								this.vPudding.x = i + 30;
								this.vPudding.y = 154;
							}
						}
						else if (isOu == 2){
							this.block = this.blocks.create(i, 215, 'cookie');
							this.block.body.allowGravity = false;
							this.block.body.immovable = true;
							this.block.body.moves = false;
							this.blocky = this.blocks.create(i, 415, 'cookie');
							this.blocky.body.allowGravity = false;
							this.blocky.body.immovable = true;
							this.blocky.body.moves = false;
							if(which == 2){
								this.cPudding.x = i + 30;
								this.cPudding.y = 154;
							}
							else if(which == 1){
								this.vPudding.x = i + 30;
								this.vPudding.y = 154;
							}
						}
						q = 10;
					}
					else if(isOut == 2){
						isOu = Math.floor(Math.random() * (4 - 1 + 1)) + 1;
						if(isOu == 1){
							this.block = this.blocks.create(i, 415, 'cookie');
							this.block.body.allowGravity = false;
							this.block.body.immovable = true;
							this.block.body.moves = false;
							if(which == 2){
								this.cPudding.x = i + 30;
								this.cPudding.y = 354;
							}
							else if(which == 1){
								this.vPudding.x = i + 30;
								this.vPudding.y = 354;
							}
							q = 11;
						}
						else if (isOu == 2){
							this.block = this.blocks.create(i, 215, 'cookie');
							this.block.body.allowGravity = false;
							this.block.body.immovable = true;
							this.block.body.moves = false;
							this.blocky = this.blocks.create(i, 415, 'cookie');
							this.blocky.body.allowGravity = false;
							this.blocky.body.immovable = true;
							this.blocky.body.moves = false;
							if(which == 2){
								this.cPudding.x = i + 30;
								this.cPudding.y = 154;
							}
							else if(which == 1){
								this.vPudding.x = i + 30;
								this.vPudding.y = 154;
							}
							q = 11;
						}
						else if (isOu == 3){
							if(which == 2){
								this.cPudding.x = i + 30;
								this.cPudding.y = 415;
							}
							else if(which == 1){
								this.vPudding.x = i + 30;
								this.vPudding.y = 415;
							}
							q = 11;
						}
						else if (isOu == 4){
							this.block = this.blocks.create(i, 215, 'cookie');
							this.block.body.allowGravity = false;
							this.block.body.immovable = true;
							this.block.body.moves = false;
							if(which == 2){
								this.cPudding.x = i + 30;
								this.cPudding.y = 415;
							}
							else if(which == 1){
								this.vPudding.x = i + 30;
								this.vPudding.y = 415;
							}
							q = 12;
						}
					}
				}
			}
			else if(q == 10){
				j = Math.floor(Math.random() * (2 - 1 + 1)) + 1;
				 if(j == 1){
					this.cubey = this.cubes.create(i + 5, 130, 'jello');
					this.cubey.body.allowGravity = false;
					this.cubey.body.immovable = true;
					this.cubey.body.moves = false;
					this.cubey.alpha = .8;
					this.block = this.blocks.create(i, 215, 'cookie');
					this.block.body.allowGravity = false;
					this.block.body.immovable = true;
					this.block.body.moves = false;
					q = 8;
				}
				else if (j == 2){
					this.cubey = this.cubes.create(i + 5, 130, 'jello');
					this.cubey.body.allowGravity = false;
					this.cubey.body.immovable = true;
					this.cubey.body.moves = false;
					this.cubey.alpha = .8;
					this.block = this.blocks.create(i, 215, 'cookie');
					this.block.body.allowGravity = false;
					this.block.body.immovable = true;
					this.block.body.moves = false;
					q = 9;
				}
			}
			else if (q == 11){
				j = Math.floor(Math.random() * (3 - 1 + 1)) + 1;
				if(j == 1){
					this.cubey = this.cubes.create(i + 5, 422, 'jello');
					this.cubey.body.allowGravity = false;
					this.cubey.body.immovable = true;
					this.cubey.body.moves = false;
					this.cubey.alpha = .8;
					q = 5;
				}
				else if(j == 2){
					this.cubey = this.cubes.create(i + 5, 422, 'jello');
					this.cubey.body.allowGravity = false;
					this.cubey.body.immovable = true;
					this.cubey.body.moves = false;
					this.cubey.alpha = .8;
					this.cubey = this.cubes.create(i + 5, 332, 'jello');
					this.cubey.body.allowGravity = false;
					this.cubey.body.immovable = true;
					this.cubey.body.moves = false;
					this.cubey.alpha = .8;
					q = 6;
				}
				else if(j == 3){
					this.cubey = this.cubes.create(i + 5, 330, 'jello');
					this.cubey.body.allowGravity = false;
					this.cubey.body.immovable = true;
					this.cubey.body.moves = false;
					this.cubey.alpha = .8;
					this.blocky = this.blocks.create(i, 415, 'cookie');
					this.blocky.body.allowGravity = false;
					this.blocky.body.immovable = true;
					this.blocky.body.moves = false;
					q = 7;
				}
			}
			else if (q == 12){
				this.cubey = this.cubes.create(i + 5, 422, 'jello');
				this.cubey.body.allowGravity = false;
				this.cubey.body.immovable = true;
				this.cubey.body.moves = false;
				this.cubey.alpha = .8;
				q = 5;
			}
			else if(tooManyBlanks == 4){
					this.block = this.blocks.create(i, 415, 'cookie');
					this.block.body.allowGravity = false;
					this.block.body.immovable = true;
					this.block.body.moves = false;
					q = 4;
					tooManyBlanks = 0;
			}
			else if(q == 5 || q == 6 || q == 7 || q == 8 || q == 9){
				if(q == 7 || q == 6){
						this.block = this.blocks.create(i, 415, 'cookie');
						this.block.body.allowGravity = false;
						this.block.body.immovable = true;
						this.block.body.moves = false;
						q = 4;
				}
				else{
					j = Math.floor(Math.random() * (4 - 1 + 1)) + 1;
					if(j == 2){
						this.block = this.blocks.create(i, 215, 'cookie');
						this.block.body.allowGravity = false;
						this.block.body.immovable = true;
						this.block.body.moves = false;
						this.blocky = this.blocks.create(i, 415, 'cookie');
						this.blocky.body.allowGravity = false;
						this.blocky.body.immovable = true;
						this.blocky.body.moves = false;
						q = j;
					}
					else if (j == 3){
						this.block = this.blocks.create(i, 215, 'cookie');
						this.block.body.allowGravity = false;
						this.block.body.immovable = true;
						this.block.body.moves = false;
						q = j;
					}
					else if(j == 4){
						this.blocky = this.blocks.create(i, 415, 'cookie');
						this.blocky.body.allowGravity = false;
						this.blocky.body.immovable = true;
						this.blocky.body.moves = false;
						q = j;
					}
				}
			}
			else if(q == 2 || q == 3){
				j = Math.floor(Math.random() * (10 - 1 + 1)) + 1;
				if(j == 2 || j == 10){
					this.block = this.blocks.create(i, 215, 'cookie');
					this.block.body.allowGravity = false;
					this.block.body.immovable = true;
					this.block.body.moves = false;
					this.blocky = this.blocks.create(i, 415, 'cookie');
					this.blocky.body.allowGravity = false;
					this.blocky.body.immovable = true;
					this.blocky.body.moves = false;
					q = j;
				}
				else if (j == 3){
					this.block = this.blocks.create(i, 215, 'cookie');
					this.block.body.allowGravity = false;
					this.block.body.immovable = true;
					this.block.body.moves = false;
					q = j;
				}
				else if(j == 4 || j == 8 || j == 9){
					this.blocky = this.blocks.create(i, 415, 'cookie');
					this.blocky.body.allowGravity = false;
					this.blocky.body.immovable = true;
					this.blocky.body.moves = false;
					q = j;
				}
				else if(j == 5){
					this.cubey = this.cubes.create(i + 5, 422, 'jello');
					this.cubey.body.allowGravity = false;
					this.cubey.body.immovable = true;
					this.cubey.body.moves = false;
					this.cubey.alpha = .8;
					q = j;
				}
				else if(j == 6){
					this.block = this.blocks.create(i, 215, 'cookie');
					this.block.body.allowGravity = false;
					this.block.body.immovable = true;
					this.block.body.moves = false;
					this.cubey = this.cubes.create(i + 5, 130, 'jello');
					this.cubey.body.allowGravity = false;
					this.cubey.body.immovable = true;
					this.cubey.body.moves = false;
					this.cubey.alpha = .8;
					q = 8;
				}
				else if (j == 7){
					this.block = this.blocks.create(i, 215, 'cookie');
					this.block.body.allowGravity = false;
					this.block.body.immovable = true;
					this.block.body.moves = false;
					this.cubey = this.cubes.create(i + 5, 130, 'jello');
					this.cubey.body.allowGravity = false;
					this.cubey.body.immovable = true;
					this.cubey.body.moves = false;
					this.cubey.alpha = .8;
					q = 9;
				}
			}
			else{
				j = Math.floor(Math.random() * (9 - 1 + 1)) + 1;
				if(j == 2){
					this.block = this.blocks.create(i, 215, 'cookie');
					this.block.body.allowGravity = false;
					this.block.body.immovable = true;
					this.block.body.moves = false;
					this.blocky = this.blocks.create(i, 415, 'cookie');
					this.blocky.body.allowGravity = false;
					this.blocky.body.immovable = true;
					this.blocky.body.moves = false;
					q = j;
				}
				else if (j == 3){
					this.block = this.blocks.create(i, 215, 'cookie');
					this.block.body.allowGravity = false;
					this.block.body.immovable = true;
					this.block.body.moves = false;
					q = j;
				}
				else if(j == 4){
					this.blocky = this.blocks.create(i, 415, 'cookie');
					this.blocky.body.allowGravity = false;
					this.blocky.body.immovable = true;
					this.blocky.body.moves = false;
					q = j;
				}
				else if(j == 5){
					this.cubey = this.cubes.create(i + 5, 422, 'jello');
					this.cubey.body.allowGravity = false;
					this.cubey.body.immovable = true;
					this.cubey.body.moves = false;
					this.cubey.alpha = .8;
					q = j;
				}
				else if(j == 6){
					this.cubey = this.cubes.create(i + 5, 422, 'jello');
					this.cubey.body.allowGravity = false;
					this.cubey.body.immovable = true;
					this.cubey.body.moves = false;
					this.cubey.alpha = .8;
					this.cubey = this.cubes.create(i + 5, 332, 'jello');
					this.cubey.body.allowGravity = false;
					this.cubey.body.immovable = true;
					this.cubey.body.moves = false;
					this.cubey.alpha = .8;
					q = j;
				}
				else if(j == 7){
					this.blocky = this.blocks.create(i, 415, 'cookie');
					this.blocky.body.allowGravity = false;
					this.blocky.body.immovable = true;
					this.blocky.body.moves = false;
					this.cubey = this.cubes.create(i + 5, 330, 'jello');
					this.cubey.body.allowGravity = false;
					this.cubey.body.immovable = true;
					this.cubey.body.moves = false;
					this.cubey.alpha = .8;
					q = j;
				}
				else if(j == 8){
					this.block = this.blocks.create(i, 215, 'cookie');
					this.block.body.allowGravity = false;
					this.block.body.immovable = true;
					this.block.body.moves = false;
					this.cubey = this.cubes.create(i + 5, 130, 'jello');
					this.cubey.body.allowGravity = false;
					this.cubey.body.immovable = true;
					this.cubey.body.moves = false;
					this.cubey.alpha = .8;
					q = 8;
				}
				else if (j == 9){
					this.block = this.blocks.create(i, 215, 'cookie');
					this.block.body.allowGravity = false;
					this.block.body.immovable = true;
					this.block.body.moves = false;
					this.cubey = this.cubes.create(i + 5, 130, 'jello');
					this.cubey.body.allowGravity = false;
					this.cubey.body.immovable = true;
					this.cubey.body.moves = false;
					this.cubey.alpha = .8;
					q = 9;
				}
			}
		}
		tooManyBlanks = tooManyBlanks + 1;
	}
},

killBlock : function(cake, block){
	if(block.body.x - 50 < this.cake.body.x + 300){
		dan = block.body.x;
		arin = block.body.y;
		block.destroy();
		var cracky = this.add.sprite(dan,arin, 'crumbs');
		cracky.body.allowGravity = false;
		cracky.body.velocity.y = 200; 
		if(this.mute == 0){
			this.crumbNoise.play();
		}
	}
},


killCube : function(cake, cube){
	if(cube.body.x - 45 < this.cake.body.x + 300){
		dan = cube.body.x;
		arin = cube.body.y;
		cube.destroy();
		var cuby = this.add.sprite(dan,arin, 'cubelets');
		cuby.body.allowGravity = false;
		cuby.body.velocity.y = 200; 
	}
},

gameOver : function() {
	if(this.mute == 0){
		this.loseNoise.play();
	}
    this.overText.visible = true;
	if(this.score > this.highScore){
		this.saveGame();
	}
	this.score = 0;
	this.speed = 1;
	this.gameDone = 2;
	this.time.events.remove(this.pineFall, this);
	this.time.events.remove(this.starBomb, this);
	this.music.stop();
	this.losses = this.losses + 1;
	this.player.destroy();
},

restart : function(){
	if(this.gameDone == 1 || this.gameDone == 2){
		if(this.gameDone == 2){
			dan = this.overText.body.x;
			arin = this.overText.body.y;
			this.overText.destroy();
			var cracky = this.add.sprite(210 + 360,arin + 15, 'crumbs2');
			cracky.body.allowGravity = false;
			cracky.body.velocity.y = 200; 
			var cracky = this.add.sprite(210 + 120,arin+ 15, 'crumbs2');
			cracky.body.allowGravity = false;
			cracky.body.velocity.y = 200; 
			var cracky = this.add.sprite(210 + 160,arin+ 15, 'crumbs2');
			cracky.body.allowGravity = false;
			cracky.body.velocity.y = 200; 
			var cracky = this.add.sprite(210 + 200,arin+ 15, 'crumbs2');
			cracky.body.allowGravity = false;
			cracky.body.velocity.y = 200; 
			var cracky = this.add.sprite(210 + 240,arin+ 15, 'crumbs2');
			cracky.body.allowGravity = false;
			cracky.body.velocity.y = 200; 
			var cracky = this.add.sprite(210 + 280,arin+ 15, 'crumbs2');
			cracky.body.allowGravity = false;
			cracky.body.velocity.y = 200; 
			var cracky = this.add.sprite(210 + 320,arin + 15, 'crumbs2');
			cracky.body.allowGravity = false;
			cracky.body.velocity.y = 200; 
		}
		if(this.mute == 0){
			this.crumbNoise.play();
		}
		this.cake.destroy();
		this.player = this.add.sprite(600, 0, 'dude');
		this.player.body.velocity.x = 0;
		this.player.body.minVelocity.y = 5;
		this.player.body.collideWorldBounds = true;
		this.player.body.setRectangle(16, 32, 8, 16);
		this.player.animations.add('left', [0, 1, 2, 3], 10, true);
		this.player.animations.add('turn', [4], 20, true);
		this.player.animations.add('right', [5, 6, 7, 8], 10, true);
		this.winText.destroy();
		this.flow1.visible = false;
		this.flow2.visible = false;
		this.pineapples.destroy();
		this.cubes.destroy();
		this.cubes = this.add.group();
		this.blocks.destroy();
		this.blocks = this.add.group();
		this.cPudding.revive();
		this.vPudding.revive();
		this.makeBlock();
		this.stars.destroy();
		this.fast = 0;
		this.fluid = 0;
		this.playWin.y = 4400;
		this.playWin.x = 750;
		this.gameDone = 0;
		this.createThing = 0;
		this.music.play();
		this.rumble.play();
		this.stars = this.add.group();
		this.pineapples = this.add.group();
		this.pineFall = this.time.events.loop((Phaser.Timer.SECOND * 3) / this.speed,  this.createPine, this);
		this.screen.destroy();
		this.screen = this.add.sprite(0, 0, 'screen');
		this.screen.fixedToCamera = true;
		this.screen.visible = false;
		this.winText = this.add.sprite(300, 275,'game_win_text');
		this.winText.visible = false;
		this.winText.body.allowGravity = false;
		this.winText.fixedToCamera = true;
		this.cake = this.add.sprite(150,0, 'cake');
		this.overText = this.add.sprite(210, 200,'cookieOver');
		this.overText.visible = false;
		this.overText.body.allowGravity = false;
		this.overText.fixedToCamera = true;
		this.doneCracked = 0;
	}
},

gameWin : function() {
	if(this.mute == 0){
		this.gotNoise.play();
	}
    this.winText.visible = true;
	this.flow1.visible = true;
	this.flow2.visible = true;
	this.score = this.score + 1;
    this.gameDone = 1;
	this.speed = this.speed + .25;
	this.playWin.x = 4420;
	this.playWin.y = this.player.y-50;
	this.player.destroy();
	this.time.events.remove(this.pineFall, this);
	this.time.events.remove(this.starBomb, this);
	this.music.stop();
	this.rumble.stop();
},

createPine : function() {  
  this.pineapple = this.pineapples.create(3700, Math.random() * (500 - 90) + 90, 'pineapple');
  this.pineapple.outOfBoundsKill = true;
  this.pineapple.body.allowGravity = false;
  this.pineapple.body.velocity.x = -300;
},

starGen : function() {  
  var bip;
  if (this.facing == 'left'){
	bip = this.player.x + 10;
  }
  else{
	bip = this.player.x + 10;
  }
  var starry = this.stars.create(bip, Math.random() * (this.player.y + 30 - (this.player.y + 10)) + (this.player.y + 10), 'starSmall');
  starry.body.angularVelocity = 100;
  starry.body.allowGravity = false;
  starry.body.velocity.y = 200; 
},


muteSound : function() {  
  if(this.mute == 0){
	this.music.volume = 0;
	this.rumble.volume = 0;
	this.soundOn.visible = false;
	this.mute = 1;
  }
  else{
	this.music.volume = .4;
	this.rumble.volume = .4;
	this.soundOn.visible = true;
	this.mute = 0;
  }
},

saveGame: function()
{
    this.gameSave.highScore = this.score;
    localStorage.setItem('user', JSON.stringify(this.gameSave));
    console.log(JSON.parse(localStorage.getItem('user')));
	this.highScore = this.score;
},
/*function render () {
    if (player.debug)
    {
        game.debug.renderPhysicsBody(player.body);
        game.debug.renderBodyInfo(player, 16, 24);
    }
}*/
};