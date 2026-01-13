import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import leaderboardService from "../../services/leaderboardService";
import categoryService from "../../services/categoryService";

const Leaderboard = () => {
  const { user } = useSelector((state) => state.auth);
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [categories, setCategories] = useState([]);
  const [timeFilter, setTimeFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchLeaderboard();
  }, [timeFilter, categoryFilter]);

  const fetchCategories = async () => {
    try {
      const response = await categoryService.getCategories();
      setCategories(response.data || response);
    } catch (error) {
      console.error("Error fetching categories:", error);
      setError("Failed to load categories");
    }
  };

  const fetchLeaderboard = async () => {
  try {
    setLoading(true);
    setError(null);
    
    const token = localStorage.getItem("token");
    
    if (!token) {
      throw new Error("Authentication required");
    }

    console.log("Fetching leaderboard with filters:", {
      timeFilter,
      categoryFilter,
    });

    let data;
    let requestParams = { period: timeFilter };

    if (categoryFilter === "all") {
      console.log("Making global leaderboard call with params:", requestParams);
      data = await leaderboardService.getGlobalLeaderboard(requestParams, token);
    } else {
      console.log("Making category leaderboard call with:", {
        categoryId: categoryFilter,
        params: requestParams
      });
      data = await leaderboardService.getCategoryLeaderboard(
        categoryFilter,
        requestParams,
        token
      );
    }

    console.log("Leaderboard data received:", data);
    console.log("Data type:", typeof data, "Is array:", Array.isArray(data));

    // Handle the case where service might still return an object
    let actualData = data;
    if (data && typeof data === 'object' && !Array.isArray(data) && data.data) {
      console.log("Extracting data from response object");
      actualData = data.data;
    }

    if (!Array.isArray(actualData)) {
      console.error("Final data is not an array:", typeof actualData, actualData);
      throw new Error("Invalid response format - expected array");
    }

    // Add ranking and isCurrentUser flag to each entry
    const mappedData = actualData.map((entry, index) => ({
      ...entry,
      rank: entry.rank || index + 1,
      isCurrentUser: user && entry.username === user.username,
    }));

    console.log("Final mapped data:", mappedData);
    setLeaderboardData(mappedData);
  } catch (error) {
    console.error("Error fetching leaderboard:", error);
    setError(error.message || "Failed to load leaderboard");
    setLeaderboardData([]);
  } finally {
    setLoading(false);
  }
};


  const getRankIcon = (rank) => {
    switch (rank) {
      case 1:
        return "🥇";
      case 2:
        return "🥈";
      case 3:
        return "🥉";
      default:
        return `#${rank}`;
    }
  };

  const getRankColor = (rank) => {
    switch (rank) {
      case 1:
        return "text-yellow-600 dark:text-yellow-400";
      case 2:
        return "text-gray-600 dark:text-gray-400";
      case 3:
        return "text-amber-600 dark:text-amber-400";
      default:
        return "text-gray-900 dark:text-white";
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-lg p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <span className="text-red-400">⚠️</span>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800 dark:text-red-200">
                Error Loading Leaderboard
              </h3>
              <div className="mt-2 text-sm text-red-700 dark:text-red-300">
                {error}
              </div>
              <div className="mt-4">
                <button
                  onClick={fetchLeaderboard}
                  className="bg-red-100 dark:bg-red-800 hover:bg-red-200 dark:hover:bg-red-700 text-red-800 dark:text-red-200 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Try Again
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Debug Info - Remove in production */}
      {/* <div className="mb-4 p-3 bg-gray-100 dark:bg-gray-700 rounded text-sm">
        <strong>Debug:</strong> Time: {timeFilter}, Category: {categoryFilter}, Results: {leaderboardData.length}
      </div> */}

      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Leaderboard
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          See how you rank against other quiz enthusiasts
        </p>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Time Period
            </label>
            <select
              value={timeFilter}
              onChange={(e) => setTimeFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="all">All Time</option>
              <option value="month">This Month</option>
              <option value="week">This Week</option>
            </select>
          </div>

          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Category
            </label>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="all">All Categories</option>
              {categories.map((category) => (
                <option key={category._id} value={category._id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Content */}
      {leaderboardData.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-12 text-center">
          <div className="text-4xl mb-4">🏆</div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            No Data Found
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            No quiz results found for the selected time period and category.
          </p>
        </div>
      ) : (
        <>
          {/* Top 3 Podium */}
          {leaderboardData.length >= 3 && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {leaderboardData.slice(0, 3).map((player, index) => (
                <div
                  key={player._id || `podium-${index}`}
                  className={`bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 text-center ${
                    player.isCurrentUser ? "ring-2 ring-blue-500" : ""
                  } ${
                    index === 0
                      ? "md:order-2 transform md:scale-105"
                      : index === 1
                      ? "md:order-1"
                      : "md:order-3"
                  }`}
                >
                  <div className={`text-4xl mb-2 ${getRankColor(player.rank)}`}>
                    {getRankIcon(player.rank)}
                  </div>

                  <div className="w-16 h-16 mx-auto mb-4 bg-gray-300 dark:bg-gray-600 rounded-full flex items-center justify-center">
                    {player.avatar ? (
                      <img
                        src={player.avatar}
                        alt={player.username}
                        className="w-16 h-16 rounded-full object-cover"
                      />
                    ) : (
                      <span className="text-2xl text-gray-600 dark:text-gray-400">
                        {player.username?.charAt(0).toUpperCase() || "?"}
                      </span>
                    )}
                  </div>

                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    {player.username}
                    {player.isCurrentUser && (
                      <span className="ml-2 text-sm text-blue-600 dark:text-blue-400">
                        (You)
                      </span>
                    )}
                  </h3>

                  <div className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                    <p>
                      Total Score:{" "}
                      <span className="font-semibold">{player.totalScore || 0}</span>
                    </p>
                    <p>
                      Quizzes:{" "}
                      <span className="font-semibold">{player.totalQuizzes || 0}</span>
                    </p>
                    <p>
                      Average:{" "}
                      <span className="font-semibold">{player.averageScore || 0}%</span>
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Full Leaderboard */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Full Rankings ({leaderboardData.length} players)
              </h2>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Rank
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Player
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Total Score
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Quizzes
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Average
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {leaderboardData.map((player, index) => (
                    <tr
                      key={player._id || `table-${player.username}-${index}`}
                      className={`${
                        player.isCurrentUser
                          ? "bg-blue-50 dark:bg-blue-900/20"
                          : "bg-white dark:bg-gray-800"
                      } hover:bg-gray-50 dark:hover:bg-gray-700`}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div
                          className={`text-sm font-medium ${getRankColor(
                            player.rank
                          )}`}
                        >
                          {getRankIcon(player.rank)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-gray-300 dark:bg-gray-600 rounded-full flex items-center justify-center mr-3">
                            {player.avatar ? (
                              <img
                                src={player.avatar}
                                alt={player.username}
                                className="w-10 h-10 rounded-full object-cover"
                              />
                            ) : (
                              <span className="text-sm text-gray-600 dark:text-gray-400">
                                {player.username?.charAt(0).toUpperCase() || "?"}
                              </span>
                            )}
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-900 dark:text-white">
                              {player.username}
                              {player.isCurrentUser && (
                                <span className="ml-2 text-xs text-blue-600 dark:text-blue-400">
                                  (You)
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        {player.totalScore || 0}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        {player.totalQuizzes || 0}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        {player.averageScore || 0}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Leaderboard;
