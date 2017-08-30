Eyeballz.Game = function () {
    this.timer;
};


Eyeballz.Game.prototype = {

    init: function () {

    },

    preload: function () {

    },

    create: function () {

        this.game.stage.backgroundColor = "#ffffff";


        timer = 0;

        /*hero = this.add.sprite(0, 0, 'hero');
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
        scoreText.anchor.setTo(1, 0);*/
    },

    update: function () {
        if (timer % 60 == 0) {
            var eyeball = this.add.sprite(this.rnd.integerInRange(50, 750), this.rnd.integerInRange(50, 550), 'eyeball')
            eyeball.animations.add('blink', [0, 1, 2, 3, 4, 5], 4, true);
            //eyeball.animations.add('shut', [0], 4, true);
            //eyeball.animations.add('wide', [3], 4, true);
            //eyeball.animations.add('open', [0, 1, 2, 3], 4, true);
            //eyeball.animations.add('close', [3, 2, 1, 0], 4, true);

            var scale = this.rnd.realInRange(0.2, 0.8);
            eyeball.scale.setTo(scale, scale);
            eyeball.rotation = this.rnd.angle();

            eyeball.animations.play('blink');
        }

        timer++;


    },

    render: function () {


    }
}
