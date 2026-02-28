// src/data/accountStorage.ts
var ACCOUNT_STORAGE_KEY = "gen_account";
var isHero = (value) => {
  if (typeof value !== "object" || value === null) {
    return false;
  }
  const candidate = value;
  return typeof candidate.id === "string" && typeof candidate.name === "string";
};
var isAccount = (value) => {
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
  return candidate.activeHeroId === void 0 || typeof candidate.activeHeroId === "string";
};
var saveAccount = (account) => {
  localStorage.setItem(ACCOUNT_STORAGE_KEY, JSON.stringify(account));
};
var loadAccount = () => {
  const serialized = localStorage.getItem(ACCOUNT_STORAGE_KEY);
  if (!serialized) {
    return null;
  }
  try {
    const parsed = JSON.parse(serialized);
    return isAccount(parsed) ? parsed : null;
  } catch {
    return null;
  }
};
export {
  ACCOUNT_STORAGE_KEY,
  loadAccount,
  saveAccount
};
