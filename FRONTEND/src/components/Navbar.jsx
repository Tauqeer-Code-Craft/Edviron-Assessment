import { useState, useEffect } from "react";
import {
  SunIcon,
  MoonIcon,
  ArrowRightOnRectangleIcon,
  ArrowLeftOnRectangleIcon,
  HomeIcon,
  ClipboardDocumentCheckIcon,
  ChartBarIcon,
  Bars3Icon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { logoutUser } from "../services/api";

export const Navbar = ({ onLogin }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [darkMode, setDarkMode] = useState(false);
  const [userName, setUserName] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const theme = localStorage.getItem("theme") || "light";
    const isDark = theme === "dark";
    setDarkMode(isDark);
    document.documentElement.classList[isDark ? "add" : "remove"]("dark");

    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("userName");
    if (token) {
      setIsLoggedIn(true);
      if (storedUser) setUserName(storedUser);
    }
  }, []);

  const toggleDark = () => {
    const newDark = !darkMode;
    setDarkMode(newDark);
    document.documentElement.classList[newDark ? "add" : "remove"]("dark");
    localStorage.setItem("theme", newDark ? "dark" : "light");
  };

  const handleLogout = async () => {
    try {
      await logoutUser();
      localStorage.removeItem("token");
      localStorage.removeItem("userName");
      setIsLoggedIn(false);
      setUserName("");
      navigate("/sign-in");
    } catch (err) {
      console.error(err);
    }
  };

  const menuItems = [
    { name: "Transactions", path: "/transactions", icon: HomeIcon },
    { name: "Check Status", path: "/status-check", icon: ClipboardDocumentCheckIcon },
    { name: "Data Visuals", path: "/analytics", icon: ChartBarIcon },
  ];

  return (
    <nav className="bg-white dark:bg-zinc-900 shadow-md sticky top-0 z-50 border-b border-zinc-200 dark:border-zinc-800">
      <div className="max-w-7xl mx-auto px-6 py-3 flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-zinc-900 dark:text-white">
          🎓 School Dashboard
        </h1>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-6">
          {menuItems.map(({ name, path, icon: Icon }) => {
            const isActive = location.pathname === path;
            return (
              <Link
                key={name}
                to={path}
                className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition ${
                  isActive
                    ? "bg-blue-600 text-white shadow-sm"
                    : "text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                }`}
              >
                <Icon className="w-5 h-5" />
                <span>{name}</span>
              </Link>
            );
          })}

          {/* Dark Mode Toggle */}
          <div
            onClick={toggleDark}
            className="w-12 h-6 flex items-center bg-zinc-300 dark:bg-zinc-700 rounded-full p-1 cursor-pointer transition"
          >
            <div
              className={`w-5 h-5 bg-white rounded-full shadow transform duration-300 flex items-center justify-center ${
                darkMode ? "translate-x-6" : "translate-x-0"
              }`}
            >
              {darkMode ? (
                <SunIcon className="w-4 h-4 text-yellow-400" />
              ) : (
                <MoonIcon className="w-4 h-4 text-zinc-600" />
              )}
            </div>
          </div>

          {/* User Actions */}
          {isLoggedIn ? (
            <div className="flex items-center gap-3">
              {userName && (
                <span className="px-3 py-1 text-sm bg-zinc-200 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-100 rounded-full">
                  {userName}
                </span>
              )}
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-3 py-2 text-sm bg-red-600 hover:bg-red-700 text-white rounded-md transition"
              >
                <ArrowLeftOnRectangleIcon className="w-5 h-5" />
                Logout
              </button>
            </div>
          ) : (
            <button
              onClick={onLogin}
              className="flex items-center gap-2 px-3 py-2 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-md transition"
            >
              <ArrowRightOnRectangleIcon className="w-5 h-5" />
              Login
            </button>
          )}
        </div>

        {/* Mobile Hamburger */}
        <div className="md:hidden flex items-center gap-3">
          <div
            onClick={toggleDark}
            className="w-10 h-5 flex items-center bg-zinc-300 dark:bg-zinc-700 rounded-full p-1 cursor-pointer"
          >
            <div
              className={`w-4 h-4 bg-white rounded-full shadow transform duration-300 ${
                darkMode ? "translate-x-5" : "translate-x-0"
              }`}
            ></div>
          </div>

          <button onClick={() => setMenuOpen(!menuOpen)} className="text-zinc-700 dark:text-zinc-300">
            {menuOpen ? <XMarkIcon className="w-6 h-6" /> : <Bars3Icon className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Slide Menu */}
      {menuOpen && (
        <div className="md:hidden px-6 py-4 space-y-2 bg-white dark:bg-zinc-900 border-t border-zinc-200 dark:border-zinc-800 transition-all">
          {menuItems.map(({ name, path, icon: Icon }) => {
            const isActive = location.pathname === path;
            return (
              <Link
                key={name}
                to={path}
                onClick={() => setMenuOpen(false)}
                className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition ${
                  isActive
                    ? "bg-blue-600 text-white shadow-sm"
                    : "text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                }`}
              >
                <Icon className="w-5 h-5" />
                <span>{name}</span>
              </Link>
            );
          })}

          {isLoggedIn ? (
            <button
              onClick={() => {
                handleLogout();
                setMenuOpen(false);
              }}
              className="flex items-center gap-2 px-3 py-2 mt-3 text-sm bg-red-600 hover:bg-red-700 text-white rounded-md transition"
            >
              <ArrowLeftOnRectangleIcon className="w-5 h-5" />
              Logout
            </button>
          ) : (
            <button
              onClick={() => {
                onLogin();
                setMenuOpen(false);
              }}
              className="flex items-center gap-2 px-3 py-2 mt-3 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-md transition"
            >
              <ArrowRightOnRectangleIcon className="w-5 h-5" />
              Login
            </button>
          )}
        </div>
      )}
    </nav>
  );
};
