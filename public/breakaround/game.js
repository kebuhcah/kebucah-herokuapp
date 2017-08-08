var BreakAround = {}

var BALL_VELOCITY = 300;

BreakAround.Game = function () {
    this.paddle;
    this.ball;
    this.emojis;

    this.radius;
    this.ballSize;
    this.graphics;

    this.score;
    this.scoreText;

    this.alreadyIntersected;
};

BreakAround.Game.prototype = {

    init: function () {

        this.input.maxPointers = 1;

        this.scale.pageAlignHorizontally = true;
        this.scale.pageAlignVertically = true;

        radius = this.game.width / 2;

    },

    preload: function () {

        this.load.path = 'assets/';

        ballSize = 23;

        alreadyIntersected = false;

        this.load.images(['paddle', 'ball', 'hotdog', 'emoji', 'background']);

    },

    create: function () {
        var background = this.add.image(radius, radius, 'background');
        background.anchor.setTo(0.5, 0.5);

        paddle = this.add.sprite(radius, radius, 'hotdog');
        paddle.anchor.setTo(0.5, 0.5);
        this.game.physics.enable(paddle, Phaser.Physics.ARCADE);

        ball = this.add.sprite(radius, radius, 'ball');
        ball.anchor.setTo(0.5, 0.5);
        this.game.physics.enable(ball, Phaser.Physics.ARCADE);
        ball.body.setCircle(ballSize);

        emojis = this.add.group();
        for (var i = 0; i < 20; i++) {
            var p = new Phaser.Point();
            var c = new Phaser.Circle(radius, radius, 450);
            c.random(p);
            var emoji = emojis.create(p.x, p.y, 'emoji');
            emoji.anchor.setTo(0.5, 0.5);
            this.game.physics.enable(emoji, Phaser.Physics.ARCADE);
            emoji.body.setCircle(25);
        }

        var theta = this.rnd.realInRange(-Math.PI, Math.PI);
        ball.body.velocity.x = BALL_VELOCITY * Math.cos(theta);
        ball.body.velocity.y = BALL_VELOCITY * Math.sin(theta);

        score = 0;
        scoreText = this.add.text(10, 10, 'Score: 0', {
            'fill': 'white'
        });



        this.game.input.x = radius;
        this.game.input.y = radius * 2;

        graphics = game.add.graphics(0, 0);

    },

    update: function () {
        
        ball.rotation += Math.PI / 10;

        var angleFromCenter = this.game.math.angleBetween(radius, radius,
            this.game.input.x, this.game.input.y);

        paddle.rotation = angleFromCenter - Math.PI / 2;

        paddle.x = radius + Math.cos(angleFromCenter) * (radius * 0.8);
        paddle.y = radius + Math.sin(angleFromCenter) * (radius * 0.8);


        var paddleCos = Math.cos(paddle.rotation) * 95;
        var paddleSin = Math.sin(paddle.rotation) * 95;
        var ballTheta = this.game.math.angleBetween(radius, radius, ball.x, ball.y);
        var ballCos = Math.cos(ballTheta) * ballSize;
        var ballSin = Math.sin(ballTheta) * ballSize;

        var paddleLine = new Phaser.Line(paddle.x - paddleCos, paddle.y - paddleSin, paddle.x + paddleCos, paddle.y + paddleSin);
        var ballLine = new Phaser.Line(ball.x - ballCos, ball.y - ballSin, ball.x + ballCos, ball.y + ballSin);

        if (ballLine.intersects(paddleLine)) {
            if (!alreadyIntersected) {

                var ballMovementLine = new Phaser.Line(0, 0, ball.body.velocity.x, ball.body.velocity.y);

                var reflectAngle = ballMovementLine.reflect(paddleLine);

                ball.body.velocity.x = BALL_VELOCITY * Math.cos(reflectAngle);
                ball.body.velocity.y = BALL_VELOCITY * Math.sin(reflectAngle);

            }
            alreadyIntersected = true;
        } else {
            alreadyIntersected = false;
        }

        if (ball.x < 0 || ball.x > radius * 2 || ball.y < 0 || ball.y > radius * 2) {
            ball.x = radius;
            ball.y = radius;

            var theta = this.rnd.realInRange(-Math.PI, Math.PI);
            ball.body.velocity.x = BALL_VELOCITY * Math.cos(theta);
            ball.body.velocity.y = BALL_VELOCITY * Math.sin(theta);

        }

        this.game.physics.arcade.overlap(emojis, ball, function (e, b) {
            b.kill();
            score++;
        }, null, this);

        scoreText.setText('Score: ' + score);

        if (emojis.countLiving() === 0) {
            for (var i = 0; i < 20; i++) {
                var p = new Phaser.Point();
                var c = new Phaser.Circle(radius, radius, 450);
                c.random(p);
                var emoji = emojis.create(p.x, p.y, 'emoji');
                emoji.anchor.setTo(0.5, 0.5);
                this.game.physics.enable(emoji, Phaser.Physics.ARCADE);
                emoji.body.setCircle(25);
            }
        }
    },

    render: function () {


        graphics.clear();
        graphics.lineStyle(1, 0xcccccc, 1);
        graphics.moveTo(radius, radius);
        graphics.lineTo(paddle.x, paddle.y);

        /*var paddleCos = Math.cos(paddle.rotation) * 95;
        var paddleSin = Math.sin(paddle.rotation) * 95;
        graphics.lineStyle(10, 0xffff00, 1);
        graphics.moveTo(paddle.x - paddleCos, paddle.y - paddleSin);
        graphics.lineTo(paddle.x + paddleCos, paddle.y + paddleSin);

        var ballTheta = this.game.math.angleBetween(radius, radius, ball.x, ball.y);
        var ballCos = Math.cos(ballTheta) * ballSize;
        var ballSin = Math.sin(ballTheta) * ballSize;

        graphics.moveTo(ball.x - ballCos, ball.y - ballSin);
        graphics.lineTo(ball.x + ballCos, ball.y + ballSin);


        var ballMovementLine = new Phaser.Line(0, 0, ball.body.velocity.x, ball.body.velocity.y);
        var paddleLine = new Phaser.Line(paddle.x - paddleCos, paddle.y - paddleSin, paddle.x + paddleCos, paddle.y + paddleSin);

        var reflect = ballMovementLine.reflect(paddleLine);

        graphics.lineStyle(3, 0xff0000, 1);
        graphics.moveTo(paddle.x, paddle.y);
        graphics.lineTo(paddle.x + Math.cos(reflect) * 200, paddle.y + Math.sin(reflect) * 200);

        this.game.debug.body(paddle);
        this.game.debug.body(ball);*/

    }

};


var game = new Phaser.Game(600, 600, Phaser.AUTO, 'game');

game.state.add('BreakAround.Game', BreakAround.Game);

game.state.start('BreakAround.Game');
