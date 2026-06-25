import { useAuth } from "../../contexts/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";

const HomeIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <path d="M3 9.5L12 3L21 9.5V20C21 20.55 20.55 21 20 21H15V15H9V21H4C3.45 21 3 20.55 3 20V9.5Z" fill="currentColor"/>
  </svg>
);

const PlusIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
    <path d="M12 7V17M7 12H17" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

export function Navbar() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const tabs = [
    { icon: <HomeIcon />, path: "/map", label: "Home" },
    { icon: <PlusIcon />, path: "/create-event", label: "Novo" },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 h-[61px] bg-[#192853] flex items-center justify-around px-2 z-50 shadow-[0_-2px_10px_rgba(0,0,0,0.3)]">
      {tabs.map((tab, i) => {
        const isActive = location.pathname === tab.path;
        return (
          <button
            key={i}
            onClick={() => navigate(tab.path)}
            className={`flex flex-col items-center justify-center p-2 rounded-xl transition-all ${
              isActive ? "text-[#ffe14e]" : "text-white/60 hover:text-white"
            }`}
          >
            {tab.icon}
          </button>
        );
      })}
    </nav>
  );
}
