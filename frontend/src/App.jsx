import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import ColaboradoresPage from "./pages/ColaboradoresPage";
import WorkshopsPage from "./pages/WorkshopsPage";
import WorkshopDetailPage from "./pages/WorkshopDetailPage";

function App() {
  return (
    <BrowserRouter>
      <nav>
        <Link to="/colaboradores">Colaboradores</Link>
        <Link to="/workshops">Workshops</Link>
      </nav>

      <Routes>
        <Route path="/colaboradores" element={<ColaboradoresPage />} />
        <Route path="/workshops" element={<WorkshopsPage />} />
        <Route path="/workshops/:id" element={<WorkshopDetailPage />} />
        <Route path="*" element={<ColaboradoresPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;