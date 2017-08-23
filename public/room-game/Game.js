RoomGame.Game = function () {
    this.hero;
    this.blocks;

    this.upKey;
    this.downKey;
    this.leftKey;
    this.rightKey;

    this.timer;
    this.orientation;

    this.bounceSound;
    this.spawnSound;
    this.deathSound;
};

var SPEED = 750;

RoomGame.Game.prototype = {

    init: function () {

    },

    preload: function () {

    },

    create: function () {

        this.game.stage.backgroundColor = "#4488AA";

        hero = this.add.sprite(400, 300, 'hero');
        hero.anchor.setTo(0.5, 0.5);
        hero.scale.x = 0.5;
        hero.scale.y = 0.5;

        hero.animations.add('right', [0, 1], 4, true);
        hero.animations.add('front', [2, 3], 4, true);
        hero.animations.add('left', [4, 5], 4, true);
        hero.animations.add('back', [6, 7], 4, true);
        hero.animations.add('standing', [8, 9], 2, true);

        hero.animations.play('standing');

        this.game.physics.enable(hero, Phaser.Physics.ARCADE);

        blocks = this.add.group();


        upKey = game.input.keyboard.addKey(Phaser.Keyboard.UP);
        downKey = game.input.keyboard.addKey(Phaser.Keyboard.DOWN);
        leftKey = game.input.keyboard.addKey(Phaser.Keyboard.LEFT);
        rightKey = game.input.keyboard.addKey(Phaser.Keyboard.RIGHT);


        hero.body.collideWorldBounds = true;
        hero.body.allowGravity = false;
        hero.body.enable = true;
        game.physics.arcade.gravity.y = 1000;

        timer = 0;
        orientation = 1;

        bounceSound = this.game.add.audio('bounce');
        spawnSound = this.game.add.audio('spawn');
        deathSound = this.game.add.audio('death');

    },

    update: function () {
        if (upKey.isDown) {
            hero.body.velocity.y = -SPEED;
            if (hero.body.velocity.x == 0)
                hero.animations.play('back');
        } else if (downKey.isDown) {
            hero.body.velocity.y = SPEED;
            if (hero.body.velocity.x == 0)
                hero.animations.play('front');
        } else {
            hero.body.velocity.y = 0;
        }

        if (leftKey.isDown) {
            hero.body.velocity.x = -SPEED;
            hero.animations.play('left');
        } else if (rightKey.isDown) {
            hero.body.velocity.x = SPEED;
            hero.animations.play('right');
        } else {
            hero.body.velocity.x = 0;
        }

        if (hero.body.velocity.x == 0 && hero.body.velocity.y == 0) {
            hero.animations.play('standing');
        }

        if (timer % 120 == 0) {
            this.spawnBlock();
        }
        timer++;


        game.physics.arcade.collide(hero, blocks, function (hero, blocks) {
            hero.kill();
            deathSound.play();
        }, null, this);
        game.physics.arcade.collide(blocks, blocks, function () {
            bounceSound.play();
        }, null, this);
    },

    render: function () {


    },

    spawnBlock: function () {
        var block = blocks.create(400, 100, 'block');

        block.anchor.setTo(0.5, 0.5);
        block.scale.x = 0.5;
        block.scale.y = 0.5;

        this.game.physics.enable(block, Phaser.Physics.ARCADE);

        block.body.enable = true;
        block.body.collideWorldBounds = true;
        block.body.bounce.x = 1;
        block.body.bounce.y = 1;
        block.body.velocity.x = orientation * 500;

        orientation *= -1;

        block.tint = Math.random() * 0x666666 + 0x666666;

        spawnSound.play();
    }
}
