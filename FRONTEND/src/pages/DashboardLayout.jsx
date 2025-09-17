import { Navbar } from "../components/Navbar";

export const DashboardLayout = ({ children }) => {
  return (
    <div className="flex min-h-screen bg-zinc-100 dark:bg-zinc-900">
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        <Navbar />
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
};
