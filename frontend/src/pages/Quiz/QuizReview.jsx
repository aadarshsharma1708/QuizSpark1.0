import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useSelector } from "react-redux";
import quizService from "../../services/quizService";
import categoryService from "../../services/categoryService";

const QuizReview = () => {
  const { quizId } = useParams();
  const { user } = useSelector((state) => state.auth);

  const [reviewData, setReviewData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentQuestion, setCurrentQuestion] = useState(0);

  useEffect(() => {
    fetchQuizReview();
  }, [quizId]);

  const fetchQuizReview = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await quizService.getQuizReview(quizId, token);

      // Transform the data to match our component's expectations
      console.log("response data:", response);
      const transformedData = {
        category: response.category,
        questions: response.questions.map((q) => ({
          questionId: q.questionId,
          question: q.question,
          options: q.options,
          selectedAnswer: q.selectedAnswer,
          correctAnswerId: q.correctAnswerId,
          isCorrect: q.isCorrect,
          points: q.points,
          timeSpent: q.timeSpent,
          explanation: q.explanation,
        })),
        grade: response.results.percentage,
        totalQuestions: response.results.totalQuestions,
        correctAnswers: response.results.correctAnswers,
        totalTime: response.results.totalTime,
      };

      setReviewData(transformedData);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching quiz review:", error);
      setLoading(false);
    }
  };
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!reviewData) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Review Not Found
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            The quiz review could not be found.
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

  const currentQ = reviewData.questions[currentQuestion];
  console.log("Current Question : ", currentQ);

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Quiz Review - {reviewData.category.name}
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Question {currentQuestion + 1} of {reviewData.questions.length}
            </p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {reviewData.grade}%
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Final Score
            </p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
          <div
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{
              width: `${
                ((currentQuestion + 1) / reviewData.questions.length) * 100
              }%`,
            }}
          ></div>
        </div>
      </div>

      {/* Question Review */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
        {/* Question Status */}
        <div
          className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium mb-4 ${
            currentQ.isCorrect
              ? "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
              : "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400"
          }`}
        >
          {currentQ.isCorrect ? (
            <>
              <svg
                className="w-4 h-4 mr-1"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
              Correct
            </>
          ) : (
            <>
              <svg
                className="w-4 h-4 mr-1"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
              Incorrect
            </>
          )}
        </div>

        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
          {currentQ.question}
        </h2>

        <div className="space-y-3 mb-6">
          {currentQ.options &&
            currentQ.options.map((option, index) => {
              let optionClass = "flex items-center p-4 rounded-lg border-2 ";

              const isCorrectAnswer = option._id === currentQ.correctAnswerId;
              const isUserAnswer = option._id === currentQ.selectedAnswer;

              if (isCorrectAnswer) {
                optionClass +=
                  "border-green-500 bg-green-50 dark:bg-green-900/20";
              } else if (isUserAnswer && !currentQ.isCorrect) {
                optionClass += "border-red-500 bg-red-50 dark:bg-red-900/20";
              } else {
                optionClass += "border-gray-200 dark:border-gray-700";
              }

              return (
                <div key={option._id} className={optionClass}>
                  <div
                    className={`w-4 h-4 rounded-full border-2 mr-3 ${
                      isCorrectAnswer
                        ? "border-green-500 bg-green-500"
                        : isUserAnswer && !currentQ.isCorrect
                        ? "border-red-500 bg-red-500"
                        : "border-gray-300 dark:border-gray-600"
                    }`}
                  >
                    {(isCorrectAnswer ||
                      (isUserAnswer && !currentQ.isCorrect)) && (
                      <div className="w-2 h-2 bg-white rounded-full mx-auto mt-0.5"></div>
                    )}
                  </div>
                  <span className="text-gray-900 dark:text-white flex-1">
                    {option.text}
                  </span>
                  {isCorrectAnswer && (
                    <span className="text-green-600 dark:text-green-400 text-sm font-medium">
                      Correct Answer
                    </span>
                  )}
                  {isUserAnswer && !isCorrectAnswer && (
                    <span className="text-red-600 dark:text-red-400 text-sm font-medium">
                      Your Answer
                    </span>
                  )}
                </div>
              );
            })}
        </div>

        {/* Explanation */}
        {currentQ.explanation && (
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <h3 className="font-semibold text-blue-900 dark:text-blue-300 mb-2">
              Explanation
            </h3>
            <p className="text-blue-800 dark:text-blue-200">
              {currentQ.explanation}
            </p>
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="flex justify-between items-center mb-6">
        <button
          onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
          disabled={currentQuestion === 0}
          className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Previous
        </button>

        <div className="flex space-x-2">
          {reviewData.questions.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentQuestion(index)}
              className={`w-8 h-8 rounded-full text-sm font-medium ${
                index === currentQuestion
                  ? "bg-blue-600 text-white"
                  : reviewData.questions[index].isCorrect
                  ? "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
                  : "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400"
              }`}
            >
              {index + 1}
            </button>
          ))}
        </div>

        <button
          onClick={() =>
            setCurrentQuestion(
              Math.min(reviewData.questions.length - 1, currentQuestion + 1)
            )
          }
          disabled={currentQuestion === reviewData.questions.length - 1}
          className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Next
        </button>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Link
          to={`/quiz/${quizId}/result`}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-center"
        >
          Back to Results
        </Link>

        <Link
          to="/categories"
          className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 text-center"
        >
          Take Another Quiz
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

export default QuizReview;
