import type { Hero, HeroStats } from "./account";

export const HERO_BASE_EXP_TO_LEVEL = 100;
export const HERO_EXP_LEVEL_STEP = 25;

export const HERO_BASE_STATS: HeroStats = {
  maxHp: 100,
  attack: 12,
  defense: 6,
};

export const HERO_STAT_GROWTH_PER_LEVEL: HeroStats = {
  maxHp: 20,
  attack: 4,
  defense: 2,
};

const isFiniteNonNegativeNumber = (value: unknown): value is number =>
  typeof value === "number" && Number.isFinite(value) && value >= 0;

const isFinitePositiveInteger = (value: unknown): value is number =>
  typeof value === "number" && Number.isInteger(value) && Number.isFinite(value) && value > 0;

export const getExpRequiredForNextLevel = (level: number): number => {
  const safeLevel = isFinitePositiveInteger(level) ? level : 1;
  return HERO_BASE_EXP_TO_LEVEL + (safeLevel - 1) * HERO_EXP_LEVEL_STEP;
};

export const getHeroStatsForLevel = (level: number): HeroStats => {
  const safeLevel = isFinitePositiveInteger(level) ? level : 1;
  const levelOffset = safeLevel - 1;

  return {
    maxHp: HERO_BASE_STATS.maxHp + HERO_STAT_GROWTH_PER_LEVEL.maxHp * levelOffset,
    attack: HERO_BASE_STATS.attack + HERO_STAT_GROWTH_PER_LEVEL.attack * levelOffset,
    defense: HERO_BASE_STATS.defense + HERO_STAT_GROWTH_PER_LEVEL.defense * levelOffset,
  };
};

const normalizeExpWithinLevel = (level: number, exp: unknown): number => {
  if (!isFiniteNonNegativeNumber(exp)) {
    return 0;
  }

  const threshold = getExpRequiredForNextLevel(level);
  return Math.floor(Math.min(exp, threshold - 1));
};

export const hydrateHero = (value: unknown): Hero | null => {
  if (typeof value !== "object" || value === null) {
    return null;
  }

  const candidate = value as {
    id?: unknown;
    name?: unknown;
    level?: unknown;
    exp?: unknown;
  };

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
    stats: getHeroStatsForLevel(level),
  };
};

export const createNewHero = (id: string, name: string): Hero => ({
  id,
  name,
  level: 1,
  exp: 0,
  stats: getHeroStatsForLevel(1),
});

export const applyHeroExperience = (hero: Hero, gainedExp: number): Hero => {
  if (!isFiniteNonNegativeNumber(gainedExp) || gainedExp === 0) {
    return hero;
  }

  let nextLevel = hero.level;
  let nextExp = hero.exp + Math.floor(gainedExp);

  while (nextExp >= getExpRequiredForNextLevel(nextLevel)) {
    nextExp -= getExpRequiredForNextLevel(nextLevel);
    nextLevel += 1;
  }

  return {
    ...hero,
    level: nextLevel,
    exp: nextExp,
    stats: getHeroStatsForLevel(nextLevel),
  };
};
