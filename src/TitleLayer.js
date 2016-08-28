var TitleLayer = cc.LayerColor.extend({

    init: function () {
        this._super(new cc.Color(127, 127, 127, 255));
        this.setPosition(new cc.Point(0, 0));
        // sign out
        firebase.auth().signOut();
        this.createButton();
        this.createMuteLabel();
        this.addKeyboardHandlers();
        return true;
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
        if (keyCode == cc.KEY.space) {
            this.play();
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
    },

    play: function () {
        if (!firebase.auth().currentUser) {
            // FEATURE: 25/6/59 login via facebook be a guest
            var facebook = confirm("Sign in facebook account or guest, to keep your high score(guest will keep by using ip-address).\nDo you want to login facebook");
            // disable button when game loading
            this.startGame.setEnabled(false);
            // show loading label
            this.createLoadingLabel();

            if (facebook) {
                this.loginViaFacebook();
            } else {
                this.loginViaAnonymous();
            }
        } else
            cc.director.runScene(cc.TransitionCrossFade.create(0.5, new StartScene()));

    },

    loginViaFacebook: function () {
        var self = this;
        var provider = new firebase.auth.FacebookAuthProvider();
        firebase.auth().signInWithPopup(provider).then(function (result) {
            cc.director.runScene(cc.TransitionCrossFade.create(0.5, new StartScene()));
        }).catch(function (error) {
            self.loadingLabel.setString(error);
        });

        console.info("login as facebook");
    },

    loginViaAnonymous: function () {
        firebase.auth().signInAnonymously();

        firebase.auth().onAuthStateChanged(function (user) {
            if (user) {
                if (user.isAnonymous) {
                    user.updateProfile({displayName: myIP("query")}).then(function () {
                        // Update name successful.
                        cc.director.runScene(cc.TransitionCrossFade.create(0.5, new StartScene()));
                    });
                }
            }
        });


        console.info("login as anonymously");
    },

    createButton: function () {
        this.button = new cc.MenuItemImage(
            'res/Others/HowToPlay.jpg',
            'res/Others/HowToPlay.jpg',
            this.play, this);
        this.startGame = new cc.Menu(this.button);
        this.startGame.setPosition(new cc.Point(400, 300));
        this.addChild(this.startGame);
    },

    createMuteLabel: function () {
        this.muteLabel = cc.LabelTTF.create(sound ? '' : 'Mute', 'Arial', 20);
        this.muteLabel.setPosition(new cc.Point(screenWidth - 50, screenHeight - 50));
        this.muteLabel.setColor(cc.color(255, 0, 0));
        this.addChild(this.muteLabel);
    },

    createLoadingLabel: function () {
        this.loadingLabel = cc.LabelTTF.create("Loading. . .", 'Arial', 50);
        this.loadingLabel.setPosition(new cc.Point(screenWidth / 2, screenHeight / 2));
        this.loadingLabel.setColor(cc.color(255, 0, 0));
        this.addChild(this.loadingLabel);
    }
});

var TitleScene = cc.Scene.extend({
    onEnter: function () {
        this._super();
        var layer = new TitleLayer();
        layer.init();
        this.addChild(layer);
    }
});