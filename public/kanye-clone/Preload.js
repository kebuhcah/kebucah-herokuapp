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
        this.load.audio('dontletme', 'audio/dontletme.ogg');
        this.load.audio('warp', 'audio/warp.ogg');
        this.load.audio('borg', 'audio/borg.ogg');
        this.load.audio('inflate', 'audio/inflate.ogg');
        this.load.audio('zoneloss', 'audio/zoneloss.ogg');

        this.load.spritesheet('kanye', 'images/kanye.png', 56, 74, 2);

        this.load.image('canvasbg','images/canvasbg.jpg');
        this.load.image('kanyeSilo','images/kanyeSilo.png');
        this.load.image('kanyeArrow','images/smallArrowBg.png');
        this.load.image('cash','images/cash.png');
    },

    create: function () {
        //this.preloadBar.cropEnabled = false;
    },

    update: function () {
        if (this.cache.isSoundDecoded('dontletme') &&
            this.cache.isSoundDecoded('warp') &&
            this.cache.isSoundDecoded('borg') &&
            this.cache.isSoundDecoded('inflate') &&
            this.cache.isSoundDecoded('zoneloss') &&
            this.ready == false) {
            this.ready = true;
        }

        this.state.start('KanyeZone.Game');

    }
}
