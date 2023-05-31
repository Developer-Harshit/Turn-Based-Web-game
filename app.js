// @tValue is value between 0 to 1
function lerp(start, final, tValue) {
  return start + (final - start) * tValue;
}
// @xValue is value between s0 to s1
function remap(s0, s1, f0, f1, xValue) {
  const remappedValue = ((xValue - s0) * (f1 - f0)) / (s1 - s0) + f0;
  return remappedValue;
}
const myGame = {
  data() {
    return {
      message: "hi",
      playerHealth: 100,
      monsterHealth: 100,
      pGoalHealth: 100,
      mGoalHealth: 100,
      attackDamage: 8,
      spzAttackDamage: 14,
      spzBuffer: { player: 0, monster: 0, amount: 3 },
      healBuffer: { player: 0, monster: 0, amount: 3 },
      healAmount: 15,
      round: 1,
      winner: false,
      battleLog: [],
    };
  },
  watch: {
    playerHealth(value) {
      if (value <= 0 && this.monsterHealth <= 0) {
        //draw
        this.winner = "2";
      } else if (value <= 0) {
        this.winner = "1";
        console.log("winner monster");
      }
    },
    monsterHealth(value) {
      if (value <= 0 && this.playerHealth <= 0) {
        this.winner = "2";
      } else if (value <= 0) {
        this.winner = "0";
        console.log("winner player");
      }
    },
  },
  computed: {
    playerStyles() {
      return { width: this.pGoalHealth + "%" };
    },
    monsterStyles() {
      return { width: this.mGoalHealth + "%" };
    },
  },
  methods: {
    attack(attacker = "player") {
      const dmgDealt = remap(
        0,
        1,
        this.attackDamage - 3,
        this.attackDamage + 3,
        Math.random()
      );
      if (attacker == "player") {
        this.monsterHealth = Math.max(
          0,
          Math.floor(this.monsterHealth - dmgDealt)
        );
      } else {
        this.playerHealth = Math.max(
          0,
          Math.floor(this.playerHealth - dmgDealt)
        );
      }
      return [attacker, "damage", Math.floor(dmgDealt), "deals damage by "];
    },
    spzAttack(attacker = "player") {
      const dmgDealt = remap(
        0,
        1,
        this.spzAttackDamage - 3,
        this.spzAttackDamage + 3,
        Math.random()
      );

      if (attacker == "player") {
        this.monsterHealth = Math.max(
          0,
          Math.floor(this.monsterHealth - dmgDealt)
        );
        this.spzBuffer.player = this.spzBuffer.amount;
      } else {
        this.playerHealth = Math.max(
          0,
          Math.floor(this.playerHealth - dmgDealt)
        );
        this.spzBuffer.monster = this.spzBuffer.amount;
      }
      return [
        attacker,
        "damage",
        Math.floor(dmgDealt),
        "lands special attack and deals damage by ",
      ];
    },
    heal(healer = "player") {
      const hpHealed = remap(
        0,
        1,
        this.healAmount - 3,
        this.healAmount + 3,
        Math.random()
      );

      if (healer == "player") {
        this.playerHealth = Math.min(
          100,
          Math.floor(hpHealed + this.playerHealth)
        );
        this.healBuffer.player = this.healBuffer.amount;
      } else {
        this.monsterHealth = Math.min(
          100,
          Math.floor(hpHealed * 0.67 + this.monsterHealth)
        );
        this.healBuffer.monster = this.healBuffer.amount;
      }
      return [healer, "heal", Math.floor(hpHealed), "is healed by "];
    },
    surrender() {
      this.playerHealth = 0;
      this.winner = "1";
    },
    move(action) {
      this.checkPlayerBuffer();
      this.checkMonsterBuffer();
      var pMsg = ["player", "cooldown", 1, "is in cooldown for "];
      if (this.spzBuffer.player <= 2 && action != "nothing") {
        pMsg = eval(`this.${action} ()`);
      }

      var MMsg = ["monster", "cooldown", 1, "is in cooldown for "];
      if (this.spzBuffer.monster <= 1) {
        MMsg = this.monsMove();
      }
      console.log(this.spzBuffer.player <= 2, this.spzBuffer.monster <= 1);
      this.addLogMessage(pMsg, MMsg);

      this.message = { monster: this.monsterHealth, player: this.playerHealth };
      this.round++;
    },
    monsMove() {
      var atkChance = [];
      var healChance = [];
      var spzChance = [];

      atkChance = Array(
        Math.floor(0.37 * (10 - remap(0, 100, 1, 10, this.monsterHealth))) +
          Math.floor(remap(0, 100, 1, 10, this.playerHealth))
      ).fill("attack");

      if (this.healBuffer.monster <= 0) {
        healChance = Array(
          10 - Math.floor(remap(0, 100, 1, 10, this.monsterHealth))
        ).fill("heal");
      }
      if (this.spzBuffer.monster <= 0) {
        spzChance = Array(
          5 - Math.floor(remap(0, 100, 1, 10, this.playerHealth) / 2)
        ).fill("spzAttack");
      }

      const moves = [...healChance, ...atkChance, ...spzChance];
      const pickedMove = Math.floor(Math.random() * moves.length);
      return eval(`this.${moves[pickedMove]} ('monster')`);
    },
    addLogMessage(playerMsg, monsterMsg) {
      const playerObj = {
        by: playerMsg[0],
        type: playerMsg[1],
        value: playerMsg[2],
        text: playerMsg[3],
      };
      const monsterObj = {
        by: monsterMsg[0],
        type: monsterMsg[1],
        value: monsterMsg[2],
        text: monsterMsg[3],
      };
      this.battleLog.unshift({
        player: playerObj,
        monster: monsterObj,
        round: this.round,
      });
    },
    resetGame() {
      this.playerHealth = 100;
      this.monsterHealth = 100;
      this.pGoalHealth = 100;
      this.spzBuffer = { player: 0, monster: 0, amount: 3 };
      this.healBuffer = { player: 0, monster: 0, amount: 3 };
      this.winner = false;
      this.battleLog = [];
    },
    checkPlayerBuffer() {
      if (this.spzBuffer.player > 0) {
        this.spzBuffer.player = Math.max(0, this.spzBuffer.player - 1);
      }
      if (this.healBuffer.player > 0) {
        this.healBuffer.player = Math.max(0, this.healBuffer.player - 1);
      }
    },
    checkMonsterBuffer() {
      if (this.spzBuffer.monster > 0) {
        this.spzBuffer.monster = Math.max(0, this.spzBuffer.monster - 1);
      }
      if (this.healBuffer.monster > 0) {
        this.healBuffer.monster = Math.max(0, this.healBuffer.monster - 1);
      }
    },
  },
};
const vueApp = Vue.createApp(myGame).mount("#game");
