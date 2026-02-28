import type { FC } from "react";
import { useEffect, useState } from "react";
import { Button, Card, Input, List, Space, Typography } from "antd";
import { Navigate, Route, Routes, useNavigate } from "react-router-dom";
import { loadAccount } from "./data/accountStorage";
import {
  initializeSeedAccountsStorageIfEmpty,
  readSeedAccountsFromStorage,
  SEED_ACCOUNTS_STORAGE_KEY,
  type SeedAccount,
} from "./data/seedAccounts";
import type { Account, Hero } from "./models/account";
import { createScaledEnemy } from "./models/enemy";
import { getExpRequiredForNextLevel, hydrateHero } from "./models/heroProgression";
import { useAppStore } from "./store/useAppStore";

const LoginScreen: FC = () => {
  const navigate = useNavigate();
  const currentAccount = useAppStore((state) => state.currentAccount);
  const loginAccount = useAppStore((state) => state.loginAccount);
  const [selectedLogin, setSelectedLogin] = useState<string | null>(null);
  const [accounts, setAccounts] = useState<SeedAccount[]>([]);

  useEffect(() => {
    const nextAccounts = readSeedAccountsFromStorage();
    setAccounts(nextAccounts);
  }, []);

  const handleLogin = (): void => {
    if (!selectedLogin) {
      return;
    }

    const selectedSeed = accounts.find((account) => account.login === selectedLogin);
    if (!selectedSeed) {
      return;
    }

    const existing = loadAccount();
    const nextAccount: Account =
      existing && existing.login === selectedSeed.login
        ? existing
        : {
            login: selectedSeed.login,
            nickname: selectedSeed.nickname,
            heroes: (selectedSeed.heroes ?? [])
              .map(hydrateHero)
              .filter((hero): hero is Hero => hero !== null),
            enemyCounter: 0,
          };

    loginAccount(nextAccount);
    navigate("/heroes");
  };

  return (
    <Space direction="vertical" size="middle" style={{ width: "100%", maxWidth: 560 }}>
      <Typography.Title level={2}>Gen: Browser Mage RPG</Typography.Title>
      <Typography.Text>Выберите тестовый аккаунт для входа:</Typography.Text>
      <Card>
        <List
          dataSource={accounts}
          locale={{ emptyText: "Тестовые аккаунты не найдены" }}
          renderItem={(account) => (
            <List.Item
              onClick={() => setSelectedLogin(account.login)}
              style={{
                cursor: "pointer",
                backgroundColor: selectedLogin === account.login ? "#e6f4ff" : undefined,
                borderRadius: 8,
                paddingInline: 12,
              }}
            >
              <Space direction="vertical" size={0}>
                <Typography.Text strong>{account.nickname}</Typography.Text>
                <Typography.Text type="secondary">{account.login}</Typography.Text>
              </Space>
            </List.Item>
          )}
        />
      </Card>
      <Space>
        <Button type="primary" onClick={handleLogin} disabled={!selectedLogin}>
          Войти
        </Button>
        {currentAccount && (
          <Typography.Text type="secondary">Текущий аккаунт: {currentAccount.login}</Typography.Text>
        )}
      </Space>
    </Space>
  );
};

