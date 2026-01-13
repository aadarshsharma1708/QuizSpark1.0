import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import quizService from "../../services/quizService";
import categoryService from "../../services/categoryService";
import { getUserStats } from "../../store/slices/authSlice";
import {
  Play,
  Trophy,
  Clock,
  Target,
  TrendingUp,
  Award,
  BookOpen,
  Users,
  Star,
  Calendar,
  ArrowRight,
} from "lucide-react";

const Dashboard = () => {
  const { user, stats } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const [recentQuizzes, setRecentQuizzes] = useState([]);
  const [popularCategories, setPopularCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        if (!user) {
          setLoading(false);
          return;
        }

        const token = localStorage.getItem("token");

        // Fetch user stats first
        try {
          await dispatch(getUserStats()).unwrap();
        } catch (error) {
          console.error("Error fetching user stats:", error);
          // Continue with other data fetching even if stats fail
        }

        // Fetch recent quizzes
        try {
          const { quizzes } = await quizService.getQuizHistory(
            { limit: 3 },
            token
          );
          setRecentQuizzes(
            quizzes.map((quiz) => ({
              id: quiz._id,
              category: quiz.category.name,
              color: quiz.category.color,
              score: quiz.results.percentage,
              totalQuestions: quiz.results.totalQuestions,
              completedAt: quiz.completedAt,
            }))
          );
        } catch (error) {
          console.error("Error fetching quiz history:", error);
          setRecentQuizzes([]);
        }

        // Fetch categories
        try {
          const { data: categories } = await categoryService.getCategories();
          if (Array.isArray(categories)) {
            const categoriesByQuestionCount = categories
              .filter((cat) => cat.stats?.totalQuestions > 0)
              .sort(
                (a, b) =>
                  (b.stats?.totalQuestions || 0) -
                  (a.stats?.totalQuestions || 0)
              );
            setPopularCategories(
              categoriesByQuestionCount.map((cat) => ({
                id: cat._id,
                name: cat.name,
                icon: cat.icon || "📚", // Default icon if none provided
                questionsCount: cat.stats?.totalQuestions || 0,
                color: cat.color || "#3B82F6", // Default color if none provided
              }))
            );
          }
        } catch (error) {
          console.error("Error fetching categories:", error);
          setPopularCategories([]);
        }

        setLoading(false);
      } catch (error) {
        console.error("Error in fetchDashboardData:", error);
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [user, dispatch]);

  //console.log("Stats : ", stats); // Debug log
  const statItems = [
    {
      label: "Total Quizzes",
      value: stats?.overview?.totalQuizzes || 0,
      icon: Target,
      color: "text-blue-600",
      bgColor: "bg-blue-100 dark:bg-blue-900/20",
    },
    {
      label: "Total Score",
      value: stats?.overview?.totalScore || 0,
      icon: Trophy,
      color: "text-yellow-600",
      bgColor: "bg-yellow-100 dark:bg-yellow-900/20",
    },
    {
      label: "Average Score",
      value: (stats?.overview?.averagePercentage || 0).toFixed(1) + "%",
      icon: TrendingUp,
      color: "text-green-600",
      bgColor: "bg-green-100 dark:bg-green-900/20",
    },
    {
      label: "Best Score",
      value: (stats?.overview?.bestPercentage || 0).toFixed(1) + "%",
      icon: Award,
      color: "text-purple-600",
      bgColor: "bg-purple-100 dark:bg-purple-900/20",
    },
  ];

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="spinner w-8 h-8"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-primary-600 to-purple-600 rounded-xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">
              Welcome back, {user?.firstName}! 👋
            </h1>
            <p className="text-primary-100">
              Ready to challenge yourself with some quizzes today?
            </p>
          </div>
          <div className="hidden md:block">
            <Link
              to="/categories"
              className="btn bg-white text-primary-600 hover:bg-gray-100 px-6 py-3 font-semibold"
            >
              <Play className="h-4 w-4 mr-2" />
              Start Quiz
            </Link>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statItems.map((stat, index) => (
          <div key={index} className="card p-6">
            <div className="flex items-center">
              <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                <stat.icon className={`h-6 w-6 ${stat.color}`} />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  {stat.label}
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {stat.value}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Quizzes */}
        <div className="card p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Recent Quizzes
            </h2>
            <Link
              to="/history"
              className="text-primary-600 hover:text-primary-700 dark:text-primary-400 text-sm font-medium flex items-center"
            >
              View all
              <ArrowRight className="h-4 w-4 ml-1" />
            </Link>
          </div>

          {recentQuizzes.length > 0 ? (
            <div className="space-y-4">
              {recentQuizzes.map((quiz) => (
                <div
                  key={quiz.id}
                  className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
                >
                  <div className="flex items-center">
                    <div
                      className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-semibold"
                      style={{ backgroundColor: quiz.color }}
                    >
                      {quiz.category[0]}
                    </div>
                    <div className="ml-3">
                      <p className="font-medium text-gray-900 dark:text-white">
                        {quiz.category}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {formatDate(quiz.completedAt)}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900 dark:text-white">
                      {quiz.score}%
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {Math.round((quiz.score / 100) * quiz.totalQuestions)}/
                      {quiz.totalQuestions}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 dark:text-gray-400">
                No recent quizzes. Start your first quiz!
              </p>
              <Link to="/categories" className="btn btn-primary mt-4">
                Browse Categories
              </Link>
            </div>
          )}
        </div>

        {/* Popular Categories */}
        <div className="card p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Popular Categories
            </h2>
            <Link
              to="/categories"
              className="text-primary-600 hover:text-primary-700 dark:text-primary-400 text-sm font-medium flex items-center"
            >
              View all
              <ArrowRight className="h-4 w-4 ml-1" />
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {popularCategories.slice(0, 6).map((category) => (
              <Link
                key={category.id}
                to={`/quiz/${category.id}`}
                className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors group"
              >
                <div className="text-center">
                  <div className="text-2xl mb-2">{category.icon}</div>
                  <p className="font-medium text-gray-900 dark:text-white text-sm mb-1">
                    {category.name}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {category.questionsCount} questions
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="card p-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            to="/categories"
            className="flex items-center p-4 bg-primary-50 dark:bg-primary-900/20 rounded-lg hover:bg-primary-100 dark:hover:bg-primary-900/30 transition-colors group"
          >
            <div className="p-2 bg-primary-600 rounded-lg">
              <Play className="h-5 w-5 text-white" />
            </div>
            <div className="ml-3">
              <p className="font-medium text-primary-900 dark:text-primary-100">
                Start New Quiz
              </p>
              <p className="text-sm text-primary-600 dark:text-primary-400">
                Choose from various categories
              </p>
            </div>
          </Link>

          <Link
            to="/leaderboard"
            className="flex items-center p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg hover:bg-yellow-100 dark:hover:bg-yellow-900/30 transition-colors group"
          >
            <div className="p-2 bg-yellow-600 rounded-lg">
              <Trophy className="h-5 w-5 text-white" />
            </div>
            <div className="ml-3">
              <p className="font-medium text-yellow-900 dark:text-yellow-100">
                View Leaderboard
              </p>
              <p className="text-sm text-yellow-600 dark:text-yellow-400">
                See top performers
              </p>
            </div>
          </Link>

          <Link
            to="/profile"
            className="flex items-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors group"
          >
            <div className="p-2 bg-green-600 rounded-lg">
              <Users className="h-5 w-5 text-white" />
            </div>
            <div className="ml-3">
              <p className="font-medium text-green-900 dark:text-green-100">
                Update Profile
              </p>
              <p className="text-sm text-green-600 dark:text-green-400">
                Manage your account
              </p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
