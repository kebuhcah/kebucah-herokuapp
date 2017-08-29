KanyeZone.Game = function () {
    this.kanye;

    this.canvasBg;

    this.innerZone;
    this.outerZone;
    this.blocker;

    this.blockerRotation;

    this.leftKey;
    this.rightKey;
    this.spaceKey;

    this.motionSign;

    this.dontLetMeSound;
};


KanyeZone.Game.prototype = {

    init: function () {

    },

    preload: function () {

    },

    create: function () {

        this.game.stage.backgroundColor = "#000000";

        blockerRotation = Math.PI / 2;

        canvasBg = this.add.sprite(this.world.centerX, this.world.centerY, 'canvasbg');
        canvasBg.anchor.setTo(0.5, 0.5);

        leftKey = game.input.keyboard.addKey(Phaser.Keyboard.LEFT);
        rightKey = game.input.keyboard.addKey(Phaser.Keyboard.RIGHT);
        spaceKey = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        spaceKey.onDown.add(function () {
            blockerRotation += Math.PI;
        }, this);

        motionSign = 0;

        dontLetMeSound = this.game.add.audio('dontletme');

        dontLetMeSound.play('', 0, 2, true);


        var outerBmd = game.add.bitmapData(100, 100);
        outerBmd.circle(50, 50, 50, '#c4a3fb');
        outerZone = this.add.sprite(this.world.centerX, this.world.centerY, outerBmd);
        outerZone.anchor.setTo(0.5, 0.5);

        var innerBmd = game.add.bitmapData(100, 100);
        innerBmd.circle(50, 50, 50, '#ba9bee');
        innerZone = this.add.sprite(this.world.centerX, this.world.centerY, innerBmd);
        innerZone.anchor.setTo(0.5, 0.5);

        var blockerBmd = game.add.bitmapData(50, 50);
        blockerBmd.circle(25, 25, 25, '#3399fe');
        blockerBmd.circle(25, 25, 20, '#3490ec');
        blocker = this.add.sprite(this.world.centerX, this.world.centerY - 80, blockerBmd);
        blocker.anchor.setTo(0.5, 0.5);

        var outerTween = this.game.add.tween(outerZone.scale).to({
            x: 1.5,
            y: 1.5
        }, 2000, "Linear", true, 0, -1);
        outerTween.yoyo(true, 0);
        var innerTween = this.game.add.tween(innerZone.scale).to({
            x: 0.2,
            y: 0.2
        }, 5000, "Linear", true, 0, -1);
        innerTween.yoyo(true, 0);


        kanye = this.add.sprite(200, 50, 'kanye');
        kanye.anchor.setTo(0, 0);
        kanye.animations.add('blablabla', [0, 1], 4, true);
        kanye.animations.play('blablabla');
        this.game.physics.enable(kanye, Phaser.Physics.ARCADE);
        kanye.body.collideWorldBounds = true;
        kanye.body.allowGravity = false;
        kanye.body.enable = true;

        var kanyeDirection = this.rnd.angle();
        kanye.body.velocity.x = Math.cos(kanyeDirection) * 100;
        kanye.body.velocity.y = Math.sin(kanyeDirection) * 100;
        kanye.body.bounce.x = 1;
        kanye.body.bounce.y = 1;

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
        if (rightKey.isDown && motionSign <= 0) {
            blockerRotation -= 0.1;
            motionSign = -1;
        } else if (leftKey.isDown && motionSign >= 0) {
            blockerRotation += 0.1;
            motionSign = 1;
        } else {
            motionSign = 0;
        }

        blocker.x = this.world.centerX + Math.cos(blockerRotation) * (outerZone.scale.x * 50 + 5 + 25);
        blocker.y = this.world.centerY - Math.sin(blockerRotation) * (outerZone.scale.y * 50 + 5 + 25);
    },

    render: function () {


    }
}
