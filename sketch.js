function setup() {
  noCanvas();
}

function draw() {
  background(220);
  if (abs(vueApp.playerHealth - vueApp.pGoalHealth) > 1) {
    vueApp.pGoalHealth = lerp(vueApp.pGoalHealth, vueApp.playerHealth, 0.07);
  } else {
    vueApp.pGoalHealth = vueApp.playerHealth;
  }
  if (abs(vueApp.monsterHealth - vueApp.mGoalHealth) > 1) {
    vueApp.mGoalHealth = lerp(vueApp.mGoalHealth, vueApp.monsterHealth, 0.07);
  } else {
    vueApp.mGoalHealth = vueApp.monsterHealth;
  }
}
