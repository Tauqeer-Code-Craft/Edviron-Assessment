import { Link, useLocation } from "react-router-dom";
import { HomeIcon, ClipboardDocumentCheckIcon,ChartBarIcon } from "@heroicons/react/24/outline";

export const Sidebar = () => {
  const location = useLocation();

  const menuItems = [
    { name: "Transactions", path: "/transactions", icon: HomeIcon },
    { name: "Check Status", path: "/status-check", icon: ClipboardDocumentCheckIcon },
    { name: "Data Visuals", path: "/analytics", icon: ChartBarIcon },
  ];

  return (
    <aside className=" w-64 bg-white dark:bg-gray-900 border-r dark:border-gray-700 min-h-screen shadow-sm">
      <div className="p-6 flex flex-col">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-8 item">
          
        </h1>
        <ul className="flex flex-col gap-2">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;

            return (
              <li key={item.name}>
                <Link
                  to={item.path}
                  className={`
                    flex items-center px-4 py-2 rounded-lg font-medium transition-colors duration-150
                    ${isActive
                      ? "bg-blue-600 text-white"
                      : "text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-800"
                    }
                  `}
                >
                  <Icon className="w-5 h-5 mr-3" />
                  <span>{item.name}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </aside>
  );
};
