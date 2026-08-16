import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import ColaboradoresPage from "./pages/ColaboradoresPage";
import WorkshopsPage from "./pages/WorkshopsPage";
import WorkshopDetailPage from "./pages/WorkshopDetailPage";
import ParticipacaoPage from "./pages/ParticipacaoPage";

function App() {
  return (
    <BrowserRouter>
      <nav>
        <Link to="/colaboradores">Colaboradores</Link>
        <Link to="/workshops">Workshops</Link>
        <Link to="/participacao">Participação</Link>
      </nav>

      <Routes>
        <Route path="/colaboradores" element={<ColaboradoresPage />} />
        <Route path="/workshops" element={<WorkshopsPage />} />
        <Route path="/workshops/:id" element={<WorkshopDetailPage />} />
        <Route path="/participacao" element={<ParticipacaoPage />} />
        <Route path="*" element={<ColaboradoresPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;