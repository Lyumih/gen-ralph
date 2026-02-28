import type { Account, Hero } from "../models/account";

export const ACCOUNT_STORAGE_KEY = "gen_account";

const isHero = (value: unknown): value is Hero => {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  const candidate = value as Partial<Hero>;
  return typeof candidate.id === "string" && typeof candidate.name === "string";
};

const isAccount = (value: unknown): value is Account => {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  const candidate = value as Partial<Account>;

  if (typeof candidate.login !== "string" || typeof candidate.nickname !== "string") {
    return false;
  }

  if (!Array.isArray(candidate.heroes) || !candidate.heroes.every(isHero)) {
    return false;
  }

  return candidate.activeHeroId === undefined || typeof candidate.activeHeroId === "string";
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
    return isAccount(parsed) ? parsed : null;
  } catch {
    return null;
  }
};
