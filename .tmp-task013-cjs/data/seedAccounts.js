"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initializeSeedAccountsStorageIfEmpty = exports.readSeedAccountsFromStorage = exports.loadSeedAccounts = exports.SEED_ACCOUNTS_STORAGE_KEY = void 0;
exports.SEED_ACCOUNTS_STORAGE_KEY = "gen_seed_accounts";
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
const loadSeedAccounts = async () => {
    const response = await fetch(SEED_ACCOUNTS_PATH);
    if (!response.ok) {
        throw new Error(`Failed to load seed accounts: ${response.status}`);
    }
    const data = await response.json();
    return parseSeedAccounts(data);
};
exports.loadSeedAccounts = loadSeedAccounts;
const readSeedAccountsFromStorage = () => {
    const serialized = localStorage.getItem(exports.SEED_ACCOUNTS_STORAGE_KEY);
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
exports.readSeedAccountsFromStorage = readSeedAccountsFromStorage;
const initializeSeedAccountsStorageIfEmpty = async () => {
    const existing = (0, exports.readSeedAccountsFromStorage)();
    if (existing.length > 0) {
        return existing;
    }
    const seedAccounts = await (0, exports.loadSeedAccounts)();
    localStorage.setItem(exports.SEED_ACCOUNTS_STORAGE_KEY, JSON.stringify(seedAccounts));
    return seedAccounts;
};
exports.initializeSeedAccountsStorageIfEmpty = initializeSeedAccountsStorageIfEmpty;
