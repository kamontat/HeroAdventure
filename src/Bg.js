var MainBg = cc.Sprite.extend({
    ctor: function() {
        this._super();
        this.initWithFile('res/Others/MainBackground.png');
    }
});

var UpgradeBg = cc.Sprite.extend({
    ctor: function() {
        this._super();
        this.initWithFile('res/Others/UpgradeBackground.png');
    }
});
