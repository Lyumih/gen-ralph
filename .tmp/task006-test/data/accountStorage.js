export const ACCOUNT_STORAGE_KEY = "gen_account";
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
export const saveAccount = (account) => {
    localStorage.setItem(ACCOUNT_STORAGE_KEY, JSON.stringify(account));
};
export const loadAccount = () => {
    const serialized = localStorage.getItem(ACCOUNT_STORAGE_KEY);
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
