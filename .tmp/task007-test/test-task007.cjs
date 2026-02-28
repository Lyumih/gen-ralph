const assert = (cond, msg) => { if (!cond) throw new Error(msg); };

class MemoryStorage {
  constructor() { this.map = new Map(); }
  getItem(key) { return this.map.has(key) ? this.map.get(key) : null; }
  setItem(key, value) { this.map.set(key, String(value)); }
  removeItem(key) { this.map.delete(key); }
  clear() { this.map.clear(); }
}

global.localStorage = new MemoryStorage();

const loadStore = () => {
  const storePath = 'C:/sites/gen-ralph/.tmp/task007-test/store/useAppStore.js';
  const storagePath = 'C:/sites/gen-ralph/.tmp/task007-test/data/accountStorage.js';

  delete require.cache[require.resolve(storePath)];
  delete require.cache[require.resolve(storagePath)];

  const { useAppStore } = require(storePath);
  const { loadAccount } = require(storagePath);
  return { useAppStore, loadAccount };
};

const first = loadStore();
first.useAppStore.getState().loginAccount({
  login: 'mage.alpha',
  nickname: 'Mage Alpha',
  heroes: [
    { id: 'hero-A', name: 'Hero A' },
    { id: 'hero-B', name: 'Hero B' }
  ]
});

first.useAppStore.getState().setActiveHeroForCurrentAccount('hero-A');
assert(first.useAppStore.getState().currentAccount?.activeHeroId === 'hero-A', 'Step 1: activeHeroId in store should be hero-A');
assert(first.loadAccount()?.activeHeroId === 'hero-A', 'Step 1: activeHeroId in localStorage should be hero-A');

const second = loadStore();
assert(second.useAppStore.getState().currentAccount?.activeHeroId === 'hero-A', 'Step 1: reload should keep hero-A');

second.useAppStore.getState().setActiveHeroForCurrentAccount('hero-B');
assert(second.useAppStore.getState().currentAccount?.activeHeroId === 'hero-B', 'Step 2: activeHeroId in store should be hero-B');
assert(second.loadAccount()?.activeHeroId === 'hero-B', 'Step 2: activeHeroId in localStorage should be hero-B');

console.log('TASK-007 test steps 1-2 passed');
