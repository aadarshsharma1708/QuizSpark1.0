import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import questionService from "../../services/questionService";
import categoryService from "../../services/categoryService";
import path from "path"; // Note: path module is typically NOT used in frontend React

const AdminQuestions = () => {
  const [questions, setQuestions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [categoryLoading, setCategoryLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [formData, setFormData] = useState({
    question: "",
    options: ["", "", "", ""],
    correctAnswer: 0,
    category: "",
    difficulty: "medium",
    type: "multiple-choice",
    explanation: "",
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  // Fetch questions whenever categories change
  useEffect(() => {
    fetchQuestions();
  }, [categories]);

  const fetchQuestions = async () => {
    try {
      setLoading(true);
      const response = await questionService.getQuestions();
      const questionsArray = response.data || [];
      if (!Array.isArray(questionsArray)) {
        console.error("Invalid questions data format:", questionsArray);
        throw new Error("Invalid questions data format");
      }
      setQuestions(questionsArray);
    } catch (error) {
      console.error("Error fetching questions:", error);
      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Error fetching questions"
      );
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      setCategoryLoading(true);
      const response = await categoryService.getCategories();
      const categoriesArray = response.data || [];
      if (!Array.isArray(categoriesArray)) {
        console.error("Invalid categories data format:", categoriesArray);
        throw new Error("Invalid categories data format");
      }
      setCategories(categoriesArray);
      setCategoryLoading(false);
    } catch (error) {
      console.error("Error fetching categories:", error);
      toast.error("Failed to load categories");
      setCategories([]);
      setCategoryLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith("option-")) {
      const index = parseInt(name.split("-")[1]);
      setFormData((prev) => ({
        ...prev,
        options: prev.options.map((opt, i) => (i === index ? value : opt)),
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: name === "correctAnswer" ? parseInt(value) : value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Validate form data
      if (!formData.question?.trim()) {
        throw new Error("Question text is required");
      }
      if (!formData.category) {
        throw new Error("Category is required");
      }
      if (!formData.options.every((option) => option.trim())) {
        throw new Error("All options must be filled out");
      }
      if (new Set(formData.options).size !== formData.options.length) {
        throw new Error("All options must be unique");
      }

      const questionData = {
        question: formData.question.trim(),
        options: formData.options.map((opt, index) => ({
          text: opt.trim(),
          isCorrect: index === parseInt(formData.correctAnswer),
        })),
        category: formData.category,
        difficulty: formData.difficulty,
        type: "multiple-choice",
        explanation: formData.explanation?.trim() || "",
      };

      // Validate that we have at least one correct answer
      if (!questionData.options.some((opt) => opt.isCorrect)) {
        throw new Error("Please select a correct answer");
      }

      // Validate minimum options
      if (questionData.options.filter((opt) => opt.text.trim()).length < 2) {
        throw new Error("At least two options are required");
      }

      console.log("Submitting question data:", questionData); // Debug log

      if (editingQuestion) {
        // Update existing question
        await questionService.updateQuestion(editingQuestion._id, questionData);
        toast.success("Question updated successfully");
      } else {
        // Create new question
        await questionService.createQuestion(questionData);
        toast.success("Question created successfully");
      }

      // Refresh questions list
      await fetchQuestions();

      setShowModal(false);
      setEditingQuestion(null);
      setFormData({
        question: "",
        options: ["", "", "", ""],
        correctAnswer: 0,
        category: categories[0]?._id || "",
        difficulty: "medium",
        explanation: "",
      });
    } catch (error) {
      console.error("Error saving question:", error);
      console.error("Error response:", error.response?.data); // Debug log
      console.error("Request data:", error.config?.data); // Debug log
      toast.error(
        error.response?.data?.message ||
          error.response?.data?.error ||
          error.message ||
          "Error saving question"
      );
    }
  };

  const handleEdit = (question) => {
    setEditingQuestion(question);
    setFormData({
      question: question.question,
      // ✅ FIX 2: Map the option objects back to simple strings for the form inputs
      options: question.options.map((opt) => opt.text),

      // Note: If you have a separate correct answer index field in the DB, use that.
      // Otherwise, find the index of the correct option object:
      correctAnswer:
        question.options.findIndex((opt) => opt.isCorrect) !== -1
          ? question.options.findIndex((opt) => opt.isCorrect)
          : 0,

      category: question.category?._id || question.category,
      difficulty: question.difficulty,
      explanation: question.explanation || "",
    });
    setShowModal(true);
  };

  const handleDelete = async (questionId) => {
    if (
      window.confirm(
        "Are you sure you want to delete this question? This action cannot be undone."
      )
    ) {
      try {
        await questionService.deleteQuestion(questionId);
        toast.success("Question deleted successfully");
        await fetchQuestions();
      } catch (error) {
        console.error("Error deleting question:", error);
        toast.error("Failed to delete question");
      }
    }
  };

  const openCreateModal = () => {
    if (!categories.length) {
      toast.error("Please wait for categories to load");
      return;
    }
    setEditingQuestion(null);
    setFormData({
      question: "",
      options: ["", "", "", ""],
      correctAnswer: 0,
      category: categories[0]._id,
      difficulty: "medium",
      explanation: "",
    });
    setShowModal(true);
  };

  const filteredQuestions = questions.filter((question) => {
    const matchesCategory =
      selectedCategory === "all" || question.category?._id === selectedCategory;
    const matchesSearch = question.question
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case "easy":
        return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400";
      case "medium":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400";
      case "hard":
        return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-400";
    }
  };

  if (loading || categoryLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Manage Questions
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Create and manage quiz questions
          </p>
        </div>
        <button
          onClick={openCreateModal}
          disabled={categories.length === 0}
          className={`px-6 py-3 flex items-center ${
            categories.length === 0
              ? "bg-blue-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          } text-white rounded-lg`}
        >
          <svg
            className="w-5 h-5 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
            />
          </svg>
          Add Question
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Search Questions
            </label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by question text..."
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Filter by Category
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => {
                setSelectedCategory(e.target.value);
              }}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="all">All Categories</option>
              {categories.length > 0 ? (
                categories.map((category) => (
                  <option key={category._id} value={category._id}>
                    {category.name}
                  </option>
                ))
              ) : (
                <option value="" disabled>
                  No categories available
                </option>
              )}
            </select>
          </div>
        </div>
        <div className="mt-4 text-sm text-gray-600 dark:text-gray-400">
          Showing {filteredQuestions.length} of {questions.length} questions
        </div>
      </div>

      {/* Questions List */}
      <div className="space-y-4">
        {filteredQuestions.map((question) => (
          <div
            key={question._id}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="flex-1">
                <div className="flex items-center mb-2">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mr-3">
                    {question.question}
                  </h3>
                  <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-400 text-xs font-medium rounded-full mr-2">
                    {question.category?.name ||
                      categories.find((c) => c._id === question.category)
                        ?.name ||
                      "Uncategorized"}
                  </span>
                  <span
                    className={`px-2 py-1 text-xs font-medium rounded-full ${getDifficultyColor(
                      question.difficulty
                    )}`}
                  >
                    {question.difficulty}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-3">
                  {question.options.map((option, index) => (
                    <div
                      key={option._id || index} // Use _id if available, otherwise index
                      className={`p-2 rounded border text-sm ${
                        option.isCorrect
                          ? "border-green-500 bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-400"
                          : "border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300"
                      }`}
                    >
                      {String.fromCharCode(65 + index)}. {option.text}{" "}
                      {/* ✅ FIX 1 APPLIED */}
                      {option.isCorrect && (
                        <span className="ml-2 text-xs font-medium">
                          (Correct)
                        </span>
                      )}
                    </div>
                  ))}
                </div>

                {question.explanation && (
                  <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded p-3 mb-3">
                    <p className="text-sm text-blue-800 dark:text-blue-200">
                      <strong>Explanation:</strong> {question.explanation}
                    </p>
                  </div>
                )}

                <div className="text-xs text-gray-500 dark:text-gray-400">
                  Created: {new Date(question.createdAt).toLocaleString()}
                </div>
              </div>

              <div className="flex space-x-2 ml-4">
                <button
                  onClick={() => handleEdit(question)}
                  className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(question._id)}
                  className="px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredQuestions.length === 0 && (
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
                d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            No Questions Found
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            {searchTerm || selectedCategory !== "all"
              ? "Try adjusting your search or filter criteria."
              : "Get started by creating your first question."}
          </p>
          <button
            onClick={openCreateModal}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Create Question
          </button>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              {editingQuestion ? "Edit Question" : "Create New Question"}
            </h2>

            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Question
                </label>
                <textarea
                  name="question"
                  value={formData.question}
                  onChange={handleInputChange}
                  required
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="Enter your question"
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Answer Options
                </label>
                {formData.options.map((option, index) => (
                  <div key={index} className="flex items-center mb-2">
                    <input
                      type="radio"
                      name="correctAnswer"
                      value={index}
                      checked={formData.correctAnswer === index}
                      onChange={handleInputChange}
                      className="mr-3"
                    />
                    <input
                      type="text"
                      name={`option-${index}`}
                      value={option}
                      onChange={handleInputChange}
                      required
                      className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      placeholder={`Option ${String.fromCharCode(65 + index)}`}
                    />
                  </div>
                ))}
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Select the radio button next to the correct answer
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Category
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  >
                    <option value="">Select Category</option>
                    {categories.map((category) => (
                      <option key={category._id} value={category._id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Difficulty
                  </label>
                  <select
                    name="difficulty"
                    value={formData.difficulty}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  >
                    <option value="easy">Easy</option>
                    <option value="medium">Medium</option>
                    <option value="hard">Hard</option>
                  </select>
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Explanation (Optional)
                </label>
                <textarea
                  name="explanation"
                  value={formData.explanation}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="Provide an explanation for the correct answer"
                />
              </div>

              <div className="flex space-x-3">
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  {editingQuestion ? "Update" : "Create"}
                </button>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminQuestions;
