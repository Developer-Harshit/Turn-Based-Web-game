const myGame = {
  data() {
    return {
      message: "hi",
      playerHealth: 100,
      monsterHealth: 100,
      attackDamage: 8,
      spzAttackDamage: 14,
      spzBuffer: { player: 0, monster: 0 },
      healBuffer: { player: 0, monster: 0 },
      healAmount: 15,
      round: 0,
      winner: false,
    };
  },
  watch: {
    playerHealth(value) {
      if (value <= 0 && this.monsterHealth <= 0) {
        //draw
        this.winner = -1;
      } else if (value <= 0) {
        this.winner = 1;
      }
    },
    monsterHealth(value) {
      if (value <= 0 && this.playerHealth <= 0) {
        this.winner = -1;
      } else if (value <= 0) {
        this.winner = 0;
      }
    },
  },
  computed: {
    playerStyles() {
      return { width: this.playerHealth + "%" };
    },
    monsterStyles() {
      return { width: this.monsterHealth + "%" };
    },
  },
  methods: {
    attack(attacker = "player") {
      const dmgDealt = this.remap(
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
    },
    spzAttack(attacker = "player") {
      const dmgDealt = this.remap(
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
        this.spzBuffer.player = 3;
      } else {
        this.playerHealth = Math.max(
          0,
          Math.floor(this.playerHealth - dmgDealt)
        );
        this.spzBuffer.monster = 4;
        console.log("spz monster");
      }
    },
    heal(healer = "player") {
      const hpHealed = this.remap(
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
        this.healBuffer.player = 2;
      } else {
        this.monsterHealth = Math.min(
          100,
          Math.floor(hpHealed * 0.67 + this.monsterHealth)
        );
        this.healBuffer.monster = 3;
      }
    },
    playMove(action) {
      this.checkPlayerBuffer();
      this.checkMonsterBuffer();

      if (this.spzBuffer.player <= 2) {
        eval(`this.${action} ()`);
      }

      if (this.spzBuffer.monster <= 2) {
        this.monsMove();
      }
      this.message = { monster: this.monsterHealth, player: this.playerHealth };
      this.round++;
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
    monsMove() {
      var atkChance = [];
      var healChance = [];
      var spzChance = [];

      atkChance = Array(
        Math.floor(
          0.37 * (10 - this.remap(0, 100, 1, 10, this.monsterHealth))
        ) + Math.floor(this.remap(0, 100, 1, 10, this.playerHealth))
      ).fill("attack");

      if (this.healBuffer.monster <= 0) {
        healChance = Array(
          10 - Math.floor(this.remap(0, 100, 1, 10, this.monsterHealth))
        ).fill("heal");
      }
      if (this.spzBuffer.monster <= 0) {
        spzChance = Array(
          5 - Math.floor(this.remap(0, 100, 1, 10, this.playerHealth) / 2)
        ).fill("spzAttack");
      }

      const moves = [...healChance, ...atkChance, ...spzChance];
      const pickedMove = Math.floor(Math.random() * moves.length);
      eval(`this.${moves[pickedMove]} ('')`);
    },

    // @tValue is value between 0 to 1
    lerp(start, final, tValue) {
      return start + (final - start) * tValue;
    },
    // @xValue is value between s0 to s1
    remap(s0, s1, f0, f1, xValue) {
      const remappedValue = ((xValue - s0) * (f1 - f0)) / (s1 - s0) + f0;
      return remappedValue;
    },
  },
};
Vue.createApp(myGame).mount("#game");
