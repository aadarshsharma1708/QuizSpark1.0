import { Outlet } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import Sidebar from "./Sidebar";
import { useSelector, useDispatch } from "react-redux";
import { Menu, X } from "lucide-react";
import { setSidebarOpen } from "../../store/slices/uiSlice";

const Layout = () => {
  const { sidebarOpen } = useSelector((state) => state.ui);
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const toggleSidebar = () => {
    dispatch(setSidebarOpen(!sidebarOpen));
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      <Header />

      <div className="flex-1 flex">
        {user && (
          <>
            {/* Toggle Button for Sidebar */}
            <button
              onClick={toggleSidebar}
              className={`
                fixed top-20 left-4 z-50 p-2 rounded-lg bg-white dark:bg-gray-800 shadow-lg 
                border border-gray-200 dark:border-gray-700 lg:left-6
                hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-300
                ${sidebarOpen ? "lg:left-[17rem]" : "lg:left-6"}
              `}
              aria-label="Toggle Sidebar"
            >
              {sidebarOpen ? (
                <X className="h-5 w-5 text-gray-600 dark:text-gray-300" />
              ) : (
                <Menu className="h-5 w-5 text-gray-600 dark:text-gray-300" />
              )}
            </button>

            <Sidebar />
            {/* Backdrop for mobile sidebar */}
            <div
              className={`fixed inset-0 bg-black bg-opacity-50 transition-opacity duration-300 lg:hidden ${
                sidebarOpen
                  ? "opacity-100 z-20"
                  : "opacity-0 pointer-events-none"
              }`}
              onClick={() => dispatch(setSidebarOpen(false))}
            />
          </>
        )}

        <main
          className={`
            flex-1 relative 
            ${user ? (sidebarOpen ? "lg:ml-64" : "lg:ml-0") : ""} 
            transition-all duration-300
            min-h-[calc(100vh-4rem)]
          `}
        >
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <Outlet />
          </div>
        </main>
      </div>

      <div
        className={`
        ${user ? (sidebarOpen ? "lg:ml-64" : "lg:ml-0") : ""} 
        transition-all duration-300
      `}
      >
        <Footer />
      </div>
    </div>
  );
};

export default Layout;
