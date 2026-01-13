import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { getUserStats, getQuizHistory } from "../../store/slices/quizSlice";
import quizService from "../../services/quizService";

const QuizResult = () => {
  const { quizId } = useParams();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const dispatch = useDispatch();
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);

  console.log("Result State:", result);
  useEffect(() => {
    const updateAllData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");

        // Fetch quiz result
        const quizData = await quizService.getQuizReview(quizId, token);

        // Update user stats
        await quizService.getUserStats(token);

        // Transform and set the result data
        const transformedData = {
          category: quizData.category.name,
          score: quizData.results.percentage,
          correctAnswers: quizData.results.correctAnswers,
          incorrectAnswers:
            quizData.results.totalQuestions - quizData.results.correctAnswers,
          timeSpent: quizData.results.totalTime,
          totalQuestions: quizData.results.totalQuestions,
          rank: quizData.results.rank || 1,
          totalParticipants: quizData.results.totalParticipants || 1,
          completedAt: quizData.completedAt,
        };

        setResult(transformedData);
        setLoading(false);
      } catch (error) {
        console.error("Error updating quiz data:", error);
        setLoading(false);
      }
    };

    updateAllData();
  }, [quizId, dispatch]);

  const fetchQuizResult = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await quizService.getQuizReview(quizId, token);
      // Transform the data for the component
      const transformedData = {
        category: response.category.name,
        score: response.results.percentage,
        correctAnswers: response.results.correctAnswers,
        incorrectAnswers:
          response.results.totalQuestions - response.results.correctAnswers,
        timeSpent: response.results.totalTime,
        totalQuestions: response.results.totalQuestions,
        rank: response.results.rank || 1, // Fallback if rank is not provided
        totalParticipants: response.results.totalParticipants || 1, // Fallback if not provided
        completedAt: response.completedAt,
      };
      setResult(transformedData);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching quiz result:", error);
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

  if (!result) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Result Not Found
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            The quiz result could not be found.
          </p>
          <Link
            to="/dashboard"
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Quiz Completed!
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          {result.category || "General"} Quiz
        </p>
      </div>

      {/* Score Card */}
      <div
        className={`${getScoreBgColor(
          result.score
        )} rounded-lg p-8 mb-8 text-center`}
      >
        <div
          className={`text-6xl font-bold ${getScoreColor(result.score)} mb-2`}
        >
          {Math.round(result.score)}%
        </div>
        <p className="text-lg text-gray-700 dark:text-gray-300">Your Score</p>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 text-center">
          <div className="text-3xl font-bold text-green-600 dark:text-green-400 mb-2">
            {result.correctAnswers}
          </div>
          <p className="text-gray-600 dark:text-gray-400">Correct Answers</p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 text-center">
          <div className="text-3xl font-bold text-red-600 dark:text-red-400 mb-2">
            {result.incorrectAnswers}
          </div>
          <p className="text-gray-600 dark:text-gray-400">Incorrect Answers</p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 text-center">
          <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">
            {formatTime(result.timeSpent || 0)}
          </div>
          <p className="text-gray-600 dark:text-gray-400">Time Spent</p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 text-center">
          <div className="text-3xl font-bold text-purple-600 dark:text-purple-400 mb-2">
            #{result.rank || "-"}
          </div>
          <p className="text-gray-600 dark:text-gray-400">Your Rank</p>
        </div>
      </div>

      {/* Performance Analysis */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          Performance Analysis
        </h2>

        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-gray-600 dark:text-gray-400">Accuracy</span>
            <span className="font-semibold text-gray-900 dark:text-white">
              {result.correctAnswers && result.totalQuestions
                ? (
                    (result.correctAnswers / result.totalQuestions) *
                    100  
                  ).toFixed(1)
                : "0"}
              %
            </span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-gray-600 dark:text-gray-400">
              Questions Attempted
            </span>
            <span className="font-semibold text-gray-900 dark:text-white">
              {result.totalQuestions || 0}/{result.totalQuestions || 0}
            </span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-gray-600 dark:text-gray-400">Rank</span>
            <span className="font-semibold text-gray-900 dark:text-white">
              {result.rank || "-"} out of {result.totalParticipants || "-"}
            </span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-gray-600 dark:text-gray-400">
              Completed At
            </span>
            <span className="font-semibold text-gray-900 dark:text-white">
              {result.completedAt
                ? new Date(result.completedAt).toLocaleString()
                : "-"}
            </span>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Link
          to={`/quiz/${quizId}/review`}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-center"
        >
          Review Answers
        </Link>

        <Link
          to="/categories"
          className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 text-center"
        >
          Take Another Quiz
        </Link>

        <Link
          to="/leaderboard"
          className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 text-center"
        >
          View Leaderboard
        </Link>

        <Link
          to="/dashboard"
          className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 text-center"
        >
          Back to Dashboard
        </Link>
      </div>
    </div>
  );
};

export default QuizResult;
