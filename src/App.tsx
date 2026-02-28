import type { FC } from "react";
import { useEffect, useState } from "react";
import { Button, Space, Typography } from "antd";
import { Route, Routes } from "react-router-dom";
import {
  initializeSeedAccountsStorageIfEmpty,
  SEED_ACCOUNTS_STORAGE_KEY,
} from "./data/seedAccounts";
import { useAppStore } from "./store/useAppStore";

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
      <Routes>
        <Route
          path="/"
          element={
            <Space direction="vertical" size="middle">
              <Typography.Title level={2}>Gen: Browser Mage RPG</Typography.Title>
              <Typography.Text>
                Router initialized. Store status: {isInitialized ? "ready" : "idle"}
              </Typography.Text>
              <Typography.Text>Seed storage key: {SEED_ACCOUNTS_STORAGE_KEY}</Typography.Text>
              {seedInitError && (
                <Typography.Text type="danger">
                  Seed initialization error: {seedInitError}
                </Typography.Text>
              )}
              <Button type="primary" onClick={() => setInitialized(true)}>
                Init Store
              </Button>
            </Space>
          }
        />
      </Routes>
    </main>
  );
};

export default App;
