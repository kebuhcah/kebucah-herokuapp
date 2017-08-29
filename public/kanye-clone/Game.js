KanyeZone.Game = function () {
    this.kanye;

    this.leftKey;
    this.rightKey;

    this.dontLetMeSound;
};


KanyeZone.Game.prototype = {

    init: function () {

    },

    preload: function () {

    },

    create: function () {

        this.game.stage.backgroundColor = "#000000";

        kanye = this.add.sprite(200, 50, 'kanye');
        kanye.anchor.setTo(0, 0);

        kanye.animations.add('blablabla', [0, 1], 4, true);

        kanye.animations.play('blablabla');

        this.game.physics.enable(kanye, Phaser.Physics.ARCADE);


        leftKey = game.input.keyboard.addKey(Phaser.Keyboard.LEFT);
        rightKey = game.input.keyboard.addKey(Phaser.Keyboard.RIGHT);

        kanye.body.collideWorldBounds = true;
        kanye.body.allowGravity = true;
        kanye.body.enable = true;
        kanye.body.velocity.x = 100;
        kanye.body.bounce.x = 1.1;
        kanye.body.bounce.y = 1;

        game.physics.arcade.gravity.y = 1000;

        dontLetMeSound = this.game.add.audio('dontletme');

        dontLetMeSound.play('', 0, 2, true);

        /*score = 0;
        highScore = 0;
        var textStyle = {
            'fill': 'white',
            'font': '10pt Courier New'
        };

        scoreText = this.add.text(790, 10, 'Score: 0\nHigh Score: 0', textStyle);
        scoreText.anchor.setTo(1, 0);*/
    },

    update: function () {


    },

    render: function () {


    }
}
