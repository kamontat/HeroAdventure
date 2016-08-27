//noinspection JSDuplicatedDeclaration
var Tap = cc.Sprite.extend({
    var: timer = 0,
    var: speed = 0,
    var: decrease = 0,

    ctor: function () {
        this._super();
        this.initWithFile('res/Mechanic/tap.png');

        this.setSpeed();
    },

    update: function (dt) {
        if (timer != 0) {
            timer++;
            if (timer % 60 == 0) {
                // FEATURE: 19/6/59 add speed for 0.09 in every second
                if (speed > 0)
                    speed += 0.09;
                else
                    speed -= 0.09;
            }
        }
        var pos = this.getPosition();
        if (pos.x <= 20) {
            speed *= -1;
        } else if (pos.x >= 780) {
            speed *= -1;
        }
        this.setPosition(new cc.Point(pos.x + speed, pos.y));
    },

    stop: function () {
        // hide the tap
        this.setOpacity(0);
        // un-update
        this.unscheduleUpdate()
    },

    isStop: function () {
        timer = 0;
        return (this.getOpacity() == 0) && (speed == 0);
    },

    start: function () {
        timer = 1;
        this.rePos();
        this.setOpacity(255);
        this.setSpeed();
        this.setStartPos();
        this.scheduleUpdate();
    },

    closeTo: function (obj) {
        var myPos = this.getPositionX();
        var oPos = obj.getPositionX();
        return (Math.abs(myPos - oPos) <= 15);
    },

    /**
     * set by using state and tSpeed
     */
    setSpeed: function () {
        // FEATURE: 18/6/59 increase speed every stage by 2
        speed = tSpeed + (stage * 2);
        if (decrease > Math.abs(speed)) {
            speed = 2;
        } else {
            speed = Math.abs(speed) - decrease;
        }
    },

    resetSpeed: function () {
        speed = 0;
        decrease = 0;
    },

    rePos: function () {
        var random = Math.round(Math.random() * 760);
        while (random <= 40) {
            random = Math.round(Math.random() * 760);
        }
        this.setPosition(new cc.Point(random, 150));
    },

    setStartPos: function () {

        var random = Math.round(Math.random() * 2);
        if (random == 0) {
            speed *= -1;
        }
    }
});

// create static method
Tap.decreaseSpeed = function () {
    speed = Math.abs(speed) - 2;
    decrease = speedUpgrade * 2;
};

Tap.getSpeed = function () {
    return Math.abs(speed).toFixed(2);
};