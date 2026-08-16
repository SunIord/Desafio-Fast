import { BrowserRouter, Routes, Route } from "react-router-dom";
import Nav from "./components/Nav";
import ColaboradoresPage from "./pages/ColaboradoresPage";
import ColaboradorFormPage from "./pages/ColaboradorFormPage";
import WorkshopsPage from "./pages/WorkshopsPage";
import WorkshopDetailPage from "./pages/WorkshopDetailPage";
import WorkshopFormPage from "./pages/WorkshopFormPage";
import ParticipacaoPage from "./pages/ParticipacaoPage";
import LoginPage from "./pages/LoginPage";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <Nav />

      <Routes>
        <Route path="/colaboradores" element={<ColaboradoresPage />} />
        <Route
          path="/colaboradores/novo"
          element={<ProtectedRoute><ColaboradorFormPage /></ProtectedRoute>}
        />
        <Route
          path="/colaboradores/:id/editar"
          element={<ProtectedRoute><ColaboradorFormPage /></ProtectedRoute>}
        />

        <Route path="/workshops" element={<WorkshopsPage />} />
        <Route path="/workshops/:id" element={<WorkshopDetailPage />} />
        <Route
          path="/workshops/novo"
          element={<ProtectedRoute><WorkshopFormPage /></ProtectedRoute>}
        />
        <Route
          path="/workshops/:id/editar"
          element={<ProtectedRoute><WorkshopFormPage /></ProtectedRoute>}
        />

        <Route path="/participacao" element={<ParticipacaoPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="*" element={<ColaboradoresPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;