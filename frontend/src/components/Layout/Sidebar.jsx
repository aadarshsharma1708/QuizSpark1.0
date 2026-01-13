import { Link, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  Home,
  BookOpen,
  Trophy,
  User,
  History,
  Settings,
  Shield,
  BarChart3,
  Users,
  HelpCircle,
} from "lucide-react";
import { setSidebarOpen } from "../../store/slices/uiSlice";

const Sidebar = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { sidebarOpen } = useSelector((state) => state.ui);

  const navigation = [
    { name: "Dashboard", href: "/dashboard", icon: Home },
    { name: "Categories", href: "/categories", icon: BookOpen },
    { name: "Leaderboard", href: "/leaderboard", icon: Trophy },
    { name: "Quiz History", href: "/history", icon: History },
    { name: "Profile", href: "/profile", icon: User },
  ];

  const adminNavigation = [
    { name: "Admin Dashboard", href: "/admin", icon: BarChart3 },
    { name: "Manage Categories", href: "/admin/categories", icon: BookOpen },
    { name: "Manage Questions", href: "/admin/questions", icon: HelpCircle },
    { name: "Manage Users", href: "/admin/users", icon: Users },
  ];

  const isActive = (path) => {
    return location.pathname === path;
  };

  const handleLinkClick = () => {
    if (window.innerWidth < 1024) {
      dispatch(setSidebarOpen(false));
    }
  };

  return (
    <>
      {/* Desktop Sidebar */}
      <div
        className={`hidden lg:flex lg:flex-col lg:fixed lg:inset-y-0 lg:pt-16 lg:z-30 transition-all duration-300 ${
          sidebarOpen ? "lg:w-64" : "lg:w-0 lg:opacity-0"
        }`}
      >
        <div className="flex flex-col flex-grow bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600">
          <div className="flex flex-col flex-grow pt-5 pb-4">
            <nav className="flex-1 px-4 space-y-1">
              {/* Main Navigation */}
              <div className="space-y-1">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                      isActive(item.href)
                        ? "bg-primary-100 dark:bg-primary-900/20 text-primary-700 dark:text-primary-400"
                        : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white"
                    }`}
                  >
                    <item.icon
                      className={`mr-3 h-5 w-5 ${
                        isActive(item.href)
                          ? "text-primary-600 dark:text-primary-400"
                          : "text-gray-400 group-hover:text-gray-500 dark:group-hover:text-gray-300"
                      }`}
                    />
                    {item.name}
                  </Link>
                ))}
              </div>

              {/* Admin Navigation */}
              {user?.role === "admin" && (
                <div className="pt-6">
                  <div className="px-3 mb-2">
                    <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Administration
                    </h3>
                  </div>
                  <div className="space-y-1">
                    {adminNavigation.map((item) => (
                      <Link
                        key={item.name}
                        to={item.href}
                        className={`group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                          isActive(item.href)
                            ? "bg-primary-100 dark:bg-primary-900/20 text-primary-700 dark:text-primary-400"
                            : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white"
                        }`}
                      >
                        <item.icon
                          className={`mr-3 h-5 w-5 ${
                            isActive(item.href)
                              ? "text-primary-600 dark:text-primary-400"
                              : "text-gray-400 group-hover:text-gray-500 dark:group-hover:text-gray-300"
                          }`}
                        />
                        {item.name}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </nav>
          </div>

          {/* User Info */}
          <div className="flex-shrink-0 flex border-t border-gray-200 dark:border-gray-700 p-4">
            <div className="flex items-center">
              {user?.avatar ? (
                <img
                  className="inline-block h-9 w-9 rounded-full"
                  src={user.avatar}
                  alt={user.fullName}
                />
              ) : (
                <div className="h-9 w-9 rounded-full bg-primary-500 flex items-center justify-center">
                  <span className="text-sm font-medium text-white">
                    {user?.firstName?.[0]}
                    {user?.lastName?.[0]}
                  </span>
                </div>
              )}
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-700 dark:text-gray-200">
                  {user?.fullName}
                </p>
                <p className="text-xs font-medium text-gray-500 dark:text-gray-400">
                  {user?.role === "admin" ? "Administrator" : "Member"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Sidebar */}
      <div
        className={`lg:hidden fixed inset-0 z-40 transform transition-transform duration-300 ease-in-out ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div
          className="fixed inset-0 bg-gray-600 bg-opacity-75 transition-opacity duration-300 ease-in-out"
          onClick={() => dispatch(setSidebarOpen(false))}
        />

        <div className="relative flex-1 flex flex-col max-w-xs w-full bg-white dark:bg-gray-800">
          <div className="absolute top-0 right-0 -mr-12 pt-2">
            <button
              type="button"
              className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
              onClick={() => dispatch(setSidebarOpen(false))}
            >
              <span className="sr-only">Close sidebar</span>
              <svg
                className="h-6 w-6 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          <div className="flex-1 h-0 pt-5 pb-4 overflow-y-auto">
            <div className="flex-shrink-0 flex items-center px-4">
              <div className="w-8 h-8 bg-gradient-to-r from-primary-500 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">Q</span>
              </div>
              <span className="ml-2 text-xl font-bold text-gradient">
                QuizSpark
              </span>
            </div>
            <nav className="mt-5 px-4 space-y-1">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={handleLinkClick}
                  className={`group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                    isActive(item.href)
                      ? "bg-primary-100 dark:bg-primary-900/20 text-primary-700 dark:text-primary-400"
                      : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white"
                  }`}
                >
                  <item.icon
                    className={`mr-3 h-5 w-5 ${
                      isActive(item.href)
                        ? "text-primary-600 dark:text-primary-400"
                        : "text-gray-400 group-hover:text-gray-500 dark:group-hover:text-gray-300"
                    }`}
                  />
                  {item.name}
                </Link>
              ))}

              {user?.role === "admin" && (
                <div className="pt-6">
                  <div className="px-3 mb-2">
                    <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Administration
                    </h3>
                  </div>
                  {adminNavigation.map((item) => (
                    <Link
                      key={item.name}
                      to={item.href}
                      onClick={handleLinkClick}
                      className={`group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                        isActive(item.href)
                          ? "bg-primary-100 dark:bg-primary-900/20 text-primary-700 dark:text-primary-400"
                          : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white"
                      }`}
                    >
                      <item.icon
                        className={`mr-3 h-5 w-5 ${
                          isActive(item.href)
                            ? "text-primary-600 dark:text-primary-400"
                            : "text-gray-400 group-hover:text-gray-500 dark:group-hover:text-gray-300"
                        }`}
                      />
                      {item.name}
                    </Link>
                  ))}
                </div>
              )}
            </nav>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
