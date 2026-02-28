"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const antd_1 = require("antd");
const react_router_dom_1 = require("react-router-dom");
const accountStorage_1 = require("./data/accountStorage");
const seedAccounts_1 = require("./data/seedAccounts");
const heroProgression_1 = require("./models/heroProgression");
const useAppStore_1 = require("./store/useAppStore");
const LoginScreen = () => {
    const navigate = (0, react_router_dom_1.useNavigate)();
    const currentAccount = (0, useAppStore_1.useAppStore)((state) => state.currentAccount);
    const loginAccount = (0, useAppStore_1.useAppStore)((state) => state.loginAccount);
    const [selectedLogin, setSelectedLogin] = (0, react_1.useState)(null);
    const [accounts, setAccounts] = (0, react_1.useState)([]);
    (0, react_1.useEffect)(() => {
        const nextAccounts = (0, seedAccounts_1.readSeedAccountsFromStorage)();
        setAccounts(nextAccounts);
    }, []);
    const handleLogin = () => {
        if (!selectedLogin) {
            return;
        }
        const selectedSeed = accounts.find((account) => account.login === selectedLogin);
        if (!selectedSeed) {
            return;
        }
        const existing = (0, accountStorage_1.loadAccount)();
        const nextAccount = existing && existing.login === selectedSeed.login
            ? existing
            : {
                login: selectedSeed.login,
                nickname: selectedSeed.nickname,
                heroes: (selectedSeed.heroes ?? [])
                    .map(heroProgression_1.hydrateHero)
                    .filter((hero) => hero !== null),
                enemyCounter: 0,
            };
        loginAccount(nextAccount);
        navigate("/heroes");
    };
    return ((0, jsx_runtime_1.jsxs)(antd_1.Space, { direction: "vertical", size: "middle", style: { width: "100%", maxWidth: 560 }, children: [(0, jsx_runtime_1.jsx)(antd_1.Typography.Title, { level: 2, children: "Gen: Browser Mage RPG" }), (0, jsx_runtime_1.jsx)(antd_1.Typography.Text, { children: "\u0412\u044B\u0431\u0435\u0440\u0438\u0442\u0435 \u0442\u0435\u0441\u0442\u043E\u0432\u044B\u0439 \u0430\u043A\u043A\u0430\u0443\u043D\u0442 \u0434\u043B\u044F \u0432\u0445\u043E\u0434\u0430:" }), (0, jsx_runtime_1.jsx)(antd_1.Card, { children: (0, jsx_runtime_1.jsx)(antd_1.List, { dataSource: accounts, locale: { emptyText: "Тестовые аккаунты не найдены" }, renderItem: (account) => ((0, jsx_runtime_1.jsx)(antd_1.List.Item, { onClick: () => setSelectedLogin(account.login), style: {
                            cursor: "pointer",
                            backgroundColor: selectedLogin === account.login ? "#e6f4ff" : undefined,
                            borderRadius: 8,
                            paddingInline: 12,
                        }, children: (0, jsx_runtime_1.jsxs)(antd_1.Space, { direction: "vertical", size: 0, children: [(0, jsx_runtime_1.jsx)(antd_1.Typography.Text, { strong: true, children: account.nickname }), (0, jsx_runtime_1.jsx)(antd_1.Typography.Text, { type: "secondary", children: account.login })] }) })) }) }), (0, jsx_runtime_1.jsxs)(antd_1.Space, { children: [(0, jsx_runtime_1.jsx)(antd_1.Button, { type: "primary", onClick: handleLogin, disabled: !selectedLogin, children: "\u0412\u043E\u0439\u0442\u0438" }), currentAccount && ((0, jsx_runtime_1.jsxs)(antd_1.Typography.Text, { type: "secondary", children: ["\u0422\u0435\u043A\u0443\u0449\u0438\u0439 \u0430\u043A\u043A\u0430\u0443\u043D\u0442: ", currentAccount.login] }))] })] }));
};
const HeroesScreen = () => {
    const navigate = (0, react_router_dom_1.useNavigate)();
    const currentAccount = (0, useAppStore_1.useAppStore)((state) => state.currentAccount);
    const addHeroToCurrentAccount = (0, useAppStore_1.useAppStore)((state) => state.addHeroToCurrentAccount);
    const setActiveHeroForCurrentAccount = (0, useAppStore_1.useAppStore)((state) => state.setActiveHeroForCurrentAccount);
    const [heroName, setHeroName] = (0, react_1.useState)("");
    const [nameError, setNameError] = (0, react_1.useState)(null);
    if (!currentAccount) {
        return (0, jsx_runtime_1.jsx)(react_router_dom_1.Navigate, { to: "/", replace: true });
    }
    const handleCreateHero = () => {
        const normalizedName = heroName.trim();
        if (!normalizedName) {
            setNameError("Введите имя героя");
            return;
        }
        addHeroToCurrentAccount(normalizedName);
        setHeroName("");
        setNameError(null);
    };
    const getHeroSummary = (hero) => `Ур. ${hero.level} | XP ${hero.exp}/${(0, heroProgression_1.getExpRequiredForNextLevel)(hero.level)} | HP ${hero.stats.maxHp} | ATK ${hero.stats.attack} | DEF ${hero.stats.defense}`;
    return ((0, jsx_runtime_1.jsxs)(antd_1.Space, { direction: "vertical", size: "middle", style: { width: "100%", maxWidth: 560 }, children: [(0, jsx_runtime_1.jsx)(antd_1.Typography.Title, { level: 3, children: "\u0413\u0435\u0440\u043E\u0438 \u0430\u043A\u043A\u0430\u0443\u043D\u0442\u0430" }), (0, jsx_runtime_1.jsxs)(antd_1.Typography.Text, { children: ["\u0412\u0445\u043E\u0434 \u0432\u044B\u043F\u043E\u043B\u043D\u0435\u043D: ", currentAccount.nickname, " (", currentAccount.login, ")"] }), (0, jsx_runtime_1.jsxs)(antd_1.Typography.Text, { type: "secondary", children: ["\u0410\u043A\u0442\u0438\u0432\u043D\u044B\u0439 \u0433\u0435\u0440\u043E\u0439:", " ", currentAccount.heroes.find((hero) => hero.id === currentAccount.activeHeroId)?.name ?? "не выбран"] }), (0, jsx_runtime_1.jsx)(antd_1.Card, { title: `Всего героев: ${currentAccount.heroes.length}`, children: (0, jsx_runtime_1.jsx)(antd_1.List, { dataSource: currentAccount.heroes, locale: { emptyText: "Героев пока нет" }, renderItem: (hero) => ((0, jsx_runtime_1.jsx)(antd_1.List.Item, { children: (0, jsx_runtime_1.jsxs)(antd_1.Space, { style: { width: "100%", justifyContent: "space-between" }, align: "start", children: [(0, jsx_runtime_1.jsxs)(antd_1.Space, { direction: "vertical", size: 0, children: [(0, jsx_runtime_1.jsx)(antd_1.Typography.Text, { strong: true, children: hero.name }), (0, jsx_runtime_1.jsx)(antd_1.Typography.Text, { type: "secondary", children: getHeroSummary(hero) })] }), (0, jsx_runtime_1.jsx)(antd_1.Button, { type: currentAccount.activeHeroId === hero.id ? "primary" : "default", onClick: () => setActiveHeroForCurrentAccount(hero.id), children: currentAccount.activeHeroId === hero.id ? "Активный" : "Выбрать" })] }) })) }) }), (0, jsx_runtime_1.jsx)(antd_1.Card, { title: "\u0421\u043E\u0437\u0434\u0430\u0442\u044C \u0433\u0435\u0440\u043E\u044F", children: (0, jsx_runtime_1.jsxs)(antd_1.Space, { direction: "vertical", size: "small", style: { width: "100%" }, children: [(0, jsx_runtime_1.jsx)(antd_1.Input, { value: heroName, onChange: (event) => {
                                setHeroName(event.target.value);
                                if (nameError) {
                                    setNameError(null);
                                }
                            }, placeholder: "\u0412\u0432\u0435\u0434\u0438\u0442\u0435 \u0438\u043C\u044F \u0433\u0435\u0440\u043E\u044F", maxLength: 32 }), nameError && (0, jsx_runtime_1.jsx)(antd_1.Typography.Text, { type: "danger", children: nameError }), (0, jsx_runtime_1.jsx)(antd_1.Button, { type: "primary", onClick: handleCreateHero, children: "\u0421\u043E\u0437\u0434\u0430\u0442\u044C \u0433\u0435\u0440\u043E\u044F" })] }) }), (0, jsx_runtime_1.jsx)(antd_1.Button, { type: "primary", disabled: !currentAccount.activeHeroId, onClick: () => navigate("/battle"), children: "\u041A \u0431\u043E\u044E" })] }));
};
const BattleScreen = () => {
    const currentAccount = (0, useAppStore_1.useAppStore)((state) => state.currentAccount);
    const battle = (0, useAppStore_1.useAppStore)((state) => state.battle);
    const startBattle = (0, useAppStore_1.useAppStore)((state) => state.startBattle);
    const setPlayerHp = (0, useAppStore_1.useAppStore)((state) => state.setPlayerHp);
    const setEnemyHp = (0, useAppStore_1.useAppStore)((state) => state.setEnemyHp);
    const setCurrentTurn = (0, useAppStore_1.useAppStore)((state) => state.setCurrentTurn);
    const pushBattleLog = (0, useAppStore_1.useAppStore)((state) => state.pushBattleLog);
    const setAbilityCooldown = (0, useAppStore_1.useAppStore)((state) => state.setAbilityCooldown);
    const performWeaponAttack = (0, useAppStore_1.useAppStore)((state) => state.performWeaponAttack);
    if (!currentAccount) {
        return (0, jsx_runtime_1.jsx)(react_router_dom_1.Navigate, { to: "/", replace: true });
    }
    const activeHero = currentAccount.heroes.find((hero) => hero.id === currentAccount.activeHeroId);
    if (!activeHero) {
        return (0, jsx_runtime_1.jsx)(react_router_dom_1.Navigate, { to: "/heroes", replace: true });
    }
    (0, react_1.useEffect)(() => {
        startBattle("training-golem");
    }, [startBattle]);
    if (!battle.isActive || !battle.enemy) {
        return ((0, jsx_runtime_1.jsxs)(antd_1.Space, { direction: "vertical", size: "middle", style: { width: "100%", maxWidth: 560 }, children: [(0, jsx_runtime_1.jsx)(antd_1.Typography.Title, { level: 3, children: "\u0411\u043E\u0439" }), (0, jsx_runtime_1.jsx)(antd_1.Typography.Text, { type: "danger", children: "\u041D\u0435 \u0443\u0434\u0430\u043B\u043E\u0441\u044C \u0438\u043D\u0438\u0446\u0438\u0430\u043B\u0438\u0437\u0438\u0440\u043E\u0432\u0430\u0442\u044C \u0441\u043E\u0441\u0442\u043E\u044F\u043D\u0438\u0435 \u0431\u043E\u044F" })] }));
    }
    return ((0, jsx_runtime_1.jsxs)(antd_1.Space, { direction: "vertical", size: "middle", style: { width: "100%", maxWidth: 560 }, children: [(0, jsx_runtime_1.jsx)(antd_1.Typography.Title, { level: 3, children: "\u0411\u043E\u0439" }), (0, jsx_runtime_1.jsxs)(antd_1.Typography.Text, { children: ["\u0412 \u0431\u043E\u0439 \u0432\u044B\u0431\u0440\u0430\u043D \u0433\u0435\u0440\u043E\u0439: ", (0, jsx_runtime_1.jsx)(antd_1.Typography.Text, { strong: true, children: activeHero.name })] }), (0, jsx_runtime_1.jsxs)(antd_1.Typography.Text, { type: "secondary", children: ["\u0425\u043E\u0434: ", battle.currentTurn === "player" ? "игрок" : "враг"] }), (0, jsx_runtime_1.jsxs)(antd_1.Typography.Text, { type: battle.isActive ? "secondary" : "success", children: ["\u0421\u0442\u0430\u0442\u0443\u0441 \u0431\u043E\u044F: ", battle.isActive ? "в процессе" : "победа"] }), (0, jsx_runtime_1.jsx)(antd_1.Card, { title: `Враг: ${battle.enemy.name}`, children: (0, jsx_runtime_1.jsxs)(antd_1.Space, { direction: "vertical", size: 0, children: [(0, jsx_runtime_1.jsxs)(antd_1.Typography.Text, { type: "secondary", children: ["enemyCounter: ", battle.enemy.counter] }), (0, jsx_runtime_1.jsxs)(antd_1.Typography.Text, { children: ["HP \u0433\u0435\u0440\u043E\u044F: ", battle.playerHp, "/", battle.playerMaxHp] }), (0, jsx_runtime_1.jsxs)(antd_1.Typography.Text, { children: ["HP \u0432\u0440\u0430\u0433\u0430: ", battle.enemyHp, "/", battle.enemyMaxHp] }), (0, jsx_runtime_1.jsxs)(antd_1.Typography.Text, { children: ["ATK \u0432\u0440\u0430\u0433\u0430: ", battle.enemy.stats.attack] }), (0, jsx_runtime_1.jsxs)(antd_1.Typography.Text, { children: ["DEF \u0432\u0440\u0430\u0433\u0430: ", battle.enemy.stats.defense] }), (0, jsx_runtime_1.jsxs)(antd_1.Typography.Text, { children: ["\u041A\u0414 \u0443\u043C\u0435\u043D\u0438\u0439: ", JSON.stringify(battle.abilityCooldowns)] })] }) }), (0, jsx_runtime_1.jsxs)(antd_1.Space, { wrap: true, children: [(0, jsx_runtime_1.jsx)(antd_1.Button, { type: "primary", onClick: performWeaponAttack, disabled: !battle.isActive, children: "\u0423\u0434\u0430\u0440 \u043E\u0440\u0443\u0436\u0438\u0435\u043C" }), (0, jsx_runtime_1.jsx)(antd_1.Button, { onClick: () => setPlayerHp(battle.playerHp - 10), children: "\u0413\u0435\u0440\u043E\u0439 -10 HP" }), (0, jsx_runtime_1.jsx)(antd_1.Button, { onClick: () => setEnemyHp(battle.enemyHp - 10), children: "\u0412\u0440\u0430\u0433 -10 HP" }), (0, jsx_runtime_1.jsx)(antd_1.Button, { onClick: () => {
                            const nextTurn = battle.currentTurn === "player" ? "enemy" : "player";
                            setCurrentTurn(nextTurn);
                            pushBattleLog(`Смена хода: ${nextTurn === "player" ? "игрок" : "враг"}.`);
                        }, children: "\u0421\u043C\u0435\u043D\u0438\u0442\u044C \u0445\u043E\u0434" }), (0, jsx_runtime_1.jsx)(antd_1.Button, { onClick: () => {
                            const nextCooldown = battle.abilityCooldowns.fireball && battle.abilityCooldowns.fireball > 0
                                ? battle.abilityCooldowns.fireball - 1
                                : 3;
                            setAbilityCooldown("fireball", nextCooldown);
                            pushBattleLog(`КД Fireball: ${nextCooldown}`);
                        }, children: "\u041E\u0431\u043D\u043E\u0432\u0438\u0442\u044C \u041A\u0414" })] }), (0, jsx_runtime_1.jsx)(antd_1.Card, { title: "\u041B\u043E\u0433 \u0431\u043E\u044F", children: (0, jsx_runtime_1.jsx)(antd_1.List, { size: "small", dataSource: battle.battleLog, locale: { emptyText: "Лог пуст" }, renderItem: (entry) => (0, jsx_runtime_1.jsx)(antd_1.List.Item, { children: entry }) }) })] }));
};
const App = () => {
    const isInitialized = (0, useAppStore_1.useAppStore)((state) => state.isInitialized);
    const setInitialized = (0, useAppStore_1.useAppStore)((state) => state.setInitialized);
    const [seedInitError, setSeedInitError] = (0, react_1.useState)(null);
    (0, react_1.useEffect)(() => {
        let active = true;
        void (0, seedAccounts_1.initializeSeedAccountsStorageIfEmpty)()
            .then(() => {
            if (!active) {
                return;
            }
            setInitialized(true);
        })
            .catch((error) => {
            if (!active) {
                return;
            }
            const message = error instanceof Error ? error.message : "Unknown error";
            setSeedInitError(message);
        });
        return () => {
            active = false;
        };
    }, [setInitialized]);
    return ((0, jsx_runtime_1.jsxs)("main", { style: { padding: 24 }, children: [seedInitError && ((0, jsx_runtime_1.jsxs)(antd_1.Typography.Text, { type: "danger", children: ["Seed initialization error: ", seedInitError] })), (0, jsx_runtime_1.jsxs)(antd_1.Typography.Paragraph, { type: "secondary", children: ["Router initialized. Store status: ", isInitialized ? "ready" : "idle", ". Seed storage key: ", " ", seedAccounts_1.SEED_ACCOUNTS_STORAGE_KEY] }), (0, jsx_runtime_1.jsxs)(react_router_dom_1.Routes, { children: [(0, jsx_runtime_1.jsx)(react_router_dom_1.Route, { path: "/", element: (0, jsx_runtime_1.jsx)(LoginScreen, {}) }), (0, jsx_runtime_1.jsx)(react_router_dom_1.Route, { path: "/heroes", element: (0, jsx_runtime_1.jsx)(HeroesScreen, {}) }), (0, jsx_runtime_1.jsx)(react_router_dom_1.Route, { path: "/battle", element: (0, jsx_runtime_1.jsx)(BattleScreen, {}) })] })] }));
};
exports.default = App;
