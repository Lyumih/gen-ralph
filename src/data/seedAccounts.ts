export type SeedHero = {
  id: string;
  name: string;
};

export type SeedAccount = {
  login: string;
  nickname: string;
  heroes?: SeedHero[];
};

export const SEED_ACCOUNTS_STORAGE_KEY = "gen_seed_accounts";

const SEED_ACCOUNTS_PATH = "/seed-accounts.json";

const isSeedHero = (value: unknown): value is SeedHero => {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  const candidate = value as Partial<SeedHero>;
  return typeof candidate.id === "string" && typeof candidate.name === "string";
};

const isSeedAccount = (value: unknown): value is SeedAccount => {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  const candidate = value as Partial<SeedAccount>;
  if (typeof candidate.login !== "string" || typeof candidate.nickname !== "string") {
    return false;
  }

  if (candidate.heroes === undefined) {
    return true;
  }

  return Array.isArray(candidate.heroes) && candidate.heroes.every(isSeedHero);
};

const parseSeedAccounts = (value: unknown): SeedAccount[] => {
  if (!Array.isArray(value) || !value.every(isSeedAccount)) {
    throw new Error("Seed accounts data has invalid format.");
  }

  return value;
};

export const loadSeedAccounts = async (): Promise<SeedAccount[]> => {
  const response = await fetch(SEED_ACCOUNTS_PATH);
  if (!response.ok) {
    throw new Error(`Failed to load seed accounts: ${response.status}`);
  }

  const data: unknown = await response.json();
  return parseSeedAccounts(data);
};

export const readSeedAccountsFromStorage = (): SeedAccount[] => {
  const serialized = localStorage.getItem(SEED_ACCOUNTS_STORAGE_KEY);
  if (!serialized) {
    return [];
  }

  try {
    const parsed: unknown = JSON.parse(serialized);
    return parseSeedAccounts(parsed);
  } catch {
    return [];
  }
};

export const initializeSeedAccountsStorageIfEmpty = async (): Promise<SeedAccount[]> => {
  const existing = readSeedAccountsFromStorage();
  if (existing.length > 0) {
    return existing;
  }

  const seedAccounts = await loadSeedAccounts();
  localStorage.setItem(SEED_ACCOUNTS_STORAGE_KEY, JSON.stringify(seedAccounts));
  return seedAccounts;
};
