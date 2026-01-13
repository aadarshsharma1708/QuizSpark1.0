import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { Search, BookOpen, Play, Users, Target } from "lucide-react";
import { getCategories } from "../../store/slices/categorySlice";

const Categories = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredCategories, setFilteredCategories] = useState([]);

  const dispatch = useDispatch();
  const { categories, isLoading } = useSelector((state) => state.categories);
  const { user } = useSelector((state) => state.auth);

  // ✅ NEW: useEffect to fetch data from the API via Redux
  useEffect(() => {
    dispatch(getCategories());
  }, [dispatch]);

  // ✅ NEW: useEffect to filter the REAL categories from the store
  useEffect(() => {
    if (searchTerm) {
      const filtered = categories.filter(
        (category) =>
          category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          category.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredCategories(filtered);
    } else {
      // Set filtered to the full list from the store
      setFilteredCategories(categories);
    }
  }, [searchTerm, categories]);

  const getDifficultyColor = (difficulty) => {
    switch (difficulty.toLowerCase()) {
      case "easy":
        return "text-green-600 bg-green-100 dark:bg-green-900/20";
      case "medium":
        return "text-yellow-600 bg-yellow-100 dark:bg-yellow-900/20";
      case "hard":
        return "text-red-600 bg-red-100 dark:bg-red-900/20";
      default:
        return "text-blue-600 bg-blue-100 dark:bg-blue-900/20";
    }
  };

  const getDifficultyLabel = (difficulty) => {
    return difficulty.charAt(0).toUpperCase() + difficulty.slice(1);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="spinner w-8 h-8"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          Quiz Categories
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          Choose from a variety of topics and test your knowledge. Each category
          offers unique challenges and learning opportunities.
        </p>
      </div>

      {/* Search Bar */}
      <div className="max-w-md mx-auto">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search categories..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input pl-10 w-full"
          />
        </div>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredCategories.map((category) => (
          <div
            key={category._id}
            className="card card-hover p-6 group relative overflow-hidden"
          >
            {/* Background Pattern */}
            <div
              className="absolute top-0 right-0 w-20 h-20 opacity-10 transform rotate-12 translate-x-6 -translate-y-6"
              style={{ backgroundColor: category.color }}
            />

            {/* Category Icon */}
            <div className="flex items-center justify-between mb-4">
              <div
                className="w-12 h-12 rounded-lg flex items-center justify-center text-white text-xl font-bold group-hover:scale-110 transition-transform duration-200"
                style={{ backgroundColor: category.color }}
              >
                {category.icon}
              </div>
              {/* {console.log("category stats:", category.stats)} */}
              <div
                className={`badge ${getDifficultyColor(category.difficulty)}`}
              >
                {getDifficultyLabel(category.difficulty)}
              </div>
            </div>

            {/* Category Info */}
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              {category.name}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
              {category.description}
            </p>

            {/* Stats */}
            <div className="space-y-2 mb-6">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center text-gray-500 dark:text-gray-400">
                  <Target className="h-4 w-4 mr-1" />
                  Questions
                </div>
                <span className="font-medium text-gray-900 dark:text-white">
                  {category.questionCount}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center text-gray-500 dark:text-gray-400">
                  <Users className="h-4 w-4 mr-1" />
                  Attempts
                </div>
                <span className="font-medium text-gray-900 dark:text-white">
                  {category.stats.totalQuizzes.toLocaleString()}
                </span>
              </div>
            </div>

            {/* Action Button */}
            {user ? (
              <Link
                to={`/quiz/${category._id}`}
                className="btn btn-primary w-full group-hover:shadow-lg transition-shadow duration-200"
              >
                <Play className="h-4 w-4 mr-2" />
                Start Quiz
              </Link>
            ) : (
              <Link to="/auth/login" className="btn btn-outline-primary w-full">
                Login to Play
              </Link>
            )}
          </div>
        ))}
      </div>

      {/* No Results */}
      {filteredCategories.length === 0 && searchTerm && (
        <div className="text-center py-12">
          <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            No categories found
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Try adjusting your search terms or browse all categories.
          </p>
          <button
            onClick={() => setSearchTerm("")}
            className="btn btn-primary mt-4"
          >
            Show All Categories
          </button>
        </div>
      )}

      {/* Stats Summary */}
      <div className="bg-gradient-to-r from-primary-50 to-purple-50 dark:from-primary-900/20 dark:to-purple-900/20 rounded-xl p-6 mt-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
          <div>
            <div className="text-2xl font-bold text-primary-600 dark:text-primary-400 mb-1">
              {categories.length}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Categories Available
            </div>
          </div>
          <div>
            <div className="text-2xl font-bold text-primary-600 dark:text-primary-400 mb-1">
              {categories
                .reduce((sum, cat) => sum + cat.questionCount, 0)
                .toLocaleString()}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Total Questions
            </div>
          </div>
          <div>
            <div className="text-2xl font-bold text-primary-600 dark:text-primary-400 mb-1">
              {categories
                .reduce((sum, cat) => sum + cat.stats.totalQuizzes, 0)
                .toLocaleString()}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Quizzes Completed
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Categories;