const HeroesScreen: FC = () => {
  const navigate = useNavigate();
  const currentAccount = useAppStore((state) => state.currentAccount);
  const addHeroToCurrentAccount = useAppStore((state) => state.addHeroToCurrentAccount);
  const setActiveHeroForCurrentAccount = useAppStore((state) => state.setActiveHeroForCurrentAccount);
  const [heroName, setHeroName] = useState("");
  const [nameError, setNameError] = useState<string | null>(null);

  if (!currentAccount) {
    return <Navigate to="/" replace />;
  }

  const handleCreateHero = (): void => {
    const normalizedName = heroName.trim();
    if (!normalizedName) {
      setNameError("Введите имя героя");
      return;
    }

    addHeroToCurrentAccount(normalizedName);
    setHeroName("");
    setNameError(null);
  };

  const getHeroSummary = (hero: Hero): string =>
    `Ур. ${hero.level} | XP ${hero.exp}/${getExpRequiredForNextLevel(hero.level)} | HP ${hero.stats.maxHp} | ATK ${hero.stats.attack} | DEF ${hero.stats.defense}`;

  return (
    <Space direction="vertical" size="middle" style={{ width: "100%", maxWidth: 560 }}>
      <Typography.Title level={3}>Герои аккаунта</Typography.Title>
      <Typography.Text>
        Вход выполнен: {currentAccount.nickname} ({currentAccount.login})
      </Typography.Text>
      <Typography.Text type="secondary">
        Активный герой:{" "}
        {currentAccount.heroes.find((hero) => hero.id === currentAccount.activeHeroId)?.name ?? "не выбран"}
      </Typography.Text>
      <Card title={`Всего героев: ${currentAccount.heroes.length}`}>
        <List
          dataSource={currentAccount.heroes}
          locale={{ emptyText: "Героев пока нет" }}
          renderItem={(hero) => (
            <List.Item>
              <Space style={{ width: "100%", justifyContent: "space-between" }} align="start">
                <Space direction="vertical" size={0}>
                  <Typography.Text strong>{hero.name}</Typography.Text>
                  <Typography.Text type="secondary">{getHeroSummary(hero)}</Typography.Text>
                </Space>
                <Button
                  type={currentAccount.activeHeroId === hero.id ? "primary" : "default"}
                  onClick={() => setActiveHeroForCurrentAccount(hero.id)}
                >
                  {currentAccount.activeHeroId === hero.id ? "Активный" : "Выбрать"}
                </Button>
              </Space>
            </List.Item>
          )}
        />
      </Card>
      <Card title="Создать героя">
        <Space direction="vertical" size="small" style={{ width: "100%" }}>
          <Input
            value={heroName}
            onChange={(event) => {
              setHeroName(event.target.value);
              if (nameError) {
                setNameError(null);
              }
            }}
            placeholder="Введите имя героя"
            maxLength={32}
          />
          {nameError && <Typography.Text type="danger">{nameError}</Typography.Text>}
          <Button type="primary" onClick={handleCreateHero}>
            Создать героя
          </Button>
        </Space>
      </Card>
      <Button
        type="primary"
        disabled={!currentAccount.activeHeroId}
        onClick={() => navigate("/battle")}
      >
        К бою
      </Button>
    </Space>
  );
};

const BattleScreen: FC = () => {
  const currentAccount = useAppStore((state) => state.currentAccount);

  if (!currentAccount) {
    return <Navigate to="/" replace />;
  }

  const activeHero = currentAccount.heroes.find((hero) => hero.id === currentAccount.activeHeroId);
  if (!activeHero) {
    return <Navigate to="/heroes" replace />;
  }
  const enemyCounter = currentAccount.enemyCounter ?? 0;
  const enemy = createScaledEnemy("training-golem", enemyCounter);
  if (!enemy) {
    return (
      <Space direction="vertical" size="middle" style={{ width: "100%", maxWidth: 560 }}>
        <Typography.Title level={3}>Заглушка боя</Typography.Title>
        <Typography.Text type="danger">Не удалось создать врага для боя</Typography.Text>
      </Space>
    );
  }

  return (
    <Space direction="vertical" size="middle" style={{ width: "100%", maxWidth: 560 }}>
      <Typography.Title level={3}>Заглушка боя</Typography.Title>
      <Typography.Text>
        В бой выбран герой: <Typography.Text strong>{activeHero.name}</Typography.Text>
      </Typography.Text>
      <Typography.Text type="secondary">
        activeHeroId: {currentAccount.activeHeroId}
      </Typography.Text>
      <Card title={`Враг: ${enemy.name}`}>
        <Space direction="vertical" size={0}>
          <Typography.Text type="secondary">enemyCounter: {enemy.counter}</Typography.Text>
          <Typography.Text>HP: {enemy.stats.hp}</Typography.Text>
          <Typography.Text>ATK: {enemy.stats.attack}</Typography.Text>
          <Typography.Text>DEF: {enemy.stats.defense}</Typography.Text>
        </Space>
      </Card>
    </Space>
  );
};

const App: FC = () => {
  const isInitialized = useAppStore((state) => state.isInitialized);
  const setInitialized = useAppStore((state) => state.setInitialized);
  const [seedInitError, setSeedInitError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    void initializeSeedAccountsStorageIfEmpty()
      .then(() => {
        if (!active) {
          return;
        }

        setInitialized(true);
      })
      .catch((error: unknown) => {
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

  return (
    <main style={{ padding: 24 }}>
      {seedInitError && (
        <Typography.Text type="danger">Seed initialization error: {seedInitError}</Typography.Text>
      )}
      <Typography.Paragraph type="secondary">
        Router initialized. Store status: {isInitialized ? "ready" : "idle"}. Seed storage key: {" "}
        {SEED_ACCOUNTS_STORAGE_KEY}
      </Typography.Paragraph>
      <Routes>
        <Route path="/" element={<LoginScreen />} />
        <Route path="/heroes" element={<HeroesScreen />} />
        <Route path="/battle" element={<BattleScreen />} />
      </Routes>
    </main>
  );
};

export default App;
