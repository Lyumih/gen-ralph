"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useAppStore = void 0;
const zustand_1 = require("zustand");
const accountStorage_1 = require("../data/accountStorage");
const enemy_1 = require("../models/enemy");
const heroProgression_1 = require("../models/heroProgression");
const battle_1 = require("../models/battle");
const createHero = (name) => {
    const normalizedName = name.trim();
    const id = `hero_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
    return (0, heroProgression_1.createNewHero)(id, normalizedName);
};
const createInitialBattleState = () => ({
    isActive: false,
    playerHp: 0,
    playerMaxHp: 0,
    enemy: null,
    enemyHp: 0,
    enemyMaxHp: 0,
    currentTurn: "player",
    battleLog: [],
    abilityCooldowns: {},
});
exports.useAppStore = (0, zustand_1.create)((set) => ({
    isInitialized: false,
    currentAccount: (0, accountStorage_1.loadAccount)(),
    battle: createInitialBattleState(),
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
    startBattle: (enemyId) => {
        const normalizedEnemyId = enemyId.trim();
        if (!normalizedEnemyId) {
            return false;
        }
        let didStartBattle = false;
        set((state) => {
            if (!state.currentAccount?.activeHeroId) {
                return state;
            }
            const activeHero = state.currentAccount.heroes.find((hero) => hero.id === state.currentAccount?.activeHeroId);
            if (!activeHero) {
                return state;
            }
            const enemy = (0, enemy_1.createScaledEnemy)(normalizedEnemyId, state.currentAccount.enemyCounter ?? 0);
            if (!enemy) {
                return state;
            }
            didStartBattle = true;
            return {
                battle: {
                    isActive: true,
                    playerHp: activeHero.stats.maxHp,
                    playerMaxHp: activeHero.stats.maxHp,
                    enemy,
                    enemyHp: enemy.stats.hp,
                    enemyMaxHp: enemy.stats.hp,
                    currentTurn: "player",
                    battleLog: [
                        `Бой начался: ${activeHero.name} против ${enemy.name}.`,
                        `HP героя: ${activeHero.stats.maxHp}, HP врага: ${enemy.stats.hp}.`,
                    ],
                    abilityCooldowns: {},
                },
            };
        });
        return didStartBattle;
    },
    resetBattle: () => set({ battle: createInitialBattleState() }),
    setPlayerHp: (nextHp) => set((state) => {
        const normalizedHp = Number.isFinite(nextHp) ? Math.floor(nextHp) : state.battle.playerHp;
        return {
            battle: {
                ...state.battle,
                playerHp: Math.max(0, Math.min(state.battle.playerMaxHp, normalizedHp)),
            },
        };
    }),
    setEnemyHp: (nextHp) => set((state) => {
        const normalizedHp = Number.isFinite(nextHp) ? Math.floor(nextHp) : state.battle.enemyHp;
        return {
            battle: {
                ...state.battle,
                enemyHp: Math.max(0, Math.min(state.battle.enemyMaxHp, normalizedHp)),
            },
        };
    }),
    setCurrentTurn: (nextTurn) => set((state) => ({
        battle: {
            ...state.battle,
            currentTurn: nextTurn,
        },
    })),
    pushBattleLog: (message) => set((state) => {
        const normalizedMessage = message.trim();
        if (!normalizedMessage) {
            return state;
        }
        return {
            battle: {
                ...state.battle,
                battleLog: [...state.battle.battleLog, normalizedMessage],
            },
        };
    }),
    setAbilityCooldown: (abilityId, turns) => set((state) => {
        const normalizedAbilityId = abilityId.trim();
        if (!normalizedAbilityId) {
            return state;
        }
        const normalizedTurns = Number.isFinite(turns) ? Math.max(0, Math.floor(turns)) : 0;
        return {
            battle: {
                ...state.battle,
                abilityCooldowns: {
                    ...state.battle.abilityCooldowns,
                    [normalizedAbilityId]: normalizedTurns,
                },
            },
        };
    }),
    performWeaponAttack: () => set((state) => {
        if (!state.currentAccount?.activeHeroId || !state.battle.isActive || !state.battle.enemy) {
            return state;
        }
        if (state.battle.currentTurn !== "player") {
            return state;
        }
        const activeHero = state.currentAccount.heroes.find((hero) => hero.id === state.currentAccount?.activeHeroId);
        if (!activeHero) {
            return state;
        }
        const damage = (0, battle_1.calculateWeaponDamage)(activeHero.stats.attack, state.battle.enemy.stats.defense);
        const nextEnemyHp = Math.max(0, state.battle.enemyHp - damage);
        const nextLog = [
            ...state.battle.battleLog,
            `${activeHero.name} атакует оружием и наносит ${damage} урона.`,
        ];
        if (nextEnemyHp <= 0) {
            return {
                battle: {
                    ...state.battle,
                    enemyHp: 0,
                    isActive: false,
                    currentTurn: "player",
                    battleLog: [...nextLog, `Победа! ${state.battle.enemy.name} повержен.`],
                },
            };
        }
        return {
            battle: {
                ...state.battle,
                enemyHp: nextEnemyHp,
                currentTurn: "player",
                battleLog: [...nextLog, `HP врага: ${nextEnemyHp}/${state.battle.enemyMaxHp}.`],
            },
        };
    }),
}));
