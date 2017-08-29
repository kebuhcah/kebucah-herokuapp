KanyeZone.Preload = function (game) {
    this.preloadBar = null;
    this.ready = false;
}

KanyeZone.Preload.prototype = {
    preload: function () {
        //this.preloadBar = this.add.sprite(this.world.centerX, this.world.centerY, 'hotdog');
        //this.preloadBar.anchor.setTo(0.5, 0.5);
        //this.load.setPreloadSprite(this.preloadBar);

        this.load.path = 'assets/';
        this.load.audio('dontletme', ['audio/dontletme.ogg']);
        this.load.spritesheet('kanye', 'images/kanye.png', 56, 74, 2);

        this.load.images(['block']);
    },

    create: function () {
        //this.preloadBar.cropEnabled = false;
    },

    update: function () {
        if (this.cache.isSoundDecoded('dontletme') && this.ready == false) {
            this.ready = true;
        }

        this.state.start('KanyeZone.Game');

    }
}
