import type { FC } from "react";
import { useEffect, useState } from "react";
import { Button, Card, List, Space, Typography } from "antd";
import { Navigate, Route, Routes, useNavigate } from "react-router-dom";
import { loadAccount } from "./data/accountStorage";
import {
  initializeSeedAccountsStorageIfEmpty,
  readSeedAccountsFromStorage,
  SEED_ACCOUNTS_STORAGE_KEY,
  type SeedAccount,
} from "./data/seedAccounts";
import type { Account } from "./models/account";
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
            heroes: selectedSeed.heroes ?? [],
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
          <Typography.Text type="secondary">
            Текущий аккаунт: {currentAccount.login}
          </Typography.Text>
        )}
      </Space>
    </Space>
  );
};

const HeroesScreen: FC = () => {
  const currentAccount = useAppStore((state) => state.currentAccount);

  if (!currentAccount) {
    return <Navigate to="/" replace />;
  }

  return (
    <Space direction="vertical" size="middle" style={{ width: "100%", maxWidth: 560 }}>
      <Typography.Title level={3}>Экран героев (заглушка)</Typography.Title>
      <Typography.Text>
        Вход выполнен: {currentAccount.nickname} ({currentAccount.login})
      </Typography.Text>
      <Typography.Text>Количество героев: {currentAccount.heroes.length}</Typography.Text>
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
        <Typography.Text type="danger">
          Seed initialization error: {seedInitError}
        </Typography.Text>
      )}
      <Typography.Paragraph type="secondary">
        Router initialized. Store status: {isInitialized ? "ready" : "idle"}. Seed storage key:{" "}
        {SEED_ACCOUNTS_STORAGE_KEY}
      </Typography.Paragraph>
      <Routes>
        <Route path="/" element={<LoginScreen />} />
        <Route path="/heroes" element={<HeroesScreen />} />
      </Routes>
    </main>
  );
};

export default App;
