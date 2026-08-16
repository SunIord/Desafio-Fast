import { BrowserRouter, Routes, Route, Link, useNavigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import ColaboradoresPage from "./pages/ColaboradoresPage";
import WorkshopsPage from "./pages/WorkshopsPage";
import WorkshopDetailPage from "./pages/WorkshopDetailPage";
import ParticipacaoPage from "./pages/ParticipacaoPage";
import LoginPage from "./pages/LoginPage";
import ProtectedRoute from "./components/ProtectedRoute";

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
        <Route path="/workshops" element={<WorkshopsPage />} />
        <Route path="/workshops/:id" element={<WorkshopDetailPage />} />
        <Route path="/participacao" element={<ParticipacaoPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="*" element={<ColaboradoresPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;