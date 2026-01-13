import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import quizService from "../../services/quizService";

const History = () => {
  const { user } = useSelector((state) => state.auth);
  const [quizHistory, setQuizHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all"); // all, completed, in-progress
  const [sortBy, setSortBy] = useState("date"); // date, score, category

  useEffect(() => {
    fetchQuizHistory();
  }, [filter, sortBy]);

  const fetchQuizHistory = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await quizService.getQuizHistory(
        {
          sort: sortBy,
          filter: filter !== "all" ? filter : undefined,
        },
        token
      );

      // Get the quizzes array from the response
      let filteredHistory = response.quizzes || [];

      // Sort the history based on selected criteria
      filteredHistory.sort((a, b) => {
        switch (sortBy) {
          case "score":
            return (b.results?.percentage || 0) - (a.results?.percentage || 0);
          case "category":
            return (a.category?.name || "").localeCompare(
              b.category?.name || ""
            );
          case "date":
          default:
            return new Date(b.completedAt || 0) - new Date(a.completedAt || 0);
        }
      });

      // Transform the data to match the expected format
      const transformedHistory = filteredHistory.map((quiz) => ({
        id: quiz._id,
        title: quiz.category?.name ? `${quiz.category.name} Quiz` : "Quiz",
        category: quiz.category?.name || "Uncategorized",
        score: quiz.results?.percentage || 0,
        correctAnswers: quiz.results?.correctAnswers || 0,
        totalQuestions: quiz.results?.totalQuestions || 0,
        timeSpent: quiz.results?.totalTime || 0,
        completedAt: quiz.completedAt,
        status: quiz.status,
      }));

      setQuizHistory(transformedHistory);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching quiz history:", error);
      toast.error("Failed to load quiz history");
      setLoading(false);
    }
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  const getScoreColor = (score) => {
    if (score >= 80) return "text-green-600 dark:text-green-400";
    if (score >= 60) return "text-yellow-600 dark:text-yellow-400";
    return "text-red-600 dark:text-red-400";
  };

  const getScoreBgColor = (score) => {
    if (score >= 80) return "bg-green-100 dark:bg-green-900/20";
    if (score >= 60) return "bg-yellow-100 dark:bg-yellow-900/20";
    return "bg-red-100 dark:bg-red-900/20";
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Quiz History
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Track your quiz performance and progress over time
        </p>
      </div>

      {/* Filters and Controls */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
          <div className="flex flex-col sm:flex-row gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Filter by Status
              </label>
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="all">All Quizzes</option>
                <option value="completed">Completed</option>
                <option value="in-progress">In Progress</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Sort by
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="date">Date</option>
                <option value="score">Score</option>
                <option value="category">Category</option>
              </select>
            </div>
          </div>

          <div className="text-sm text-gray-600 dark:text-gray-400">
            {quizHistory.length} quiz{quizHistory.length !== 1 ? "es" : ""}{" "}
            found
          </div>
        </div>
      </div>

      {/* Quiz History List */}
      {quizHistory.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-12 text-center">
          <div className="text-gray-400 dark:text-gray-500 mb-4">
            <svg
              className="w-16 h-16 mx-auto"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            No Quiz History
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            You haven't taken any quizzes yet. Start your learning journey!
          </p>
          <Link
            to="/categories"
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Take Your First Quiz
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {quizHistory.map((quiz) => (
            <div
              key={quiz.id}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                <div className="flex-1">
                  <div className="flex items-center mb-2">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mr-3">
                      {quiz.title}
                    </h3>
                    <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-400 text-xs font-medium rounded-full">
                      {quiz.category}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm text-gray-600 dark:text-gray-400">
                    <div>
                      <span className="font-medium">Score:</span>
                      <span
                        className={`ml-1 font-semibold ${getScoreColor(
                          quiz.score
                        )}`}
                      >
                        {quiz.score}%
                      </span>
                    </div>
                    <div>
                      <span className="font-medium">Questions:</span>
                      <span className="ml-1">
                        {quiz.correctAnswers}/{quiz.totalQuestions}
                      </span>
                    </div>
                    <div>
                      <span className="font-medium">Time:</span>
                      <span className="ml-1">{formatTime(quiz.timeSpent)}</span>
                    </div>
                    <div>
                      <span className="font-medium">Date:</span>
                      <span className="ml-1">
                        {new Date(quiz.completedAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center mt-4 lg:mt-0 lg:ml-6">
                  <div
                    className={`px-4 py-2 rounded-lg mr-4 ${getScoreBgColor(
                      quiz.score
                    )}`}
                  >
                    <span
                      className={`text-2xl font-bold ${getScoreColor(
                        quiz.score
                      )}`}
                    >
                      {quiz.score}%
                    </span>
                  </div>

                  <div className="flex space-x-2">
                    <Link
                      to={`/quiz/${quiz.id}/result`}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
                    >
                      View Result
                    </Link>
                    <Link
                      to={`/quiz/${quiz.id}/review`}
                      className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 text-sm"
                    >
                      Review
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Summary Statistics */}
      {quizHistory.length > 0 && (
        <div className="mt-8 bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Summary Statistics
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {quizHistory.length}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Total Quizzes
              </div>
            </div>

            <div className="text-center">
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                {Math.round(
                  quizHistory.reduce((sum, quiz) => sum + quiz.score, 0) /
                    quizHistory.length
                )}
                %
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Average Score
              </div>
            </div>

            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                {Math.max(...quizHistory.map((quiz) => quiz.score))}%
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Best Score
              </div>
            </div>

            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                {formatTime(
                  Math.round(
                    quizHistory.reduce((sum, quiz) => sum + quiz.timeSpent, 0) /
                      quizHistory.length
                  )
                )}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Avg. Time
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default History;
