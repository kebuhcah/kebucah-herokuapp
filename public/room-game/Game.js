RoomGame.Game = function () {
    this.hero;

    this.upKey;
    this.downKey;
    this.leftKey;
    this.rightKey;
};

var SPEED = 200;

RoomGame.Game.prototype = {

    init: function () {

    },

    preload: function () {

    },

    create: function () {

        this.game.stage.backgroundColor = "#4488AA";

        hero = this.add.sprite(400, 300, 'hero');
        hero.anchor.setTo(0.5, 0.5);

        hero.animations.add('right', [0, 1], 4, true);
        hero.animations.add('front', [2, 3], 4, true);
        hero.animations.add('left', [4, 5], 4, true);
        hero.animations.add('back', [6, 7], 4, true);
        hero.animations.add('standing', [8, 9], 2, true);

        hero.animations.play('standing');

        this.game.physics.enable(hero, Phaser.Physics.ARCADE);

        upKey = game.input.keyboard.addKey(Phaser.Keyboard.UP);
        downKey = game.input.keyboard.addKey(Phaser.Keyboard.DOWN);
        leftKey = game.input.keyboard.addKey(Phaser.Keyboard.LEFT);
        rightKey = game.input.keyboard.addKey(Phaser.Keyboard.RIGHT);

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

        if (hero.x < 0)
            hero.x += 800;
        if (hero.x > 800)
            hero.x -= 800;
        if (hero.y < 0)
            hero.y += 600;
        if (hero.y > 600)
            hero.y -= 600;
    },

    render: function () {


    }
}
