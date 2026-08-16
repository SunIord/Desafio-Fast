import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Nav() {
  const [menuAberto, setMenuAberto] = useState(false);
  const { isAuthenticated, username, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  function fecharMenu() {
    setMenuAberto(false);
  }

  function handleLogout() {
    logout();
    fecharMenu();
    navigate("/login");
  }

  function linkClass(path) {
    return location.pathname === path ? "nav-link nav-link-active" : "nav-link";
  }

  return (
    <header className="nav-header">
      <div className="nav-bar">
        <Link to="/workshops" className="nav-brand" onClick={fecharMenu}>
          Workshop Tracker
        </Link>

        <button
          type="button"
          className="nav-toggle"
          aria-label="Abrir menu"
          aria-expanded={menuAberto}
          onClick={() => setMenuAberto((atual) => !atual)}
        >
          <span />
          <span />
          <span />
        </button>

        <nav className={`nav-links ${menuAberto ? "nav-links-open" : ""}`}>
          <Link to="/colaboradores" className={linkClass("/colaboradores")} onClick={fecharMenu}>
            Colaboradores
          </Link>
          <Link to="/workshops" className={linkClass("/workshops")} onClick={fecharMenu}>
            Workshops
          </Link>
          <Link to="/participacao" className={linkClass("/participacao")} onClick={fecharMenu}>
            Participação
          </Link>

          <div className="nav-auth">
            {isAuthenticated ? (
              <>
                <span className="nav-user">{username}</span>
                <button type="button" className="nav-link-button" onClick={handleLogout}>
                  Sair
                </button>
              </>
            ) : (
              <Link to="/login" className="nav-link" onClick={fecharMenu}>
                Entrar
              </Link>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
}