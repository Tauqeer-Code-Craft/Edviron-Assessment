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
    <nav className="bg-white dark:bg-gray-900 shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 md:px-10 py-4 flex justify-between items-center">
        <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 dark:text-gray-50 tracking-tight">
          School Dashboard
        </h1>

        <div className="hidden md:flex items-center gap-6">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                  isActive
                    ? "bg-blue-600 text-white shadow-md"
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-800"
                }`}
              >
                <Icon className="w-5 h-5" />
                <span>{item.name}</span>
              </Link>
            );
          })}

          <div
            onClick={toggleDark}
            className="relative w-14 h-8 bg-gray-300 dark:bg-gray-700 rounded-full cursor-pointer flex items-center p-1 transition-colors duration-300"
          >
            <div
              className={`absolute w-6 h-6 bg-white rounded-full shadow-md transform transition-transform duration-300 flex items-center justify-center ${
                darkMode ? "translate-x-6" : "translate-x-0"
              }`}
            >
              {darkMode ? (
                <SunIcon className="w-4 h-4 text-yellow-400" />
              ) : (
                <MoonIcon className="w-4 h-4 text-gray-600" />
              )}
            </div>
          </div>

          {isLoggedIn ? (
            <div className="flex items-center gap-3">
              {userName && (
                <span className="px-3 py-1 bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 font-medium rounded-full text-sm shadow-sm">
                  {userName}
                </span>
              )}
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg shadow transition"
              >
                <ArrowLeftOnRectangleIcon className="w-5 h-5" />
                Logout
              </button>
            </div>
          ) : (
            <button
              onClick={onLogin}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow transition"
            >
              <ArrowRightOnRectangleIcon className="w-5 h-5" />
              Login
            </button>
          )}
        </div>

        <div className="md:hidden flex items-center gap-3">
          <div
            onClick={toggleDark}
            className="relative w-12 h-6 bg-gray-300 dark:bg-gray-700 rounded-full cursor-pointer flex items-center p-1 transition-colors duration-300"
          >
            <div
              className={`absolute w-5 h-5 bg-white rounded-full shadow-md transform transition-transform duration-300 flex items-center justify-center ${
                darkMode ? "translate-x-6" : "translate-x-0"
              }`}
            >
              {darkMode ? (
                <SunIcon className="w-3.5 h-3.5 text-yellow-400" />
              ) : (
                <MoonIcon className="w-3.5 h-3.5 text-gray-600" />
              )}
            </div>
          </div>

          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="text-gray-700 dark:text-gray-300 focus:outline-none"
          >
            {menuOpen ? <XMarkIcon className="w-7 h-7" /> : <Bars3Icon className="w-7 h-7" />}
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="md:hidden bg-white dark:bg-gray-900 shadow-lg">
          <ul className="flex flex-col gap-2 px-6 py-4">
            {menuItems.map((item) => {
              const isActive = location.pathname === item.path;
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg font-medium transition-all duration-200 ${
                    isActive
                      ? "bg-blue-600 text-white shadow-md"
                      : "text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-800"
                  }`}
                  onClick={() => setMenuOpen(false)}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.name}</span>
                </Link>
              );
            })}

            {isLoggedIn ? (
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-3 py-2 mt-2 bg-red-600 hover:bg-red-700 text-white rounded-lg shadow transition"
              >
                <ArrowLeftOnRectangleIcon className="w-5 h-5" />
                Logout
              </button>
            ) : (
              <button
                onClick={onLogin}
                className="flex items-center gap-2 px-3 py-2 mt-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow transition"
              >
                <ArrowRightOnRectangleIcon className="w-5 h-5" />
                Login
              </button>
            )}
          </ul>
        </div>
      )}
    </nav>
  );
};
