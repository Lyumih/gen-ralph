import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { Button, Card, Input, List, Space, Typography } from "antd";
import { Navigate, Route, Routes, useNavigate } from "react-router-dom";
import { loadAccount } from "./data/accountStorage";
import { initializeSeedAccountsStorageIfEmpty, readSeedAccountsFromStorage, SEED_ACCOUNTS_STORAGE_KEY, } from "./data/seedAccounts";
import { getExpRequiredForNextLevel, hydrateHero } from "./models/heroProgression";
import { useAppStore } from "./store/useAppStore";
const LoginScreen = () => {
    const navigate = useNavigate();
    const currentAccount = useAppStore((state) => state.currentAccount);
    const loginAccount = useAppStore((state) => state.loginAccount);
    const [selectedLogin, setSelectedLogin] = useState(null);
    const [accounts, setAccounts] = useState([]);
    useEffect(() => {
        const nextAccounts = readSeedAccountsFromStorage();
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
        const existing = loadAccount();
        const nextAccount = existing && existing.login === selectedSeed.login
            ? existing
            : {
                login: selectedSeed.login,
                nickname: selectedSeed.nickname,
                heroes: (selectedSeed.heroes ?? [])
                    .map(hydrateHero)
                    .filter((hero) => hero !== null),
                enemyCounter: 0,
            };
        loginAccount(nextAccount);
        navigate("/heroes");
    };
    return (_jsxs(Space, { direction: "vertical", size: "middle", style: { width: "100%", maxWidth: 560 }, children: [_jsx(Typography.Title, { level: 2, children: "Gen: Browser Mage RPG" }), _jsx(Typography.Text, { children: "\u0412\u044B\u0431\u0435\u0440\u0438\u0442\u0435 \u0442\u0435\u0441\u0442\u043E\u0432\u044B\u0439 \u0430\u043A\u043A\u0430\u0443\u043D\u0442 \u0434\u043B\u044F \u0432\u0445\u043E\u0434\u0430:" }), _jsx(Card, { children: _jsx(List, { dataSource: accounts, locale: { emptyText: "Тестовые аккаунты не найдены" }, renderItem: (account) => (_jsx(List.Item, { onClick: () => setSelectedLogin(account.login), style: {
                            cursor: "pointer",
                            backgroundColor: selectedLogin === account.login ? "#e6f4ff" : undefined,
                            borderRadius: 8,
                            paddingInline: 12,
                        }, children: _jsxs(Space, { direction: "vertical", size: 0, children: [_jsx(Typography.Text, { strong: true, children: account.nickname }), _jsx(Typography.Text, { type: "secondary", children: account.login })] }) })) }) }), _jsxs(Space, { children: [_jsx(Button, { type: "primary", onClick: handleLogin, disabled: !selectedLogin, children: "\u0412\u043E\u0439\u0442\u0438" }), currentAccount && (_jsxs(Typography.Text, { type: "secondary", children: ["\u0422\u0435\u043A\u0443\u0449\u0438\u0439 \u0430\u043A\u043A\u0430\u0443\u043D\u0442: ", currentAccount.login] }))] })] }));
};
const HeroesScreen = () => {
    const navigate = useNavigate();
    const currentAccount = useAppStore((state) => state.currentAccount);
    const addHeroToCurrentAccount = useAppStore((state) => state.addHeroToCurrentAccount);
    const setActiveHeroForCurrentAccount = useAppStore((state) => state.setActiveHeroForCurrentAccount);
    const [heroName, setHeroName] = useState("");
    const [nameError, setNameError] = useState(null);
    if (!currentAccount) {
        return _jsx(Navigate, { to: "/", replace: true });
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
    const getHeroSummary = (hero) => `Ур. ${hero.level} | XP ${hero.exp}/${getExpRequiredForNextLevel(hero.level)} | HP ${hero.stats.maxHp} | ATK ${hero.stats.attack} | DEF ${hero.stats.defense}`;
    return (_jsxs(Space, { direction: "vertical", size: "middle", style: { width: "100%", maxWidth: 560 }, children: [_jsx(Typography.Title, { level: 3, children: "\u0413\u0435\u0440\u043E\u0438 \u0430\u043A\u043A\u0430\u0443\u043D\u0442\u0430" }), _jsxs(Typography.Text, { children: ["\u0412\u0445\u043E\u0434 \u0432\u044B\u043F\u043E\u043B\u043D\u0435\u043D: ", currentAccount.nickname, " (", currentAccount.login, ")"] }), _jsxs(Typography.Text, { type: "secondary", children: ["\u0410\u043A\u0442\u0438\u0432\u043D\u044B\u0439 \u0433\u0435\u0440\u043E\u0439:", " ", currentAccount.heroes.find((hero) => hero.id === currentAccount.activeHeroId)?.name ?? "не выбран"] }), _jsx(Card, { title: `Всего героев: ${currentAccount.heroes.length}`, children: _jsx(List, { dataSource: currentAccount.heroes, locale: { emptyText: "Героев пока нет" }, renderItem: (hero) => (_jsx(List.Item, { children: _jsxs(Space, { style: { width: "100%", justifyContent: "space-between" }, align: "start", children: [_jsxs(Space, { direction: "vertical", size: 0, children: [_jsx(Typography.Text, { strong: true, children: hero.name }), _jsx(Typography.Text, { type: "secondary", children: getHeroSummary(hero) })] }), _jsx(Button, { type: currentAccount.activeHeroId === hero.id ? "primary" : "default", onClick: () => setActiveHeroForCurrentAccount(hero.id), children: currentAccount.activeHeroId === hero.id ? "Активный" : "Выбрать" })] }) })) }) }), _jsx(Card, { title: "\u0421\u043E\u0437\u0434\u0430\u0442\u044C \u0433\u0435\u0440\u043E\u044F", children: _jsxs(Space, { direction: "vertical", size: "small", style: { width: "100%" }, children: [_jsx(Input, { value: heroName, onChange: (event) => {
                                setHeroName(event.target.value);
                                if (nameError) {
                                    setNameError(null);
                                }
                            }, placeholder: "\u0412\u0432\u0435\u0434\u0438\u0442\u0435 \u0438\u043C\u044F \u0433\u0435\u0440\u043E\u044F", maxLength: 32 }), nameError && _jsx(Typography.Text, { type: "danger", children: nameError }), _jsx(Button, { type: "primary", onClick: handleCreateHero, children: "\u0421\u043E\u0437\u0434\u0430\u0442\u044C \u0433\u0435\u0440\u043E\u044F" })] }) }), _jsx(Button, { type: "primary", disabled: !currentAccount.activeHeroId, onClick: () => navigate("/battle"), children: "\u041A \u0431\u043E\u044E" })] }));
};
const BattleScreen = () => {
    const currentAccount = useAppStore((state) => state.currentAccount);
    const battle = useAppStore((state) => state.battle);
    const startBattle = useAppStore((state) => state.startBattle);
    const setPlayerHp = useAppStore((state) => state.setPlayerHp);
    const setEnemyHp = useAppStore((state) => state.setEnemyHp);
    const setCurrentTurn = useAppStore((state) => state.setCurrentTurn);
    const pushBattleLog = useAppStore((state) => state.pushBattleLog);
    const setAbilityCooldown = useAppStore((state) => state.setAbilityCooldown);
    const performWeaponAttack = useAppStore((state) => state.performWeaponAttack);
    if (!currentAccount) {
        return _jsx(Navigate, { to: "/", replace: true });
    }
    const activeHero = currentAccount.heroes.find((hero) => hero.id === currentAccount.activeHeroId);
    if (!activeHero) {
        return _jsx(Navigate, { to: "/heroes", replace: true });
    }
    useEffect(() => {
        startBattle("training-golem");
    }, [startBattle]);
    if (!battle.isActive || !battle.enemy) {
        return (_jsxs(Space, { direction: "vertical", size: "middle", style: { width: "100%", maxWidth: 560 }, children: [_jsx(Typography.Title, { level: 3, children: "\u0411\u043E\u0439" }), _jsx(Typography.Text, { type: "danger", children: "\u041D\u0435 \u0443\u0434\u0430\u043B\u043E\u0441\u044C \u0438\u043D\u0438\u0446\u0438\u0430\u043B\u0438\u0437\u0438\u0440\u043E\u0432\u0430\u0442\u044C \u0441\u043E\u0441\u0442\u043E\u044F\u043D\u0438\u0435 \u0431\u043E\u044F" })] }));
    }
    return (_jsxs(Space, { direction: "vertical", size: "middle", style: { width: "100%", maxWidth: 560 }, children: [_jsx(Typography.Title, { level: 3, children: "\u0411\u043E\u0439" }), _jsxs(Typography.Text, { children: ["\u0412 \u0431\u043E\u0439 \u0432\u044B\u0431\u0440\u0430\u043D \u0433\u0435\u0440\u043E\u0439: ", _jsx(Typography.Text, { strong: true, children: activeHero.name })] }), _jsxs(Typography.Text, { type: "secondary", children: ["\u0425\u043E\u0434: ", battle.currentTurn === "player" ? "игрок" : "враг"] }), _jsxs(Typography.Text, { type: battle.isActive ? "secondary" : "success", children: ["\u0421\u0442\u0430\u0442\u0443\u0441 \u0431\u043E\u044F: ", battle.isActive ? "в процессе" : "победа"] }), _jsx(Card, { title: `Враг: ${battle.enemy.name}`, children: _jsxs(Space, { direction: "vertical", size: 0, children: [_jsxs(Typography.Text, { type: "secondary", children: ["enemyCounter: ", battle.enemy.counter] }), _jsxs(Typography.Text, { children: ["HP \u0433\u0435\u0440\u043E\u044F: ", battle.playerHp, "/", battle.playerMaxHp] }), _jsxs(Typography.Text, { children: ["HP \u0432\u0440\u0430\u0433\u0430: ", battle.enemyHp, "/", battle.enemyMaxHp] }), _jsxs(Typography.Text, { children: ["ATK \u0432\u0440\u0430\u0433\u0430: ", battle.enemy.stats.attack] }), _jsxs(Typography.Text, { children: ["DEF \u0432\u0440\u0430\u0433\u0430: ", battle.enemy.stats.defense] }), _jsxs(Typography.Text, { children: ["\u041A\u0414 \u0443\u043C\u0435\u043D\u0438\u0439: ", JSON.stringify(battle.abilityCooldowns)] })] }) }), _jsxs(Space, { wrap: true, children: [_jsx(Button, { type: "primary", onClick: performWeaponAttack, disabled: !battle.isActive, children: "\u0423\u0434\u0430\u0440 \u043E\u0440\u0443\u0436\u0438\u0435\u043C" }), _jsx(Button, { onClick: () => setPlayerHp(battle.playerHp - 10), children: "\u0413\u0435\u0440\u043E\u0439 -10 HP" }), _jsx(Button, { onClick: () => setEnemyHp(battle.enemyHp - 10), children: "\u0412\u0440\u0430\u0433 -10 HP" }), _jsx(Button, { onClick: () => {
                            const nextTurn = battle.currentTurn === "player" ? "enemy" : "player";
                            setCurrentTurn(nextTurn);
                            pushBattleLog(`Смена хода: ${nextTurn === "player" ? "игрок" : "враг"}.`);
                        }, children: "\u0421\u043C\u0435\u043D\u0438\u0442\u044C \u0445\u043E\u0434" }), _jsx(Button, { onClick: () => {
                            const nextCooldown = battle.abilityCooldowns.fireball && battle.abilityCooldowns.fireball > 0
                                ? battle.abilityCooldowns.fireball - 1
                                : 3;
                            setAbilityCooldown("fireball", nextCooldown);
                            pushBattleLog(`КД Fireball: ${nextCooldown}`);
                        }, children: "\u041E\u0431\u043D\u043E\u0432\u0438\u0442\u044C \u041A\u0414" })] }), _jsx(Card, { title: "\u041B\u043E\u0433 \u0431\u043E\u044F", children: _jsx(List, { size: "small", dataSource: battle.battleLog, locale: { emptyText: "Лог пуст" }, renderItem: (entry) => _jsx(List.Item, { children: entry }) }) })] }));
};
const App = () => {
    const isInitialized = useAppStore((state) => state.isInitialized);
    const setInitialized = useAppStore((state) => state.setInitialized);
    const [seedInitError, setSeedInitError] = useState(null);
    useEffect(() => {
        let active = true;
        void initializeSeedAccountsStorageIfEmpty()
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
    return (_jsxs("main", { style: { padding: 24 }, children: [seedInitError && (_jsxs(Typography.Text, { type: "danger", children: ["Seed initialization error: ", seedInitError] })), _jsxs(Typography.Paragraph, { type: "secondary", children: ["Router initialized. Store status: ", isInitialized ? "ready" : "idle", ". Seed storage key: ", " ", SEED_ACCOUNTS_STORAGE_KEY] }), _jsxs(Routes, { children: [_jsx(Route, { path: "/", element: _jsx(LoginScreen, {}) }), _jsx(Route, { path: "/heroes", element: _jsx(HeroesScreen, {}) }), _jsx(Route, { path: "/battle", element: _jsx(BattleScreen, {}) })] })] }));
};
export default App;
