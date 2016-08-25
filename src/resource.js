var res = {
    // images
    title_jpg: "res/Others/HowToPlay.jpg",
    bg_png: "res/Others/bg.png",
    bar_jpg: "res/Mechanic/bar.jpg",
    tap_png: "res/Mechanic/tap.png",
    //button
    defendButton_jpg: "res/Mechanic/DefendBtn.jpg",
    defendButtonPush_jpg: "res/Mechanic/DefendBtn_push.jpg",
    spButton_jpg: "res/Mechanic/SpAttackBtn.jpg",
    spButtonPush_jpg: "res/Mechanic/SpAttackBtn_push.jpg",
    UpgradeButton_jpg: "res/Mechanic/UpgradeBtn.jpg",
    UpgradeButtonPush_jpg: "res/Mechanic/UpgradeBtn_push.jpg",
    UpgradePointButton_jpg: "res/Mechanic/UpgradePointBtn.jpg",
    UpgradePointButtonPush_jpg: "res/Mechanic/UpgradePointBtn_push.jpg",
    BackButton_jpg: "res/Mechanic/BackBtn.jpg",
    BackButtonPush_jpg: "res/Mechanic/BackBtn_push.jpg",
    restart_jpg: "res/Mechanic/RestartBtn.jpg",
    restartPush_jpg: "res/Mechanic/RestartBtn_push.jpg",
    // character
    hero_png: "res/Character/char1.png",
    monster_png: "res/Character/char2.png",
    // sound
    heroSound_mp3: "res/music/heroSound.mp3",
    monsterSound_mp3: "res/music/monsterSound.mp3",
    died_mp3: "res/music/died.mp3",
    eff_png: "res/Others/eff.png"
};

if (checkBrowser()) {
    res.music_mp3 = 'res/music/Night.mp3';
}

var g_resources = [];
for (var i in res) {
    g_resources.push(res[i]);
}
