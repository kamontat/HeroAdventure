var res = {
    // images
    title_png: "res/Others/HowToPlay.png",
    bg_png: "res/Others/bg.png",
    bar_png: "res/Mechanic/bar.png",
    tap_png: "res/Mechanic/Tap.png",
    eff_png: "res/Others/eff.png",
    //button
    defendButton_png: "res/Mechanic/AttackBtn.png",
    defendButtonPush_png: "res/Mechanic/AttackBtn_push.png",
    spButton_png: "res/Mechanic/SpAttackBtn.png",
    spButtonPush_png: "res/Mechanic/SpAttackBtn_push.png",
    UpgradeButton_png: "res/Mechanic/UpgradeBtn.png",
    UpgradeButtonPush_png: "res/Mechanic/UpgradeBtn_push.png",
    UpgradePointButton_png: "res/Mechanic/UpgradePointBtn.png",
    UpgradePointButtonPush_png: "res/Mechanic/UpgradePointBtn_push.png",
    BackButton_png: "res/Mechanic/BackBtn.png",
    BackButtonPush_png: "res/Mechanic/BackBtn_push.png",
    restart_png: "res/Mechanic/RestartBtn.png",
    restartPush_png: "res/Mechanic/RestartBtn_push.png",
    // character
    hero_png: "res/Character/char1.png",
    monster_png: "res/Character/char2.png",
    // sound
    heroSound_mp3: "res/music/heroSound.mp3",
    monsterSound_mp3: "res/music/monsterSound.mp3",
    died_mp3: "res/music/died.mp3"
};

if (checkBrowser()) {
    res.music_mp3 = 'res/music/Night.mp3';
}

var g_resources = [];
for (var i in res) {
    g_resources.push(res[i]);
}
