Eyeballz.Preload = function (game) {
    this.preloadBar = null;
    this.ready = false;
}

Eyeballz.Preload.prototype = {
    preload: function () {
        //this.preloadBar = this.add.sprite(this.world.centerX, this.world.centerY, 'hotdog');
        //this.preloadBar.anchor.setTo(0.5, 0.5);
        //this.load.setPreloadSprite(this.preloadBar);

        this.load.path = 'assets/';
        this.load.audio('bounce', ['bounce.wav']);
        this.load.audio('spawn', ['spawn.wav']);
        this.load.audio('point', ['point.wav']);
        this.load.audio('death', ['death.wav']);
        this.load.spritesheet('eyeball', 'eyeballz.png', 200, 141, 6);

        this.load.images(['block']);
    },

    create: function () {
        //this.preloadBar.cropEnabled = false;
    },

    update: function () {
        if (this.cache.isSoundDecoded('bounce') &&
            this.cache.isSoundDecoded('spawn') &&
            this.cache.isSoundDecoded('point') &&
            this.cache.isSoundDecoded('death') && this.ready == false) {
            this.ready = true;
        }

        this.state.start('Eyeballz.Game');

    }
}
