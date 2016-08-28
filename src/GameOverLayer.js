var GameOverLayer = cc.LayerColor.extend({
    var: historyData = {name: "", stage: 0},
    var: current = 0,
    init: function () {
        this._super(new cc.Color(220, 20, 60, 255));
        this.setPosition(new cc.Point(0, 0));

        this.createScoreLabel();
        this.createHighScoreLabel();
        this.createReplayButton();

        this.readUserData();

        this.scheduleUpdate();
        this.addKeyboardHandlers();

        // check can win at least 1 stage?
        if (stage <= 1) {
            this.stageLabel.setString('Keep Trying!!');
        } else {
            this.stageLabel.setString('The Highest stage on this play is  ' + current);
        }
        this.deleteAnonymous();
        return true;
    },

    addKeyboardHandlers: function () {
        var self = this;
        cc.eventManager.addListener({
            event: cc.EventListener.KEYBOARD,
            onKeyPressed: function (keyCode, event) {
                self.onKeyDown(keyCode);
            }
        }, this);
    },

    onKeyDown: function (keyCode) {
        if (keyCode == cc.KEY.space) {
            this.replay();
        }
    },

    update: function () {
        if (GameOverLayer.loadingData) {
            // update label with high score
            this.highStageLabel.setString('The Highest stage ever \nfrom ' + historyData.name + ' is ' + historyData.stage);
            this.startGame.setEnabled(true);
        } else {
            this.startGame.setEnabled(false);
        }
    },

    replay: function () {
        stage = 1;

        countSuccess = 0;
        upPoint = 0;

        hpUpgrade = 0;
        powerUpgrade = 0;
        speedUpgrade = 0;
        cc.director.runScene(cc.TransitionCrossFade.create(0.5, new TitleScene()));
    },

    readUserData: function () {
        current = stage - 1;
        firebase.database().ref('/').once('value').then(function (snapshot) {
            historyData.name = snapshot.val().name;
            historyData.stage = snapshot.val().stage;
            // update only this.player beat score at server
            if (historyData.stage < current) {
                // update new high score
                firebase.database().ref('/').update({
                    name: firebase.auth().currentUser.displayName,
                    stage: Number(current)
                });
                historyData.stage = current;
                historyData.name = firebase.auth().currentUser.displayName;
            }
            GameOverLayer.loadingData = true;
        });
    },

    deleteAnonymous: function () {
        // delete anonymous user when game over
        if (firebase.auth().currentUser.isAnonymous) {
            firebase.auth().currentUser.delete().then(function () {
                console.info("good bye anonymous");
            });
        }
    },

    createReplayButton: function () {
        this.button = new cc.MenuItemImage(
            'res/Mechanic/RestartBtn.png',
            'res/Mechanic/RestartBtn_push.png',
            this.replay, this);
        this.startGame = new cc.Menu(this.button);
        this.startGame.setPosition(new cc.Point(screenWidth / 2, 100));
        this.addChild(this.startGame);
    },

    createHighScoreLabel: function () {
        this.highStageLabel = cc.LabelTTF.create('', 'Arial', 40);
        this.highStageLabel.setPosition(new cc.Point(screenWidth / 2, screenHeight - 100));
        this.addChild(this.highStageLabel);
    },

    createScoreLabel: function () {
        this.stageLabel = cc.LabelTTF.create('', 'Arial', 40);
        this.stageLabel.setPosition(new cc.Point(screenWidth / 2, screenHeight - 200));
        this.addChild(this.stageLabel);
    }
});

// is 'true' only when data is loaded from the server
GameOverLayer.loadingData = false;

var GameOverScene = cc.Scene.extend({
    onEnter: function () {
        this._super();
        var layer = new GameOverLayer();
        layer.init();
        this.addChild(layer);
    }
});
