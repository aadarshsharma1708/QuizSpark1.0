import { useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { getProfile } from "./store/slices/authSlice";

// Layout Components
import Layout from "./components/Layout/Layout";
import AuthLayout from "./components/Layout/AuthLayout";

// Pages
import Home from "./pages/Home";
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";
import Dashboard from "./pages/Dashboard/Dashboard";
import Categories from "./pages/Categories/Categories";
import Quiz from "./pages/Quiz/Quiz";
import QuizResult from "./pages/Quiz/QuizResult";
import QuizReview from "./pages/Quiz/QuizReview";
import Leaderboard from "./pages/Leaderboard/Leaderboard";
import Profile from "./pages/Profile/Profile";
import History from "./pages/History/History";
import AdminDashboard from "./pages/Admin/AdminDashboard";
import AdminCategories from "./pages/Admin/AdminCategories";
import AdminQuestions from "./pages/Admin/AdminQuestions";
import AdminUsers from "./pages/Admin/AdminUsers";
import NotFound from "./pages/NotFound";
import AboutUs from "./pages/Static/AboutUs";
import HelpCenter from "./pages/Static/HelpCenter";
import ContactUs from "./pages/Static/ContactUs";
import PrivacyPolicy from "./pages/Static/PrivacyPolicy";
import TermsOfService from "./pages/Static/TermsOfService";

// Protected Route Component
import ProtectedRoute from "./components/Auth/ProtectedRoute";
import AdminRoute from "./components/Auth/AdminRoute";

function App() {
  const dispatch = useDispatch();
  const { user, token } = useSelector((state) => state.auth);

  useEffect(() => {
    // Apply theme on app load
    const theme = localStorage.getItem("theme") || "system";
    if (
      theme === "dark" ||
      (theme === "system" &&
        window.matchMedia("(prefers-color-scheme: dark)").matches)
    ) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }

    // Get user profile if token exists
    if (token && !user) {
      dispatch(getProfile());
    }
  }, [dispatch, token, user]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="categories" element={<Categories />} />
          <Route path="leaderboard" element={<Leaderboard />} />
          {/* Static Pages */}
          <Route path="about" element={<AboutUs />} />
          <Route path="help" element={<HelpCenter />} />
          <Route path="contact" element={<ContactUs />} />
          <Route path="privacy" element={<PrivacyPolicy />} />
          <Route path="terms" element={<TermsOfService />} />
        </Route>

        {/* Auth Routes */}
        <Route path="/auth" element={<AuthLayout />}>
          <Route
            path="login"
            element={user ? <Navigate to="/dashboard" /> : <Login />}
          />
          <Route
            path="register"
            element={user ? <Navigate to="/dashboard" /> : <Register />}
          />
        </Route>

        {/* Protected Routes */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="quiz/:categoryId" element={<Quiz />} />
          <Route path="quiz/:quizId/result" element={<QuizResult />} />
          <Route path="quiz/:quizId/review" element={<QuizReview />} />
          <Route path="profile" element={<Profile />} />
          <Route path="history" element={<History />} />
        </Route>

        {/* Admin Routes */}
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <Layout />
            </AdminRoute>
          }
        >
          <Route index element={<AdminDashboard />} />
          <Route path="categories" element={<AdminCategories />} />
          <Route path="questions" element={<AdminQuestions />} />
          <Route path="users" element={<AdminUsers />} />
        </Route>

        {/* 404 Route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}

export default App;
