var RoomGame = {}

RoomGame.Boot = function () {}

RoomGame.Boot.prototype = {
    preload: function () {
        this.input.maxPointers = 1;
        this.stage.disableVisibilityChange = false;
        this.scale.pageAlignHorizontally = true;
        this.scale.pageAlignVertically = true;

        //this.load.image('hotdog', 'assets/hotdog.png');
    },

    create: function () {
        this.state.start('RoomGame.Preload');
    }
}
