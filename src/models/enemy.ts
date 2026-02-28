export type EnemyConfig = {
  id: string;
  name: string;
  baseHp: number;
  baseAttack: number;
  baseDefense: number;
};

export type EnemyStats = {
  hp: number;
  attack: number;
  defense: number;
};

export type BattleEnemy = {
  id: string;
  name: string;
  counter: number;
  stats: EnemyStats;
};

export const ENEMY_SCALING_FACTOR = 0.05;

export const ENEMY_CONFIGS: EnemyConfig[] = [
  {
    id: "training-golem",
    name: "Тренировочный голем",
    baseHp: 120,
    baseAttack: 10,
    baseDefense: 5,
  },
];

const sanitizeCounter = (counter: number): number => {
  if (!Number.isFinite(counter) || counter < 0) {
    return 0;
  }

  return Math.floor(counter);
};

const scaleStat = (baseValue: number, counter: number): number =>
  Math.max(1, Math.floor(baseValue * (1 + counter * ENEMY_SCALING_FACTOR)));

export const getEnemyConfigById = (enemyId: string): EnemyConfig | null =>
  ENEMY_CONFIGS.find((enemy) => enemy.id === enemyId) ?? null;

export const createScaledEnemy = (enemyId: string, enemyCounter: number): BattleEnemy | null => {
  const config = getEnemyConfigById(enemyId);
  if (!config) {
    return null;
  }

  const normalizedCounter = sanitizeCounter(enemyCounter);

  return {
    id: config.id,
    name: config.name,
    counter: normalizedCounter,
    stats: {
      hp: scaleStat(config.baseHp, normalizedCounter),
      attack: scaleStat(config.baseAttack, normalizedCounter),
      defense: scaleStat(config.baseDefense, normalizedCounter),
    },
  };
};
