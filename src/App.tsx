import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ConfigProvider, AdaptivityProvider, AppRoot } from "@vkontakte/vkui";

import "@vkontakte/vkui/dist/vkui.css";

import { HomePage } from "./pages/HomePage";
import { MoviePage } from "./pages/MoviePage";
import { FavoritesPage } from "./pages/FavoritesPage";
import { Layout } from "./components/common/Layout";

const App: React.FC = () => {
  return (
    <ConfigProvider>
      <AdaptivityProvider>
        <AppRoot mode="full">
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Layout />}>
                <Route index element={<HomePage />} />
                <Route path="movie/:id" element={<MoviePage />} />
                <Route path="favorites" element={<FavoritesPage />} />
              </Route>
            </Routes>
          </BrowserRouter>
        </AppRoot>
      </AdaptivityProvider>
    </ConfigProvider>
  );
};

export default App;
