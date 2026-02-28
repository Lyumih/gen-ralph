import { create } from "zustand";
import { loadAccount, saveAccount } from "../data/accountStorage";
import type { Account, Hero } from "../models/account";

const createHero = (name: string): Hero => {
  const normalizedName = name.trim();
  return {
    id: `hero_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    name: normalizedName,
  };
};

type AppState = {
  isInitialized: boolean;
  currentAccount: Account | null;
  setInitialized: (value: boolean) => void;
  loginAccount: (account: Account) => void;
  addHeroToCurrentAccount: (heroName: string) => void;
  setActiveHeroForCurrentAccount: (heroId: string) => void;
};

export const useAppStore = create<AppState>((set) => ({
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

      const nextAccount: Account = {
        ...state.currentAccount,
        heroes: [...state.currentAccount.heroes, createHero(normalizedName)],
      };

      saveAccount(nextAccount);
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

      const nextAccount: Account = {
        ...state.currentAccount,
        activeHeroId: normalizedHeroId,
      };

      saveAccount(nextAccount);
      return { currentAccount: nextAccount };
    });
  },
}));
