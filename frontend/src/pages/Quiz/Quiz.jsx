import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { startQuiz, submitQuiz } from "../../store/slices/quizSlice";
import { toast } from "react-toastify"; // Ensure this is imported

const Quiz = () => {
  const { categoryId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, token } = useSelector((state) => state.auth);
  const { currentQuiz, isLoading: quizLoading } = useSelector(
    (state) => state.quiz
  );

  // Check authentication status
  useEffect(() => {
    const checkAuth = () => {
      const storedToken = localStorage.getItem("token");
      if (!storedToken || !token) {
        toast.error("Please login to start a quiz");
        navigate("/login");
      }
    };
    checkAuth();
  }, [token, navigate]);

  // Redirect if not authenticated
  useEffect(() => {
    if (!token) {
      toast.error("Please login to access quizzes");
      navigate("/login");
      return;
    }
  }, [token, navigate]);

  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(600); // Default: 10 minutes (1800 seconds)
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [quizId, setQuizId] = useState(null);
  const [categoryName, setCategoryName] = useState("");
  const [hasSubmitted, setHasSubmitted] = useState(false);

  // Memoize handleSubmitQuiz
  const handleSubmitQuiz = useCallback(async () => {
    try {
      if (!token) {
        toast.error("Please login to submit the quiz");
        navigate("/login");
        return;
      }

      if (hasSubmitted) {
        toast.warning("Quiz has already been submitted!");
        return;
      }

      if (submitting) {
        return;
      }

      if (!quizId) {
        throw new Error("No quiz ID available");
      }

      // Check if all questions are answered
      if (Object.keys(selectedAnswers).length < questions.length) {
        const unanswered =
          questions.length - Object.keys(selectedAnswers).length;
        toast.warning(
          `Please answer all questions. ${unanswered} question(s) remaining.`
        );
        return;
      }

      setSubmitting(true);

      // Format answers for backend
    
      const formattedAnswers = Object.entries(selectedAnswers)
        .map(([questionId, answerIndex]) => {
          const question = questions.find((q) => q._id === questionId);

          if (!question) {
            console.warn(
              `[Submission Warning] Question not found: ${questionId}`
            );
            return null;
          }

          // Ensure options exist and have _id property
          if (
            !Array.isArray(question.options) ||
            !question.options[answerIndex]
          ) {
            console.warn(
              `[Submission Warning] Invalid option index for question: ${questionId}`
            );
            return null;
          }

          const selectedOption = question.options[answerIndex];
          const selectedOptionId = selectedOption._id;

          if (!selectedOptionId) {
            throw new Error(
              `Invalid option selected for question: ${questionId}`
            );
          }

          // Ensure all required properties exist
          if (!questionId || !selectedOptionId) {
            console.warn(
              `[Submission Warning] Missing required properties for question: ${questionId}`
            );
            return null;
          }

          return {
            questionId: questionId.toString(), // Ensure string format
            selectedAnswer: selectedOptionId.toString(), // Ensure string format
            timeSpent: Math.floor((600 - timeLeft) / questions.length),
          };
        })
        .filter((answer) => answer !== null);

      // Filter out any answers where question was missing

      // Remove any null values from formatted answers
      const validAnswers = formattedAnswers.filter((answer) => answer !== null);

      if (validAnswers.length === 0) {
        throw new Error("No valid answers to submit");
      }

      const submissionData = {
        quizId: quizId.toString(), // Ensure quizId is string
        answers: validAnswers,
      };

      // Debug logs
      console.log("=== DEBUG: Submission Data ===");
      console.log("Quiz ID:", submissionData.quizId);
      console.log("Valid Answers:", validAnswers);
      console.log("Full Submission Data:", submissionData);
      console.log("==============================");
      try {
        const result = await dispatch(submitQuiz(submissionData)).unwrap();

        if (result.success) {
          setHasSubmitted(true);
          toast.success("Quiz submitted successfully!");
          navigate(`/quiz/${quizId}/result`);
        } else {
          throw new Error(result.message || "Failed to submit quiz");
        }
      } catch (error) {
        console.error("Error submitting quiz:", error);
        toast.error(error.message || "Failed to submit quiz");
        setHasSubmitted(false);
      } finally {
        setSubmitting(false);
      }
    } catch (error) {
      console.error("Error preparing quiz submission:", error);
      toast.error(error.message || "Failed to prepare quiz submission");
      setSubmitting(false);
    }
  }, [dispatch, questions, quizId, selectedAnswers, timeLeft, navigate]);

  const fetchQuizQuestions = async () => {
    try {
      // Get fresh token from localStorage
      const currentToken = localStorage.getItem("token");

      if (!currentToken) {
        toast.error("Please login to start a quiz");
        navigate("/login");
        return;
      }

      if (!categoryId) {
        throw new Error("Category ID is required");
      }

      setLoading(true);

      const quizData = {
        categoryId,
        settings: {
          questionCount: 10,
          timeLimit: 10,
          difficulty: "mixed",
        },
      };

      const result = await dispatch(
        startQuiz({ quizData, token: currentToken })
      ).unwrap();
      if (!result.success) {
        throw new Error(result.message || "Failed to start quiz");
      }

      if (!result.data?.questions || result.data.questions.length === 0) {
        throw new Error("No questions available for this category");
      }

      // ✅ FIX 1: Extract and save the category name from the result
      // Assuming your backend sends category info like: result.data.categoryInfo.name
      // Or if it's already on the questions array: result.data.questions[0].category.name
      const fetchedCategoryName =
        result.data.categoryName || result.data.category?.name;
      console.log("Fetched Category Name:", fetchedCategoryName);

      setCategoryName(fetchedCategoryName);

      // Validate quiz data
      if (!result.data.quizId || !Array.isArray(result.data.questions)) {
        throw new Error("Invalid quiz data received from server");
      }

      setQuestions(result.data.questions);
      setQuizId(result.data.quizId);
      setTimeLeft(result.data.settings.timeLimit * 60); // Convert minutes to seconds
      setSelectedAnswers({});
      setHasSubmitted(false);
      setSubmitting(false);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching quiz questions:", error);
      toast.error(error.message || "Failed to load quiz questions");
      setLoading(false);
      navigate("/categories");
    }
  };

  useEffect(() => {
    fetchQuizQuestions();
  }, [categoryId]);

  useEffect(() => {
    // Timer countdown
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      // Automatically submit when timer hits zero
      handleSubmitQuiz();
    }
  }, [timeLeft, handleSubmitQuiz]);

  const handleAnswerSelect = (questionId, answerIndex) => {
    setSelectedAnswers({
      ...selectedAnswers,
      [questionId]: answerIndex,
    });
  };

  const handleNextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const currentQ = questions[currentQuestion];

  if (!currentQ || questions.length === 0) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            No Questions Available
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            There are no questions available for this category or the quiz
            failed to load.
          </p>
          <button
            onClick={() => navigate("/categories")}
            className="btn btn-primary mt-4"
          >
            Browse Categories
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
        <div className="flex justify-between items-center">
          <div>
            {/* ✅ FIX 2: Use the user-friendly categoryName */}
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Quiz - {categoryName || "Loading..."}
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Question {currentQuestion + 1} of {questions.length}
            </p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {formatTime(timeLeft)}
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Time Remaining
            </p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-4">
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{
                width: `${((currentQuestion + 1) / questions.length) * 100}%`,
              }}
            ></div>
          </div>
        </div>
      </div>

      {/* Question */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
          {currentQ.question}
        </h2>

        <div className="space-y-3">
          {currentQ.options.map((option, index) => (
            <label
              key={option._id || index}
              className={`flex items-center p-4 rounded-lg border-2 cursor-pointer transition-all ${
                selectedAnswers[currentQ._id] === index
                  ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                  : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
              }`}
            >
              <input
                type="radio"
                name={`question-${currentQ._id}`}
                value={index}
                checked={selectedAnswers[currentQ._id] === index}
                onChange={() => handleAnswerSelect(currentQ._id, index)}
                className="sr-only"
              />
              <div
                className={`w-4 h-4 rounded-full border-2 mr-3 ${
                  selectedAnswers[currentQ._id] === index
                    ? "border-blue-500 bg-blue-500"
                    : "border-gray-300 dark:border-gray-600"
                }`}
              >
                {selectedAnswers[currentQ._id] === index && (
                  <div className="w-2 h-2 bg-white rounded-full mx-auto mt-0.5"></div>
                )}
              </div>
              <span className="text-gray-900 dark:text-white">
                {option.text}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Navigation */}
      <div className="flex justify-between items-center">
        <button
          onClick={handlePreviousQuestion}
          disabled={currentQuestion === 0}
          className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Previous
        </button>

        <div className="flex space-x-4">
          {currentQuestion === questions.length - 1 ? (
            <button
              onClick={handleSubmitQuiz}
              disabled={submitting || hasSubmitted}
              className={`px-6 py-2 text-white rounded-lg ${
                submitting || hasSubmitted
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-green-600 hover:bg-green-700"
              }`}
            >
              {submitting
                ? "Submitting..."
                : hasSubmitted
                ? "Submitted"
                : "Submit Quiz"}
            </button>
          ) : (
            <button
              onClick={handleNextQuestion}
              disabled={submitting}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              Next
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Quiz;
