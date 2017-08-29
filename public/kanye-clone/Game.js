KanyeZone.Game = function () {
    this.kanye;
    this.nextKanye;
    this.nextKanyeArrow;

    this.cashEmitter;

    this.canvasBg;

    this.innerZone;
    this.outerZone;
    this.blocker;

    this.blockerRotation;

    this.nextKanyeDirection;
    this.nextKanyeX;
    this.nextKanyeY;

    this.leftKey;
    this.rightKey;
    this.spaceKey;

    this.motionSign;

    this.dontLetMeSound;
    this.warpSound;
    this.borgSound;
    this.lossSound;
    this.inflateSound;
};

var KANYE_SPEED = 200;

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
            warpSound.play();
        }, this);

        motionSign = 0;

        dontLetMeSound = this.game.add.audio('dontletme');
        dontLetMeSound.play('', 0, 2, true);

        borgSound = this.game.add.audio('borg');
        warpSound = this.game.add.audio('warp');
        lossSound = this.game.add.audio('zoneloss');
        inflateSound = this.game.add.audio('inflate');

        var outerBmd = game.add.bitmapData(200, 200);
        outerBmd.circle(100, 100, 100, '#c4a3fb');
        outerZone = this.add.sprite(this.world.centerX, this.world.centerY, outerBmd);
        outerZone.anchor.setTo(0.5, 0.5);
        outerZone.scale.setTo(0.55, 0.55);

        var innerBmd = game.add.bitmapData(200, 200);
        innerBmd.circle(100, 100, 100, '#ba9bee');
        innerZone = this.add.sprite(this.world.centerX, this.world.centerY, innerBmd);
        innerZone.anchor.setTo(0.5, 0.5);
        innerZone.scale.setTo(0.4, 0.4);

        var blockerBmd = game.add.bitmapData(50, 50);
        blockerBmd.circle(25, 25, 25, '#3399fe');
        blockerBmd.circle(25, 25, 20, '#3490ec');
        blocker = this.add.sprite(this.world.centerX, this.world.centerY - 80, blockerBmd);
        blocker.anchor.setTo(0.5, 0.5);

        this.game.physics.enable(blocker, Phaser.Physics.ARCADE);
        blocker.body.setCircle(25);

        /*
        outerTween.yoyo(true, 0);
        var innerTween = this.game.add.tween(innerZone.scale).to({
            x: 0.2,
            y: 0.2
        }, 5000, "Linear", true, 0, -1);
        innerTween.yoyo(true, 0);*/

        nextKanyeDirection = Math.PI * (this.rnd.realInRange(1 / 6, 1 / 3) + this.rnd.pick([0, 0.5, 1, 1.5]));
        nextKanyeX = 225 + this.rnd.integerInRange(100, 150) * this.rnd.pick([-1, 1]);
        nextKanyeY = 225 + this.rnd.integerInRange(100, 150) * this.rnd.pick([-1, 1]);
        nextKanye = this.add.sprite(nextKanyeX, nextKanyeY, 'kanyeSilo');
        nextKanye.anchor.setTo(0.5, 0.5);
        nextKanyeArrow = this.add.sprite(nextKanyeX, nextKanyeY, 'kanyeArrow');
        nextKanyeArrow.rotation = nextKanyeDirection - Math.PI;
        nextKanyeArrow.anchor.setTo(0.5, 0.5);

        kanye = this.add.sprite(200, 50, 'kanye');
        kanye.anchor.setTo(0.5, 0.5);
        kanye.animations.add('blablabla', [0, 1], 4, true);
        kanye.animations.play('blablabla');
        this.game.physics.enable(kanye, Phaser.Physics.ARCADE);
        kanye.body.collideWorldBounds = true;
        kanye.body.allowGravity = false;
        kanye.body.enable = true;

        var kanyeDirection = this.rnd.angle();
        kanye.body.velocity.x = Math.cos(kanyeDirection) * KANYE_SPEED;
        kanye.body.velocity.y = Math.sin(kanyeDirection) * KANYE_SPEED;
        kanye.body.bounce.x = 1;
        kanye.body.bounce.y = 1;

        cashEmitter = game.add.emitter(kanye.x, kanye.y, 100);
        cashEmitter.makeParticles('cash');
        cashEmitter.minParticleSpeed.setTo(-200, -200);
        cashEmitter.maxParticleSpeed.setTo(200, 200);
        cashEmitter.gravity = 0;
        cashEmitter.minRotation = 0;
        cashEmitter.maxRotation = 0;

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
        game.physics.arcade.overlap(kanye, blocker, function (kanye, blocker) {
            cashEmitter.x = kanye.x;
            cashEmitter.y = kanye.y;
            cashEmitter.start(true, 1000, 15, 10);

            borgSound.play();

            kanye.body.velocity.x = Math.cos(nextKanyeDirection) * KANYE_SPEED;
            kanye.body.velocity.y = Math.sin(nextKanyeDirection) * KANYE_SPEED;
            kanye.x = nextKanyeX;
            kanye.y = nextKanyeY;

            nextKanyeDirection = Math.PI * (this.rnd.realInRange(1 / 6, 1 / 3) + this.rnd.pick([0, 0.5, 1, 1.5]));
            nextKanyeX = 225 + this.rnd.integerInRange(100, 150) * this.rnd.pick([-1, 1]);
            nextKanyeY = 225 + this.rnd.integerInRange(100, 150) * this.rnd.pick([-1, 1]);
            nextKanye.x = nextKanyeX;
            nextKanye.y = nextKanyeY;
            nextKanyeArrow.rotation = nextKanyeDirection - Math.PI;
            nextKanyeArrow.x = nextKanyeX;
            nextKanyeArrow.y = nextKanyeY;

            innerZone.scale.x += 0.1;
            innerZone.scale.y += 0.1;

            if (innerZone.scale.x >= outerZone.scale.x) {
                innerZone.scale.setTo(0.1, 0.1);
                var outerTween = this.game.add.tween(outerZone.scale).to({
                    x: outerZone.scale.x + 0.1,
                    y: outerZone.scale.y + 0.1
                }, 2000, "Linear", true);
                inflateSound.play();
            }

        }, null, this);

        if (this.math.distance(kanye.x, kanye.y, this.world.centerX, this.world.centerY) < 100 * innerZone.scale.x + 28) {
            this.camera.shake(0.05, 500);
            this.camera.flash(0xff0000, 500);

            kanye.body.velocity.x = Math.cos(nextKanyeDirection) * KANYE_SPEED;
            kanye.body.velocity.y = Math.sin(nextKanyeDirection) * KANYE_SPEED;
            kanye.x = nextKanyeX;
            kanye.y = nextKanyeY;

            nextKanyeDirection = Math.PI * (this.rnd.realInRange(1 / 6, 1 / 3) + this.rnd.pick([0, 0.5, 1, 1.5]));
            nextKanyeX = 225 + this.rnd.integerInRange(100, 150) * this.rnd.pick([-1, 1]);
            nextKanyeY = 225 + this.rnd.integerInRange(100, 150) * this.rnd.pick([-1, 1]);
            nextKanye.x = nextKanyeX;
            nextKanye.y = nextKanyeY;
            nextKanyeArrow.rotation = nextKanyeDirection - Math.PI;
            nextKanyeArrow.x = nextKanyeX;
            nextKanyeArrow.y = nextKanyeY;


            outerZone.scale.setTo(0.55, 0.55);
            innerZone.scale.setTo(0.4, 0.4);

            lossSound.play();
        }

        if (rightKey.isDown && motionSign <= 0) {
            blockerRotation -= 0.1;
            motionSign = -1;
        } else if (leftKey.isDown && motionSign >= 0) {
            blockerRotation += 0.1;
            motionSign = 1;
        } else {
            motionSign = 0;
        }

        blocker.x = this.world.centerX + Math.cos(blockerRotation) * (outerZone.scale.x * 100 + 5 + 25);
        blocker.y = this.world.centerY - Math.sin(blockerRotation) * (outerZone.scale.y * 100 + 5 + 25);


    },

    render: function () {

        //this.game.debug.body(kanye);
        //this.game.debug.body(blocker);
        //this.game.debug.body(innerZone);
    }
}
