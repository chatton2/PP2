

BasicGame.Game = function (game) {
this.map;
this.tileset;
this.layer;
this.player;
this.facing = 'left';
this.jumpTimer = 0;
this.jumTimer = 0;
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
this.crumbNoise;
this.blocks;
this.speed = 1;
};

BasicGame.Game.prototype = {

preload: function(){
	this.load.tilemap('level1', 'assets/level_1.json', null, Phaser.Tilemap.TILED_JSON);
    this.load.image('tiles-1', 'assets/tiles-1.png');
    this.load.spritesheet('dude', 'assets/panda.png', 32, 48);
    this.load.spritesheet('droid', 'assets/droid.png', 32, 32);
    this.load.image('starSmall', 'assets/star.png');
	this.load.image('starBig', 'assets/star2.png');
    this.load.image('background', 'assets/background_wide.png');
	this.load.image('cake', 'assets/pineapple_upside_down_cake.png');
	this.load.image('pudding', 'assets/pudding2.png');
	this.load.image('panWin', 'assets/panda_win.png');
	this.load.image('bottom_not', 'assets/bottom_not.png');
	this.load.image('bottom_top', 'assets/bottom_top.png');
	this.load.image('not_top', 'assets/not_top.png');
	this.load.image('cookie', 'assets/cracker.png');
	this.load.image('crumbs', 'assets/crumbs.png');
	this.load.image('cubelets', 'assets/cubelets.png');
	this.load.image('jello', 'assets/jello.png');
	this.load.image('glow', 'assets/fGlow.png');
	this.load.image('cPudding', 'assets/pudding2.png');
	this.load.image('flowerBig', 'assets/flower_big.png');
	this.load.image('flowerMed', 'assets/flower_mid.png');
	this.load.image('vPudding', 'assets/van_pudding.png');
	this.load.image('pineapple', 'assets/pineapple2.png');
//	this.load.audio('staccato', ['assets/staccato.ogg','assets/staccato.mp3']);
    this.load.audio('lose', ['assets/disenchant.mp3']);
    this.load.audio('got', ['assets/enchant.mp3']);
    this.load.audio('win', ['assets/arrow_and_splat.mp3']);
	this.load.audio('crumble', ['assets/crumbling.mp3']);
	this.load.audio('staccato', ['assets/background.mp3']);
	this.load.audio('rumble', ['assets/rumble.mp3']);
},

create : function() {
	//this.music = this.add.audio('staccato');
//	this.music.volume = 0.1;
 //   this.music.loop = true;
//	this.music.play();
	this.rumble = this.add.audio('rumble');
	this.rumble.volume = 1;
	this.rumble.play();
	this.loop = true;
	this.rumble.play;
	this.gameDone = 0;
    this.loseNoise = this.add.audio('lose',1,true);
    this.gotNoise = this.add.audio('got',2,true);
	this.crumbNoise = this.add.audio('crumble',2,true);
    this.winNoise = this.add.audio('win',2,true);
    this.stage.backgroundColor = '#000000';
 //   this.bg = this.add.tileSprite(0, 192, 2048, 1024, 'background');
	this.bg = this.add.sprite(0, 192,'background');
    this.map = this.add.tilemap('level1');
    this. map.addTilesetImage('tiles-1');
    this.map.setCollisionByExclusion([ 13, 14, 15, 16, 46, 47, 48, 49, 50, 51 ]);
    this.layer = this.map.createLayer('Tile Layer 1');
    this.layer.resizeWorld();
    this.physics.gravity.y = 500;
    this.physics.setBoundsToWorld();
    //this.pudding = this.add.sprite(850, 700, 'pudding');
   // this.pudding.body.collideWorldBounds = true;
	this.bg.body.collideWorldBounds = true;
    this.player = this.add.sprite(500, 0, 'dude');
    this.player.body.minVelocity.y = 5;
    this.player.body.collideWorldBounds = true;
    this.player.body.setRectangle(16, 32, 8, 16);
    this.player.animations.add('left', [0, 1, 2, 3], 10, true);
    this.player.animations.add('turn', [4], 20, true);
    this.player.animations.add('right', [5, 6, 7, 8], 10, true);
	//this.player.body.scaleTo(3, 3);
//	this.camera.follow(this.player);
    this.camera.x = 0;
    this.camera.y = -500;
	//this.bg.fixedToCamera = true;
    this.cursors = this.input.keyboard.createCursorKeys();
    this.jumpButton = this.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    this.introText = this.add.text(300, 300, '- click to start -', { font: "40px Tangerine", fill: "#FF0033", align: "center" });
	this.introText.visible = false;
	this.introText.fixedToCamera = true;
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
	this.scoreText = this.add.text(22, 570, 'Score: 0', { font: "30px Tangerine", fill: "#FF0033", align: "left" });
    this.scoreText.fixedToCamera = true;
	this.makeBlock(this);
	this.cake = this.add.sprite(0,0, 'cake');
	this.cake.body.collideWorldBounds = true;
/*	this.cubey = this.blocks.create(805, 330, 'jello');
	this.cubey.body.allowGravity = false;
	this.cubey.body.immovable = true;
	this.cubey.body.moves = false;*/
	this.speed = 1; //TEST 
	this.stuck = 0;
	this.fast = 0;
	this.fluid = 0;
	/*		this.block = this.blocks.create(600, 419, 'cookie');//TESTING CHANGE PLEASE 
this.block.body.allowGravity = false;
this.block.body.immovable = true;
this.block.body.moves = false;*/
/*	this.vPudding.x = 550;
	this.vPudding.y = 154;*/
	this.pineapples = this.add.group();
	this.createThing = 0;
},
update : function() { 
	if(this.createThing == 0){
		this.pineFall = this.time.events.loop((Phaser.Timer.SECOND * 3) / this.speed,  this.createPine, this);
		this.createThing = 1;
	}
	this.thing = this.input.onDown.add(this.restart, this);
	if(this.physics.overlap(this.player, this.cake)&& this.gameDone != 2 && this.cake.body.onFloor()){
		if(this.player.body.y != 464){
			this.gameOver(this);
		}
		else{
			if((this.player.body.x < this.cake.body.x + 300 && this.gameDone != 2 && this.cake.body.onFloor()) || (this.player.body.y > 700 && this.gameDone != 2)){
				this.gameOver(this);
			}
		}
	}
/*	if(this.player.body.y == 464){
		if((this.player.body.x < this.cake.body.x + 300 && this.gameDone != 2 && this.cake.body.onFloor()) || (this.player.body.y > 700 && this.gameDone != 2)){
			this.gameOver(this);
		}
	}*/
/*	else if(this.physics.overlap(this.player, this.cake)&& this.gameDone != 2 && this.cake.body.onFloor()){
		this.gameOver(this);
	}*/
		/*	if((Math.sqrt(((this.cake.body.x - this.player.body.x) * (this.cake.body.x - this.player.body.x)) + ((this.cake.body.y - this.player.body.y) * (this.cake.body.y - this.player.body.y)) < 200 && this.gameDone != 2 && this.cake.body.onFloor()) || (this.player.body.y > 700 && this.gameDone != 2)){
		this.gameOver(this);
	}*/
	if(this.player.body.x > 4400 && this.player.body.y < 200 && this.gameDone != 1 && this.gameDone != 2){
		this.gameWin(this);
	}
	if(this.gameDone == 1){// && this.jumTimer > this.time.now){	
		//this.playWin.body.allowGravity = false;
		if(this.playWin.body.y > 160){
			this.playWin.body.velocity.y = -200;
		}
	}
	if(this.physics.overlap(this.player, this.cPudding)){
		this.fluid = 1;
		this.cPudding.kill();
		this.player.alpha = .5;
		this.winNoise.play();
	}
	if(this.physics.overlap(this.player, this.vPudding)){
		this.fast = 1;
		this.vPudding.kill();
	//	this.player.addChild(this.glow);
/*		x = this.player.x;
		y = this.player.y;
		this.player.destroy();
		this.player = this.add.sprite(x, y, 'player2');
		this.player.body.minVelocity.y = 5;
		this.player.body.collideWorldBounds = true;
		this.player.body.setRectangle(16, 32, 8, 16);
		this.player.animations.add('left', [0, 1, 2, 3], 10, true);
		this.player.animations.add('turn', [4], 20, true);
		this.player.animations.add('right', [5, 6, 7, 8], 10, true);*/
		this.winNoise.play();
	}
	this.camera.y = 50;
	if(!this.physics.collide(this.player, this.blocks) || !this.player.body.onFloor()){
		this.camera.x = this.player.body.x - 500;
	}
	if(this.physics.overlap(this.player, this.cubes) && this.fluid == 0){
	//	this.player.velocity.x = 10;
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
	if(this.cake.body.onFloor()){
		//this.cake.body.rotation = 15 * 22/7/180;
		this.cake.body.angularVelocity = 50;
		this.cake.body.velocity.x = 300;
		this.cake.anchor.setTo(0.5, 0.5);
	}
	else{
		this.cake.body.velocity.x = 0;
	}
    if (this.cursors.left.isDown)
    {
		if(this.player.body.y > 460 || this.player.body.y == 367 || this.player.body.y == 167){
			if(this.stuck == 1){
				this.player.body.velocity.x = -50;
			}
			else if (this.fast == 1){
				this.player.body.velocity.x = -600;// * this.speed;
			}
			else{
				this.player.body.velocity.x = -500;// * this.speed;
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
        if(this.player.body.y > 460 || this.player.body.y == 367 || this.player.body.y == 167){ 
			if(this.stuck == 1){
				this.player.body.velocity.x = 50;
			}
			else if (this.fast == 1){
				this.player.body.velocity.x = 600;// * this.speed;
			}
			else{
				this.player.body.velocity.x = 500;// * this.speed;
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
    if (this.jumpButton.isDown && this.time.now > this.jumpTimer &&(this.physics.collide(this.player, this.blocks) || this.player.body.onFloor()))
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
	//	this.physics.collide(this.player, this.cubes);
	//	this.physics.collide(this.cubes, this.cubes);
	//	this.physics.collide(this.cubes, this.blocks);
		this.physics.collide(this.blocks, this.blocks);
		this.physics.collide(this.cake, this.layer);
		this.physics.collide(this.cPudding, this.layer);
		this.physics.collide(this.cPudding, this.blocks);
		this.physics.collide(this.vPudding, this.layer);
		this.physics.collide(this.vPudding, this.blocks);
	//	this.physics.overlap(this.player, this.pudding, this.gameWin, null, this);
		this.physics.overlap(this.cake, this.blocks, this.killBlock, null, this);
		this.physics.overlap(this.cake, this.cubes, this.killCube, null, this);
		this.physics.overlap(this.player, this.pineapples, this.gameOver, null, this);
	}
	this.scoreText.content = 'Score: ' + this.score;
},

makeBlock : function(){
q = 4;
cPudOut = 0;
vPudOut = 0;
outCount = 0;
//this.cPudding.x = 600;
//this.cPudding.y = 422;
	/*this.cubey = this.cubes.create(600, 422, 'jello');
	this.cubey.body.allowGravity = false;
	this.cubey.body.immovable = true;
	this.cubey.body.moves = false;
	this.cubey.alpha = .8;*/
this.block = this.blocks.create(3900, 415, 'cookie');
this.block.body.allowGravity = false;
this.block.body.immovable = true;
this.block.body.moves = false;
	for(i = 4000; i < 4800; i = i + 100){
		this.block = this.blocks.create(i, 215, 'cookie');
		this.block.body.allowGravity = false;
		this.block.body.immovable = true;
		this.block.body.moves = false;
	}
for(i = 3800; i >= 700; i = i - 100){
		if(i == 700){
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
					//		this.cPud = this.cPudding.create(i + 18, 154, 'cPudding');	
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
	}
},

killBlock : function(cake, block){
	if(block.body.x - 50 < this.cake.body.x + 300){
		dan = block.body.x;
		arin = block.body.y;
		block.destroy();
		this.add.sprite(dan,arin, 'crumbs');
		this.crumbNoise.play();
	}
},

/*killCube : function(cake, cube){
	if(cube.body.x - 45 < this.cake.body.x + 300){
		dan = cube.body.x;
		arin = cube.body.y;
		cube.destroy();
		this.add.sprite(dan,arin, 'cubelets');
	}
},*/

killCube : function(cake, cube){
	if(cube.body.x - 45 < this.cake.body.x + 300){
		dan = cube.body.x;
		arin = cube.body.y;
		cube.destroy();
		this.add.sprite(dan,arin, 'cubelets');
	}
},

levelMake : function(){
	this.add.sprite(500,0, 'not_top');
	this.score = 10;
	this.scoreText.content = 'Score: ' + this.score;
},

gameOver : function() {
    this.loseNoise.play();
    this.introText.content = 'Game Over!';
    this.introText.visible = true;
	this.score = 0;
	this.speed = 1;
	this.gameDone = 2;
	this.time.events.remove(this.pineFall, this);
	this.player.destroy();
},

restart : function(){
	if(this.gameDone == 1 || this.gameDone == 2){
		this.player = this.add.sprite(500, 0, 'dude');
		this.player.body.minVelocity.y = 5;
		this.player.body.collideWorldBounds = true;
		this.player.body.setRectangle(16, 32, 8, 16);
		this.player.animations.add('left', [0, 1, 2, 3], 10, true);
		this.player.animations.add('turn', [4], 20, true);
		this.player.animations.add('right', [5, 6, 7, 8], 10, true);
		this.introText.visible = false;
		this.flow1.visible = false;
		this.flow2.visible = false;
		this.cubes.destroy();
		this.cubes = this.add.group();
		this.blocks.destroy();
		this.blocks = this.add.group();
		this.cPudding.revive();
		this.vPudding.revive();
		this.makeBlock();
		this.cake.destroy();
		this.cake = this.add.sprite(0,0, 'cake');
		this.cake.body.collideWorldBounds = true;
		this.fast = 0;
		this.fluid = 0;
		this.playWin.y = 4400;
		this.playWin.x = 750;
		this.gameDone = 0;
		this.createThing = 0;
	}
},

gameWin : function() {
    this.gotNoise.play();
    this.introText.content = 'You are In The Clear';
    this.introText.visible = true;
	this.flow1.visible = true;
	this.flow2.visible = true;
  //  this.pudding.kill();
	this.score = this.score + 1;
    this.gameDone = 1;
	this.speed = this.speed + .25;
	this.playWin.x = 4420;
	this.playWin.y = this.player.y-50;
//	this.tween = game.add.tween(this.playWin).to( { x: [4420, 4420], y: [this.player.y-50, this.player.y-200] }, 4000, "Linear",true);
	this.player.destroy();
	this.time.events.remove(this.pineFall, this);
},

createPine : function() {  
  this.pineapple = this.pineapples.create(3700, Math.random() * (500 - 90) + 90, 'pineapple');
  this.pineapple.body.allowGravity = false;
  this.pineapple.body.velocity.x = -300;
},
/*function render () {
    if (player.debug)
    {
        game.debug.renderPhysicsBody(player.body);
        game.debug.renderBodyInfo(player, 16, 24);
    }
}*/
};