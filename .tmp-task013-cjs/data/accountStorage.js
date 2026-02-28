"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadAccount = exports.saveAccount = exports.ACCOUNT_STORAGE_KEY = void 0;
const heroProgression_1 = require("../models/heroProgression");
exports.ACCOUNT_STORAGE_KEY = "gen_account";
const normalizeAccount = (value) => {
    if (typeof value !== "object" || value === null) {
        return null;
    }
    const candidate = value;
    if (typeof candidate.login !== "string" || typeof candidate.nickname !== "string") {
        return null;
    }
    if (!Array.isArray(candidate.heroes)) {
        return null;
    }
    const normalizedHeroes = candidate.heroes
        .map(heroProgression_1.hydrateHero)
        .filter((hero) => hero !== null);
    if (normalizedHeroes.length !== candidate.heroes.length) {
        return null;
    }
    const activeHeroId = typeof candidate.activeHeroId === "string" &&
        normalizedHeroes.some((hero) => hero.id === candidate.activeHeroId)
        ? candidate.activeHeroId
        : undefined;
    const enemyCounter = typeof candidate.enemyCounter === "number" &&
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
        return normalizeAccount(parsed);
    }
    catch {
        return null;
    }
};
exports.loadAccount = loadAccount;
