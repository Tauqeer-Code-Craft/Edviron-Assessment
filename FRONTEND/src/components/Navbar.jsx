import { useState, useEffect } from "react";
import {
  SunIcon,
  MoonIcon,
  ArrowRightOnRectangleIcon,
  ArrowLeftOnRectangleIcon,
} from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";
import { logoutUser } from "../services/api";

export const Navbar = ({ onLogin }) => {
  const navigate = useNavigate();

  const [darkMode, setDarkMode] = useState(false);
  const [userName, setUserName] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Theme
    const theme = localStorage.getItem("theme") === "dark";
    setDarkMode(theme);
    if (theme) document.documentElement.classList.add("dark");

    // Login state
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("userName");
    if (token) {
      setIsLoggedIn(true);
      if (storedUser) setUserName(storedUser);
    }
  }, []);

  const toggleDark = () => {
    setDarkMode((prev) => !prev);
    if (!darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
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
      console.error("Logout failed:", err);
    }
  };

  return (
    <nav className="flex justify-between items-center bg-white dark:bg-gray-900 shadow-xl px-8 md:px-12 py-4 sticky top-0 z-50 transition-colors duration-300">
      <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 dark:text-gray-50 tracking-tight select-none">
        School Dashboard
      </h1>

      {/* Right Controls */}
      <div className="flex items-center gap-4">
        {/* Dark/Light Mode Toggle */}
        <button
          onClick={toggleDark}
          className="flex items-center justify-center w-12 h-12 rounded-xl bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 shadow-md hover:scale-105 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
          aria-label={`Switch to ${darkMode ? "light" : "dark"} mode`}
        >
          {darkMode ? (
            <SunIcon className="w-6 h-6 text-yellow-400" />
          ) : (
            <MoonIcon className="w-6 h-6 text-gray-600" />
          )}
        </button>

        {/* Login / Logout */}
        {isLoggedIn ? (
          <div className="flex items-center gap-3">
            {userName && (
              <span className="px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 font-medium rounded-full shadow-sm select-none">
                {userName}
              </span>
            )}
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-5 py-2 bg-red-600 hover:bg-red-700 active:bg-red-800 text-white font-semibold rounded-lg shadow-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-red-400"
            >
              <ArrowLeftOnRectangleIcon className="w-5 h-5" />
              Logout
            </button>
          </div>
        ) : (
          <button
            onClick={onLogin}
            className="flex items-center gap-2 px-5 py-2 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold rounded-lg shadow-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <ArrowRightOnRectangleIcon className="w-5 h-5" />
            Login
          </button>
        )}
      </div>
    </nav>
  );
};
