var Monster = cc.Sprite.extend({
    var: monsterHp = 20,
    var: monsterPower = 10,
    var: checkMAtk = 0,

    ctor: function() {
        this._super();

    },
    getMHp: function() {
        return monsterHp;
    },
    setMHp: function(newHp) {
       monsterHp = newHp;

    },
    getPower: function () {
        return monsterPower;
    },
    setPower: function(newPower) {
        monsterPower = newPower;
    },
    monsterGetAttackCheck: function() {
        if (checkMAtk==1){
            checkMAtk = 0;
            return true;
        } else {
            return false;
        }
    },
    monsterGetAtked: function() {
        checkMAtk = 1;
    },
    isDead: function() {
        if (monsterHp<=0)
            return true;

        else false;
    },
    toAttack: function() {
        var randomNum = Math.floor(Math.random())*(3-1)+1;
        if (randomNum == 1) return true;
        else return false;
    }
});