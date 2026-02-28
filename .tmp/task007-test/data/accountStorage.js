"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadAccount = exports.saveAccount = exports.ACCOUNT_STORAGE_KEY = void 0;
exports.ACCOUNT_STORAGE_KEY = "gen_account";
const isHero = (value) => {
    if (typeof value !== "object" || value === null) {
        return false;
    }
    const candidate = value;
    return typeof candidate.id === "string" && typeof candidate.name === "string";
};
const isAccount = (value) => {
    if (typeof value !== "object" || value === null) {
        return false;
    }
    const candidate = value;
    if (typeof candidate.login !== "string" || typeof candidate.nickname !== "string") {
        return false;
    }
    if (!Array.isArray(candidate.heroes) || !candidate.heroes.every(isHero)) {
        return false;
    }
    return candidate.activeHeroId === undefined || typeof candidate.activeHeroId === "string";
};
const saveAccount = (account) => {
    localStorage.setItem(exports.ACCOUNT_STORAGE_KEY, JSON.stringify(account));
};
exports.saveAccount = saveAccount;
const loadAccount = () => {
    const serialized = localStorage.getItem(exports.ACCOUNT_STORAGE_KEY);
    if (!serialized) {
        return null;
    }
    try {
        const parsed = JSON.parse(serialized);
        return isAccount(parsed) ? parsed : null;
    }
    catch {
        return null;
    }
};
exports.loadAccount = loadAccount;
