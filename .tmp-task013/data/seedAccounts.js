export const SEED_ACCOUNTS_STORAGE_KEY = "gen_seed_accounts";
const SEED_ACCOUNTS_PATH = "/seed-accounts.json";
const isSeedHero = (value) => {
    if (typeof value !== "object" || value === null) {
        return false;
    }
    const candidate = value;
    return typeof candidate.id === "string" && typeof candidate.name === "string";
};
const isSeedAccount = (value) => {
    if (typeof value !== "object" || value === null) {
        return false;
    }
    const candidate = value;
    if (typeof candidate.login !== "string" || typeof candidate.nickname !== "string") {
        return false;
    }
    if (candidate.heroes === undefined) {
        return true;
    }
    return Array.isArray(candidate.heroes) && candidate.heroes.every(isSeedHero);
};
const parseSeedAccounts = (value) => {
    if (!Array.isArray(value) || !value.every(isSeedAccount)) {
        throw new Error("Seed accounts data has invalid format.");
    }
    return value;
};
export const loadSeedAccounts = async () => {
    const response = await fetch(SEED_ACCOUNTS_PATH);
    if (!response.ok) {
        throw new Error(`Failed to load seed accounts: ${response.status}`);
    }
    const data = await response.json();
    return parseSeedAccounts(data);
};
export const readSeedAccountsFromStorage = () => {
    const serialized = localStorage.getItem(SEED_ACCOUNTS_STORAGE_KEY);
    if (!serialized) {
        return [];
    }
    try {
        const parsed = JSON.parse(serialized);
        return parseSeedAccounts(parsed);
    }
    catch {
        return [];
    }
};
export const initializeSeedAccountsStorageIfEmpty = async () => {
    const existing = readSeedAccountsFromStorage();
    if (existing.length > 0) {
        return existing;
    }
    const seedAccounts = await loadSeedAccounts();
    localStorage.setItem(SEED_ACCOUNTS_STORAGE_KEY, JSON.stringify(seedAccounts));
    return seedAccounts;
};
