export default {
  mazeWidth: 31,
  mazeHeight: 31,
  tileSize: 32,
  playerStartingX: 1,
  playerStartingY: 1,
  mazeStartingX: 1,
  mazeStartingY: 1,
  mazeEndX: 31 - 2, // this should read the value from gameOptions.mazeWidth
  mazeEndY: 31 - 2,
  mazeSizeIncrement: 4,
  damagePerUpdate: 0.025,
  fireplaceSpawnChance: 0.01,
  torchesSpawnChance: 0.02,
  warmingElementsDecrement: 0.90,
  updateInterval: (1 / 60) * 1000,
  lightRadius: 130,
  defaultLightRadius: 130,
  playerSpeed: 200,
  playerDefaultSpeed: 200,
  playerSpeedBuff: 1.5,
  gingerbreadSpawnChance: 0.005
};
