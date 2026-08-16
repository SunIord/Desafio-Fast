import { BrowserRouter, Routes, Route, Link, useNavigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import ColaboradoresPage from "./pages/ColaboradoresPage";
import WorkshopsPage from "./pages/WorkshopsPage";
import WorkshopDetailPage from "./pages/WorkshopDetailPage";
import WorkshopFormPage from "./pages/WorkshopFormPage";
import ColaboradorFormPage from "./pages/ColaboradorFormPage";
import ParticipacaoPage from "./pages/ParticipacaoPage";
import LoginPage from "./pages/LoginPage";

function Nav() {
  const { isAuthenticated, username, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/login");
  }

  return (
    <nav>
      <Link to="/colaboradores">Colaboradores</Link>
      <Link to="/workshops">Workshops</Link>
      <Link to="/participacao">Participação</Link>

      <span className="nav-spacer" />

      {isAuthenticated ? (
        <>
          <span className="nav-user">{username}</span>
          <button type="button" className="nav-link-button" onClick={handleLogout}>
            Sair
          </button>
        </>
      ) : (
        <Link to="/login">Entrar</Link>
      )}
    </nav>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Nav />

      <Routes>
        <Route path="/colaboradores" element={<ColaboradoresPage />} />
        <Route
          path="/colaboradores/novo"
          element={
            <ProtectedRoute>
              <ColaboradorFormPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/colaboradores/:id/editar"
          element={
            <ProtectedRoute>
              <ColaboradorFormPage />
            </ProtectedRoute>
          }
        />

        <Route path="/workshops" element={<WorkshopsPage />} />
        <Route path="/workshops/:id" element={<WorkshopDetailPage />} />
        <Route
          path="/workshops/novo"
          element={
            <ProtectedRoute>
              <WorkshopFormPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/workshops/:id/editar"
          element={
            <ProtectedRoute>
              <WorkshopFormPage />
            </ProtectedRoute>
          }
        />

        <Route path="/participacao" element={<ParticipacaoPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="*" element={<ColaboradoresPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;