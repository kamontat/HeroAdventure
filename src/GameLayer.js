var GameLayer = cc.LayerColor.extend({

    init: function () {
        this._super(new cc.Color(60, 179, 113, 255));
        this.setPosition(new cc.Point(0, 0));
        // other
        this.createBg();
        this.createBar();
        this.createTap();
        this.createCharacter();
        // Effect
        this.createHeroEffect();
        this.createMonsterEffect();
        // label
        this.createUpgradePointLabel();
        this.createHeroLabel();
        this.createMonsterLabel();
        this.createStageLabel();
        this.createSPLabel();
        this.createMuteLabel();
        this.createPlayerNameLabel();
        // button
        this.createSpAttackButton();
        this.createUpgradeButton();
        // keyboard
        this.addKeyboardHandlers();
        // update
        this.scheduleUpdate();
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
        // isAttack
        if (keyCode == cc.KEY.a) {
            this.attack();
        }

        // sp Attack
        if (keyCode == cc.KEY.s) {
            this.spAttack();
        }

        // update page
        if (keyCode == cc.KEY.u) {
            cc.director.runScene(new UpgradeScene());
        }

        // hack
        if (keyCode == cc.KEY.q) {
            this.heroAttack(1);
        }

        // sound mute
        if (keyCode == cc.KEY.m) {
            if (sound) {
                this.muteLabel.setString('Mute');
                cc.audioEngine.setEffectsVolume(0);
                cc.audioEngine.setMusicVolume(0);
                sound = false;
            } else {
                this.muteLabel.setString('');
                cc.audioEngine.setEffectsVolume(100);
                cc.audioEngine.setMusicVolume(100);
                sound = true;
            }
        }

        // debug code
        if (keyCode == cc.KEY.l) {
            firebase.database().ref('/').once('value').then(function (snapshot) {
                console.info("----------------------------------");
                console.info(firebase.auth().currentUser.displayName);
                console.info(firebase.auth().currentUser.email);
                console.info("----------------------------------");
                console.info("high stage ever: " + snapshot.val().name + " with " + snapshot.val().stage);
                console.info("stage: " + stage + "/" + maxStage);
                console.info("speed: " + Tap.getSpeed());
                console.info("hero hp: " + Hero.getHp());
                console.info("hero power: " + Hero.getPower());
                console.info("hero sp-attack: " + ((Hero.getPower() * (countSuccess - 1)) < 0 ? 0 : (Hero.getPower() * (countSuccess - 1))));
                console.info("monster hp: " + Monster.getHp());
                console.info("monster power: " + Monster.getPower());
                console.info("----------------------------------");
            });

        }
    },

    setHeroHp: function (newHp) {
        Hero.setHp(newHp);
        this.heroLabel.setString('HP: ' + GameLayer.getText(Hero.getHp()));
    },

    setMonsterHp: function (newHp) {
        Monster.setHp(newHp);
        this.monsterLabel.setString('HP: ' + GameLayer.getText(Monster.getHp()));
    },

    isBoss: function () {
        return stage % 10 == 0;
    },

    attack: function () {
        if (tapHere) {
            this.tap.stop();
            // hero isAttack
            if (this.tap.closeTo(this.bar)) {
                this.heroAttack(1);
                // monster isAttack
            } else {
                this.monsterAttack();
            }
            tapHere = false;
        } else {
            this.tap.start();
            this.returnEffect();
            tapHere = true;
        }
    },

    spAttack: function () {
        if (countSuccess >= 5) {
            this.heroAttack(countSuccess - 1);
            countSuccess = 0;
            this.spLabel.setString('SP charge: ' + countSuccess);

            this.tap.stop();
            tapHere = false;
        }
    },

    // multiply mean power * multiply to attack monster
    heroAttack: function (multiply) {
        this.setMonsterHp(Monster.getHp() - (Hero.getPower() * multiply));

        countSuccess++;

        this.spLabel.setString('SP charge: ' + (countSuccess < 5 ? countSuccess : 'MAX(' + (countSuccess - 4) + ')'));

        if (this.monster.isDead())
            this.passTheLevel();
        else
            cc.audioEngine.playEffect('res/music/heroSound.mp3');
        this.AttackPos("hero");
    },

    monsterAttack: function () {
        this.setHeroHp(Hero.getHp() - Monster.getPower());

        if (countSuccess != 0) {
            countSuccess--;
        }

        this.spLabel.setString('SP charge: ' + (countSuccess < 5 ? countSuccess : 'MAX(' + (countSuccess - 4) + ')'));

        if (this.hero.isDead())
            this.gameOver();
        else
            cc.audioEngine.playEffect('res/music/monsterSound.mp3');

        this.AttackPos("monster");
    },

    AttackPos: function (who) {
        if (who == "hero") {
            this.hero.setPosition(new cc.Point(400, 350));
            this.eff1.setOpacity(255);
        } else {
            this.monster.setPosition(new cc.Point(400, 373));
            this.eff2.setOpacity(255);
        }
    },

    returnEffect: function () {
        this.hero.setPosition(new cc.Point(200, 350));
        this.monster.setPosition(new cc.Point(600, 373));
        this.eff1.setOpacity(0);
        this.eff2.setOpacity(0);
    },

    passTheLevel: function () {
        cc.audioEngine.playEffect('res/music/died.mp3');
        stage++;

        // FEATURE: 18/6/59 update hp (boss) -> 24*stage , (normal) -> 11*stage
        // FEATURE: 27/6/59 update power (boss) -> 4.3*stage , (normal) -> 1.3*stage
        // FEATURE: 27/6/59 update upPoint by 2, if it's boss
        if (this.isBoss()) {
            upPoint += 2;
            this.setMonsterHp(monsterHpDefault + (24 * stage));
            Monster.setPower(monsterPowerDefault + (4.3 * stage));
            maxStage += 10;
        } else {
            upPoint += 1;
            this.setMonsterHp(monsterHpDefault + (11 * stage));
            Monster.setPower(monsterPowerDefault + (1.3 * stage));
        }

        // expend max level to 50
        if (stage > maxStage) {
            this.gameOver();
        }

        this.stageLabel.setString('Stage: ' + (stage % 10 == 0 ? 'Boss(' + stage / 10 + ')!' : stage));
        this.upPointLabel.setString('Upgrade Point: ' + upPoint);
    },

    gameOver: function () {
        cc.audioEngine.playEffect('res/music/died.mp3');

        this.hero.resetHp();
        this.hero.resetPower();
        this.monster.resetHp();
        this.monster.resetPower();

        this.tap.stop();
        this.tap.resetSpeed();

        this.stageLabel.setString('Stage: ' + stage);
        this.spLabel.setString('SP charge: ' + countSuccess);
        this.upPointLabel.setString('Upgrade Point: ' + upPoint);

        cc.director.runScene(new GameOverScene());
    },

    createSpAttackButton: function () {
        const spAttack = new cc.MenuItemImage(
            'res/Mechanic/SpAttackBtn.jpg',
            'res/Mechanic/SpAttackBtn_push.jpg',
            function () {
                this.spAttack();
            }, this);
        this.SPButton = new cc.Menu(spAttack);
        this.SPButton.setPosition(new cc.Point(screenWidth * 0.25, 51.5));
        this.addChild(this.SPButton);
    },

    createUpgradeButton: function () {
        const upgrade = new cc.MenuItemImage(
            'res/Mechanic/UpgradeBtn.jpg',
            'res/Mechanic/UpgradeBtn_push.jpg',
            function () {
                cc.director.runScene(new UpgradeScene());
            }, this);
        this.UpgradeButton = new cc.Menu(upgrade);
        this.UpgradeButton.setPosition(new cc.Point(screenWidth * 0.75, 51.5));
        this.addChild(this.UpgradeButton);
    },

    createBar: function () {
        this.bar = new Guage();
        this.bar.setPosition(new cc.Point(screenWidth * 0.5, 150));
        this.addChild(this.bar);
    },

    createBg: function () {
        this.bg = new Bg();
        this.bg.setPosition(new cc.Point(screenWidth / 2, screenHeight / 2));
        this.addChild(this.bg, 0);
    },

    createTap: function () {
        this.tap = new Tap();
        if (tapHere) {
            this.tap.setOpacity(255);
            this.tap.start();
        } else {
            this.tap.setOpacity(0);
            this.tap.rePos();
        }
        this.addChild(this.tap);
    },

    createCharacter: function () {
        this.hero = new Hero();
        this.monster = new Monster();
        this.addChild(this.hero);
        this.addChild(this.monster);
        // set position
        this.monster.setPosition(new cc.Point(600, 373));
        this.hero.setPosition(new cc.Point(200, 350));
    },

    createStageLabel: function () {
        this.stageLabel = cc.LabelTTF.create('Stage: ' + (stage % 10 == 0 ? 'Boss(' + stage / 10 + ')!' : stage), 'Arial', 30);
        this.stageLabel.setPosition(new cc.Point(screenWidth * 0.5, 550));
        this.addChild(this.stageLabel);
    },

    createHeroLabel: function () {
        this.heroLabel = cc.LabelTTF.create('HP: ' + GameLayer.getText(Hero.getHp()), 'Arial', 40);
        this.heroLabel.setPosition(new cc.Point(screenWidth * 0.25, 500));
        this.addChild(this.heroLabel);
    },

    createMonsterLabel: function () {
        this.monsterLabel = cc.LabelTTF.create('HP: ' + GameLayer.getText(Monster.getHp()), 'Arial', 40);
        this.monsterLabel.setPosition(new cc.Point(screenWidth * 0.75, 500));
        this.addChild(this.monsterLabel);
    },

    createSPLabel: function () {
        this.spLabel = cc.LabelTTF.create('SP charge: ' + (countSuccess < 5 ? countSuccess : 'MAX(' + (countSuccess - 4) + ')'), 'Arial', 30);
        this.spLabel.setPosition(new cc.Point(screenWidth * 0.25, 220));
        this.addChild(this.spLabel);
    },

    createUpgradePointLabel: function () {
        this.upPointLabel = cc.LabelTTF.create('Upgrade Point: ' + upPoint, 'Arial', 30);
        this.upPointLabel.setPosition(new cc.Point(screenWidth * 0.75, 220));
        this.addChild(this.upPointLabel);
    },

    createMuteLabel: function () {
        this.muteLabel = cc.LabelTTF.create(sound ? '' : 'Mute', 'Arial', 20);
        this.muteLabel.setPosition(new cc.Point(screenWidth - 50, screenHeight - 50));
        this.muteLabel.setColor(cc.color(255, 0, 0));
        this.addChild(this.muteLabel);
    },

    createPlayerNameLabel: function () {
        var user = firebase.auth().currentUser;
        this.nameLabel = cc.LabelTTF.create(user.displayName, 'Arial', 20);
        this.nameLabel.setPosition(new cc.Point(100, screenHeight - 50));
        this.addChild(this.nameLabel);
    },

    createHeroEffect: function () {
        this.eff1 = new Effect();
        this.eff1.setPosition(new cc.Point(500, 350));
        this.eff1.setOpacity(0);
        this.addChild(this.eff1);
    },

    createMonsterEffect: function () {
        this.eff2 = new Effect();
        this.eff2.setPosition(new cc.Point(300, 350));
        this.eff2.setOpacity(0);
        this.addChild(this.eff2);
    }
});

GameLayer.getText = function (num) {
    var text = num.toFixed(2);

    if (num > 1000000000) {
        text = Number(num / 1000000000).toFixed(1) + "B";
    } else if (num > 1000000) {
        text = Number(num / 1000000).toFixed(1) + "M";
    } else if (num > 1000) {
        text = Number(num / 1000).toFixed(1) + "K"
    }
    return text;
};

var StartScene = cc.Scene.extend({
    onEnter: function () {
        this._super();
        var layer = new GameLayer();
        layer.init();
        this.addChild(layer);
    }
});

// variable
var stage = 1;
var maxStage = 10;
// default value
var heroHpDefault = 100;
var heroPowerDefault = 15;
var monsterHpDefault = 30;
var monsterPowerDefault = 3;
// update point
var upPoint = 0;
// charge attack
var countSuccess = 0;
// object speed
var tSpeed = 2;
// 'attack button' tapHere, true = tap is appear; otherwise tap disappear
var tapHere = false;
// is sound or mute
var sound = true;
