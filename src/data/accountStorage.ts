import type { Account } from "../models/account";
import { hydrateHero } from "../models/heroProgression";

export const ACCOUNT_STORAGE_KEY = "gen_account";

const normalizeAccount = (value: unknown): Account | null => {
  if (typeof value !== "object" || value === null) {
    return null;
  }

  const candidate = value as Partial<Account>;

  if (typeof candidate.login !== "string" || typeof candidate.nickname !== "string") {
    return null;
  }

  if (!Array.isArray(candidate.heroes)) {
    return null;
  }

  const normalizedHeroes = candidate.heroes
    .map(hydrateHero)
    .filter((hero): hero is NonNullable<ReturnType<typeof hydrateHero>> => hero !== null);
  if (normalizedHeroes.length !== candidate.heroes.length) {
    return null;
  }

  const activeHeroId =
    typeof candidate.activeHeroId === "string" &&
    normalizedHeroes.some((hero) => hero.id === candidate.activeHeroId)
      ? candidate.activeHeroId
      : undefined;
  const enemyCounter =
    typeof candidate.enemyCounter === "number" &&
    Number.isFinite(candidate.enemyCounter) &&
    candidate.enemyCounter >= 0
      ? Math.floor(candidate.enemyCounter)
      : 0;

  return {
    login: candidate.login,
    nickname: candidate.nickname,
    heroes: normalizedHeroes,
    activeHeroId,
    enemyCounter,
  };
};

export const saveAccount = (account: Account): void => {
  localStorage.setItem(ACCOUNT_STORAGE_KEY, JSON.stringify(account));
};

export const loadAccount = (): Account | null => {
  const serialized = localStorage.getItem(ACCOUNT_STORAGE_KEY);

  if (!serialized) {
    return null;
  }

  try {
    const parsed: unknown = JSON.parse(serialized);
    return normalizeAccount(parsed);
  } catch {
    return null;
  }
};
