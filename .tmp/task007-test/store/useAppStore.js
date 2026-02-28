"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useAppStore = void 0;
const zustand_1 = require("zustand");
const accountStorage_1 = require("../data/accountStorage");
const createHero = (name) => {
    const normalizedName = name.trim();
    return {
        id: `hero_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
        name: normalizedName,
    };
};
exports.useAppStore = (0, zustand_1.create)((set) => ({
    isInitialized: false,
    currentAccount: (0, accountStorage_1.loadAccount)(),
    setInitialized: (value) => set({ isInitialized: value }),
    loginAccount: (account) => {
        (0, accountStorage_1.saveAccount)(account);
        set({ currentAccount: account });
    },
    addHeroToCurrentAccount: (heroName) => {
        const normalizedName = heroName.trim();
        if (!normalizedName) {
            return;
        }
        set((state) => {
            if (!state.currentAccount) {
                return state;
            }
            const nextAccount = {
                ...state.currentAccount,
                heroes: [...state.currentAccount.heroes, createHero(normalizedName)],
            };
            (0, accountStorage_1.saveAccount)(nextAccount);
            return { currentAccount: nextAccount };
        });
    },
    setActiveHeroForCurrentAccount: (heroId) => {
        const normalizedHeroId = heroId.trim();
        if (!normalizedHeroId) {
            return;
        }
        set((state) => {
            if (!state.currentAccount) {
                return state;
            }
            const heroExists = state.currentAccount.heroes.some((hero) => hero.id === normalizedHeroId);
            if (!heroExists) {
                return state;
            }
            const nextAccount = {
                ...state.currentAccount,
                activeHeroId: normalizedHeroId,
            };
            (0, accountStorage_1.saveAccount)(nextAccount);
            return { currentAccount: nextAccount };
        });
    },
}));
