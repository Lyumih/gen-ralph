import { create } from "zustand";
import { loadAccount, saveAccount } from "../data/accountStorage";
const createHero = (name) => {
    const normalizedName = name.trim();
    return {
        id: `hero_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
        name: normalizedName,
    };
};
export const useAppStore = create((set) => ({
    isInitialized: false,
    currentAccount: loadAccount(),
    setInitialized: (value) => set({ isInitialized: value }),
    loginAccount: (account) => {
        saveAccount(account);
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
            saveAccount(nextAccount);
            return { currentAccount: nextAccount };
        });
    },
}));
