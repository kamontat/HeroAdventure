var UpgradeLayer = cc.LayerColor.extend({
    init: function () {
        this._super(new cc.Color(127, 127, 127, 255));
        this.setPosition(new cc.Point(0, 0));
        this.backButton();
        this.createUpgradePointLabel();
        this.createHpUpgradeLabel();
        this.createPowerUpgradeLabel();
        this.createSpeedUpgradeLabel();
        this.hpButton();
        this.powerButton();
        this.speedButton();
        this.addKeyboardHandlers();
    },

    addKeyboardHandlers: function () {
        var self = this;
        cc.eventManager.addListener({
            event: cc.EventListener.KEYBOARD,
            onKeyPressed: function (keyCode, event) {
                self.onKeyDown(keyCode, event);
            }
        }, this);
    },

    onKeyDown: function (keyCode, event) {
        // number key '1'
        if (keyCode == 49 || keyCode == 97) {
            this.hpUpgrade();
            // number key '2'
        } else if (keyCode == 50 || keyCode == 98) {
            this.powerUpgrade();
            // number key '3'
        } else if (keyCode == 51 || keyCode == 99) {
            this.speedUpgrade();
        }

        if (keyCode == cc.KEY.escape) {
            cc.director.runScene(new StartScene());
        }
    },

    hpUpgrade: function () {
        if (upPoint > 0) {
            hpUpgrade += 1;
            upPoint -= 1;

            const hp = (Hero.getHp() + (3 * hpUpgrade * stage)).toFixed(0);
            const futureHp = (3 * (hpUpgrade + 1) * stage).toFixed(0);

            // FEATURE: 18/6/59 add hp (player upgrade)
            Hero.setHp(hp);

            this.upPointLabel.setString('Upgrade Point: ' + upPoint);
            this.hpUpLabel.setString('HP (' + GameLayer.getText(Hero.getHp()) + '+' + GameLayer.getText(Number(futureHp)) + '): ' + hpUpgrade);
        }
    },

    powerUpgrade: function () {

        if (upPoint > 0) {
            powerUpgrade += 1;
            upPoint -= 1;

            const power = (Hero.getPower() + ((3 / 2) * (powerUpgrade / 10) * (stage / 4))).toFixed(2);
            const futurePower = ((3 / 2) * ((powerUpgrade + 1) / 10) * (stage / 4)).toFixed(3);

            // FEATURE: 18/6/59 add power (player upgrade)
            Hero.setPower(power);

            this.upPointLabel.setString('Upgrade Point: ' + upPoint);
            this.powerUpLabel.setString('POWER (' + GameLayer.getText(Hero.getPower()) + '+' + GameLayer.getText(Number(futurePower)) + '): ' + powerUpgrade);
        }
    },

    speedUpgrade: function () {
        if (upPoint > 0) {
            if (Tap.getSpeed() > 3) {
                speedUpgrade += 1;
                upPoint -= 1;

                // FEATURE: 18/6/59 decrease speed (player upgrade)
                Tap.decreaseSpeed();

                this.upPointLabel.setString('Upgrade Point: ' + upPoint);
                this.speedLabel.setString('SPEED (' + Tap.getSpeed() + '-2): ' + speedUpgrade);
            } else {
                window.alert("your speed is too low");
            }
        }
    },

    backButton: function () {
        this.back = new cc.MenuItemImage(
            'res/Mechanic/BackBtn.png',
            'res/Mechanic/BackBtn_push.png',
            function () {
                cc.director.runScene(new StartScene());
            }, this);
        this.backButton = new cc.Menu(this.back);
        this.backButton.setPosition(new cc.Point(665, 51.5));
        this.addChild(this.backButton);
    },

    // up-left
    hpButton: function () {
        var hpUp = new cc.MenuItemImage(
            'res/Mechanic/UpgradePointBtn.png',
            'res/Mechanic/UpgradePointBtn_push.png',
            function () {
                this.hpUpgrade();
            }, this);
        this.hpUpButton = new cc.Menu(hpUp);
        this.hpUpButton.setPosition(new cc.Point(screenWidth * 0.25, this.hpUpLabel.getPositionY() - 75));
        this.addChild(this.hpUpButton);
        this.createShortcutLabel("1", this.hpUpButton.getPositionX(), this.hpUpButton.getPositionY());
    },

    // up-right
    powerButton: function () {
        var powerUp = new cc.MenuItemImage(
            'res/Mechanic/UpgradePointBtn.png',
            'res/Mechanic/UpgradePointBtn_push.png',
            function () {
                this.powerUpgrade();
            }, this);
        this.powerUpButton = new cc.Menu(powerUp);
        this.powerUpButton.setPosition(new cc.Point(screenWidth * 0.75, this.powerUpLabel.getPositionY() - 75));
        this.addChild(this.powerUpButton);
        this.createShortcutLabel("2", this.powerUpButton.getPositionX(), this.powerUpButton.getPositionY());
    },

    // down-left
    speedButton: function () {
        var speed = new cc.MenuItemImage(
            'res/Mechanic/UpgradePointBtn.png',
            'res/Mechanic/UpgradePointBtn_push.png',
            function () {
                this.speedUpgrade();
            }, this);
        this.speedDownButton = new cc.Menu(speed);
        this.speedDownButton.setPosition(new cc.Point(screenWidth * 0.25, this.speedLabel.getPositionY() - 75));
        this.addChild(this.speedDownButton);
        this.createShortcutLabel("3", this.speedDownButton.getPositionX(), this.speedDownButton.getPositionY());
    },

    createUpgradePointLabel: function () {
        this.upPointLabel = cc.LabelTTF.create('Upgrade Point: ' + upPoint, 'Arial', 30);
        this.upPointLabel.setPosition(new cc.Point(665, 125));
        this.addChild(this.upPointLabel);
    },

    createHpUpgradeLabel: function () {
        const futureHp = (3 * (hpUpgrade + 1) * stage).toFixed(0);

        this.hpUpLabel = cc.LabelTTF.create('HP (' + GameLayer.getText(Hero.getHp()) + '+' + GameLayer.getText(Number(futureHp)) + '): ' + hpUpgrade, 'Arial', 30);
        this.hpUpLabel.setPosition(new cc.Point(screenWidth * 0.25, screenHeight - 50));
        this.addChild(this.hpUpLabel);
    },

    createPowerUpgradeLabel: function () {
        const futurePower = ((3 / 2) * ((powerUpgrade + 1) / 10) * (stage / 4)).toFixed(4);

        this.powerUpLabel = cc.LabelTTF.create('POWER (' + GameLayer.getText(Hero.getPower()) + '+' + GameLayer.getText(Number(futurePower)) + '): ' + powerUpgrade, 'Arial', 30);
        this.powerUpLabel.setPosition(new cc.Point(screenWidth * 0.75, screenHeight - 50));
        this.addChild(this.powerUpLabel);
    },

    createSpeedUpgradeLabel: function () {
        this.speedLabel = cc.LabelTTF.create('SPEED (' + Tap.getSpeed() + '-2): ' + speedUpgrade, 'Arial', 30);
        this.speedLabel.setPosition(new cc.Point(screenWidth * 0.25, screenHeight - 200));
        this.addChild(this.speedLabel);
    },

    createShortcutLabel: function (key, posX, posY) {
        this.shortcutLabel = cc.LabelTTF.create('Press (' + key + ')', 'Arial', 20);
        this.shortcutLabel.setPosition(new cc.Point(posX + 100, posY - 40));
        this.shortcutLabel.setFontFillColor(cc.color(210, 210, 210));
        this.addChild(this.shortcutLabel);
    }
});

var UpgradeScene = cc.Scene.extend({
    onEnter: function () {
        this._super();
        var layer = new UpgradeLayer();
        layer.init();
        this.addChild(layer);
    }
});

var hpUpgrade = 0;
var powerUpgrade = 0;
var speedUpgrade = 0;
