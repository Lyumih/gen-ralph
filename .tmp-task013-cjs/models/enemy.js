"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createScaledEnemy = exports.getEnemyConfigById = exports.ENEMY_CONFIGS = exports.ENEMY_SCALING_FACTOR = void 0;
exports.ENEMY_SCALING_FACTOR = 0.05;
exports.ENEMY_CONFIGS = [
    {
        id: "training-golem",
        name: "Тренировочный голем",
        baseHp: 120,
        baseAttack: 10,
        baseDefense: 5,
    },
];
const sanitizeCounter = (counter) => {
    if (!Number.isFinite(counter) || counter < 0) {
        return 0;
    }
    return Math.floor(counter);
};
const scaleStat = (baseValue, counter) => Math.max(1, Math.floor(baseValue * (1 + counter * exports.ENEMY_SCALING_FACTOR)));
const getEnemyConfigById = (enemyId) => exports.ENEMY_CONFIGS.find((enemy) => enemy.id === enemyId) ?? null;
exports.getEnemyConfigById = getEnemyConfigById;
const createScaledEnemy = (enemyId, enemyCounter) => {
    const config = (0, exports.getEnemyConfigById)(enemyId);
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
exports.createScaledEnemy = createScaledEnemy;
