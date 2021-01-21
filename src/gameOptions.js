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
  mazeSizeIncrement: 10,
  damagePerUpdate: 0.025,
  damageModifier: 0.5,
  fireplaceSpawnChance: 0.01,
  torchesSpawnChance: 0.02
};
