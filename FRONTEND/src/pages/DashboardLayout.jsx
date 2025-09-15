import { Navbar } from "../components/Navbar";
import { Sidebar } from "../components/Sidebar";

export const DashboardLayout = ({ children }) => {
    return (
    <div className="flex min-h-screen bg-gray-100 dark:bg-gray-900">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Navbar />
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
};