import type { FC } from "react";
import { Button, Space, Typography } from "antd";
import { Route, Routes } from "react-router-dom";
import { useAppStore } from "./store/useAppStore";

const App: FC = () => {
  const isInitialized = useAppStore((state) => state.isInitialized);
  const setInitialized = useAppStore((state) => state.setInitialized);

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
