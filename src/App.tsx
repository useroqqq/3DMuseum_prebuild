/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Exhibit from './pages/Exhibit';
import GroupSelection from './pages/GroupSelection';
import { useGLTF } from '@react-three/drei';
import { exhibits } from './data/exhibits';
import { ThemeProvider } from './components/ThemeProvider';

// Безопасная предзагрузка моделей
const safePreload = async (url: string) => {
  try {
    const res = await fetch(url, { method: 'HEAD' });
    const contentType = res.headers.get('content-type');
    // Если возвращается HTML, значит файл не найден (срабатывает SPA fallback)
    if (res.ok && !contentType?.includes('text/html')) {
      useGLTF.preload(url);
    }
  } catch (e) {
    console.warn(`Не удалось предзагрузить ${url}`);
  }
};

// Оставляем в предзагрузке только главную сцену (LiDAR),
// чтобы не забивать оперативную память сразу всеми моделями.
// Модели экспонатов попадут в кэш при первом их открытии пользователем.
safePreload('./models/room.glb');

export default function App() {
  return (
    <ThemeProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/exhibit/:id" element={<Exhibit />} />
          <Route path="/group/:id" element={<GroupSelection />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}
