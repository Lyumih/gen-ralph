import { create } from "zustand";
import { loadAccount, saveAccount } from "../data/accountStorage";
import type { Account } from "../models/account";

type AppState = {
  isInitialized: boolean;
  currentAccount: Account | null;
  setInitialized: (value: boolean) => void;
  loginAccount: (account: Account) => void;
};

export const useAppStore = create<AppState>((set) => ({
  isInitialized: false,
  currentAccount: loadAccount(),
  setInitialized: (value) => set({ isInitialized: value }),
  loginAccount: (account) => {
    saveAccount(account);
    set({ currentAccount: account });
  },
}));
