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
    this.pointSound;

    this.nextSize;
    this.countDown;

    this.score;
    this.highScore;
    this.scoreText;
};

var SPEED = 750;
var MAX_SPEED = 1000; // pixels/second
var MIN_DISTANCE = 32; // pixels


RoomGame.Game.prototype = {

    init: function () {

    },

    preload: function () {

    },

    create: function () {

        this.game.stage.backgroundColor = "#4488AA";

        hero = this.add.sprite(0, 0, 'hero');
        hero.anchor.setTo(0, 0);
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

        this.prepBlock();
        orientation = 1;

        bounceSound = this.game.add.audio('bounce');
        spawnSound = this.game.add.audio('spawn');
        deathSound = this.game.add.audio('death');
        pointSound = this.game.add.audio('point');

        score = 0;
        highScore = 0;
        var textStyle = {
            'fill': 'white',
            'font': '10pt Courier New'
        };

        scoreText = this.add.text(790, 10, 'Score: 0\nHigh Score: 0', textStyle);
        scoreText.anchor.setTo(1, 0);
    },

    update: function () {

        if (this.input.activePointer.isDown) {
            // mouse-following code based on https://gamemechanicexplorer.com/#follow-1
            var distance = this.game.math.distance(hero.x, hero.y, this.game.input.x, this.input.y);

            window.console.log(distance);

            // If the distance > MIN_DISTANCE then move
            if (distance > MIN_DISTANCE) {
                window.console.log("MOVING");

                // Calculate the angle to the target
                var rotation = this.game.math.angleBetween(hero.x, hero.y, this.game.input.x, this.game.input.y);

                // Calculate velocity vector based on rotation and this.MAX_SPEED
                hero.body.velocity.x = Math.cos(rotation) * MAX_SPEED;
                hero.body.velocity.y = Math.sin(rotation) * MAX_SPEED;
            } else {
                hero.body.velocity.setTo(0, 0);
            }

            if (hero.body.velocity.x > 0 && hero.body.velocity.x > Math.abs(hero.body.velocity.y)) {
                hero.animations.play('right');
            } else if (hero.body.velocity.x < 0 && -hero.body.velocity.x > Math.abs(hero.body.velocity.y)) {
                hero.animations.play('left');
            } else if (hero.body.velocity.y > 0 && hero.body.velocity.y > Math.abs(hero.body.velocity.x)) {
                hero.animations.play('front');
            } else if (hero.body.velocity.y < 0 && -hero.body.velocity.y > Math.abs(hero.body.velocity.x)) {
                hero.animations.play('back');
            } else {
                hero.animations.play('standing');
            }
        } else {


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
        }

        game.physics.arcade.collide(hero, blocks, function (hero, block) {
            if (block.scale.x > 0.25) {
                block.kill();
                hero.x = 0;
                hero.y = 0;
                deathSound.play();
                game.camera.shake(0.05, 500);
                score = 0;
                scoreText.setText('Score: ' + score + '\nHigh Score: ' + highScore);
            } else {
                block.kill();
                pointSound.play();
                score++;
                if (highScore < score)
                    highScore = score;
                scoreText.setText('Score: ' + score + '\nHigh Score: ' + highScore);
            }
        }, null, this);
        game.physics.arcade.collide(blocks, blocks, function (b1, b2) {
            if (b1.scale.x > 0.25 && b1.scale.x === b2.scale.x) {
                b1.kill();
                b2.kill();
            }
        }, null, this);

        countDown--;
        if (countDown === 0) {
            this.spawnBlock(nextSize);
            this.prepBlock();
        }
    },

    render: function () {


    },

    spawnBlock: function (size) {
        var block = blocks.create(750, 150, 'block');

        block.anchor.setTo(0.5, 0.5);
        block.scale.x = size;
        block.scale.y = size;

        this.game.physics.enable(block, Phaser.Physics.ARCADE);

        block.body.enable = true;
        block.body.collideWorldBounds = true;
        block.body.bounce.x = 1;
        block.body.bounce.y = 1;
        block.body.velocity.x = -game.rnd.integerInRange(250, 500);

        orientation *= -1;

        block.tint = Math.random() * 0xaaaaaa + 0x666666;

        spawnSound.play();
    },

    prepBlock: function () {
        var factor = ([1, 2, 2, 2, 2, 4, 4, 4, 4, 4, 4, 4, 4][game.rnd.integerInRange(0, 12)]);
        nextSize = 1 / factor;
        countDown = 120 / factor;
    }
}
