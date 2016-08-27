var Hero = cc.Sprite.extend({
    var: heroHp = heroHpDefault,
    var: heroPower = heroPowerDefault,

    ctor: function () {
        this._super();
        this.initWithFile('res/Character/char1.png');
    },

    resetHp: function () {
        heroHp = heroHpDefault;
    },

    resetPower: function () {
        heroPower = heroPowerDefault;
    },

    isDead: function () {
        return heroHp <= 0;
    }
});

Hero.getHp = function () {
    return Number(heroHp);
};

Hero.setHp = function (newHp) {
    heroHp = Number(newHp);
};

Hero.getPower = function () {
    return Number(heroPower);
};

Hero.setPower = function (newPower) {
    heroPower = Number(newPower);
};