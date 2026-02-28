"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.applyHeroExperience = exports.createNewHero = exports.hydrateHero = exports.getHeroStatsForLevel = exports.getExpRequiredForNextLevel = exports.HERO_STAT_GROWTH_PER_LEVEL = exports.HERO_BASE_STATS = exports.HERO_EXP_LEVEL_STEP = exports.HERO_BASE_EXP_TO_LEVEL = void 0;
exports.HERO_BASE_EXP_TO_LEVEL = 100;
exports.HERO_EXP_LEVEL_STEP = 25;
exports.HERO_BASE_STATS = {
    maxHp: 100,
    attack: 12,
    defense: 6,
};
exports.HERO_STAT_GROWTH_PER_LEVEL = {
    maxHp: 20,
    attack: 4,
    defense: 2,
};
const isFiniteNonNegativeNumber = (value) => typeof value === "number" && Number.isFinite(value) && value >= 0;
const isFinitePositiveInteger = (value) => typeof value === "number" && Number.isInteger(value) && Number.isFinite(value) && value > 0;
const getExpRequiredForNextLevel = (level) => {
    const safeLevel = isFinitePositiveInteger(level) ? level : 1;
    return exports.HERO_BASE_EXP_TO_LEVEL + (safeLevel - 1) * exports.HERO_EXP_LEVEL_STEP;
};
exports.getExpRequiredForNextLevel = getExpRequiredForNextLevel;
const getHeroStatsForLevel = (level) => {
    const safeLevel = isFinitePositiveInteger(level) ? level : 1;
    const levelOffset = safeLevel - 1;
    return {
        maxHp: exports.HERO_BASE_STATS.maxHp + exports.HERO_STAT_GROWTH_PER_LEVEL.maxHp * levelOffset,
        attack: exports.HERO_BASE_STATS.attack + exports.HERO_STAT_GROWTH_PER_LEVEL.attack * levelOffset,
        defense: exports.HERO_BASE_STATS.defense + exports.HERO_STAT_GROWTH_PER_LEVEL.defense * levelOffset,
    };
};
exports.getHeroStatsForLevel = getHeroStatsForLevel;
const normalizeExpWithinLevel = (level, exp) => {
    if (!isFiniteNonNegativeNumber(exp)) {
        return 0;
    }
    const threshold = (0, exports.getExpRequiredForNextLevel)(level);
    return Math.floor(Math.min(exp, threshold - 1));
};
const hydrateHero = (value) => {
    if (typeof value !== "object" || value === null) {
        return null;
    }
    const candidate = value;
    if (typeof candidate.id !== "string" || typeof candidate.name !== "string") {
        return null;
    }
    const level = isFinitePositiveInteger(candidate.level) ? candidate.level : 1;
    const exp = normalizeExpWithinLevel(level, candidate.exp);
    return {
        id: candidate.id,
        name: candidate.name,
        level,
        exp,
        stats: (0, exports.getHeroStatsForLevel)(level),
    };
};
exports.hydrateHero = hydrateHero;
const createNewHero = (id, name) => ({
    id,
    name,
    level: 1,
    exp: 0,
    stats: (0, exports.getHeroStatsForLevel)(1),
});
exports.createNewHero = createNewHero;
const applyHeroExperience = (hero, gainedExp) => {
    if (!isFiniteNonNegativeNumber(gainedExp) || gainedExp === 0) {
        return hero;
    }
    let nextLevel = hero.level;
    let nextExp = hero.exp + Math.floor(gainedExp);
    while (nextExp >= (0, exports.getExpRequiredForNextLevel)(nextLevel)) {
        nextExp -= (0, exports.getExpRequiredForNextLevel)(nextLevel);
        nextLevel += 1;
    }
    return {
        ...hero,
        level: nextLevel,
        exp: nextExp,
        stats: (0, exports.getHeroStatsForLevel)(nextLevel),
    };
};
exports.applyHeroExperience = applyHeroExperience;
