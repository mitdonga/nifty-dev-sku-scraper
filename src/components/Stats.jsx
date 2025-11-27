import { useState, useEffect } from 'react';
import { fetchScrapingStats } from '../services/api';

// Status color mapping
const STATUS_COLORS = {
  scraping_done: 'bg-green-100 text-green-800 border-green-300',
  pending: 'bg-yellow-100 text-yellow-800 border-yellow-300',
  no_result: 'bg-red-100 text-red-800 border-red-300',
  error: 'bg-red-100 text-red-800 border-red-300',
  invalid_search_results: 'bg-orange-100 text-orange-800 border-orange-300',
  category_not_match: 'bg-purple-100 text-purple-800 border-purple-300',
  processing: 'bg-blue-100 text-blue-800 border-blue-300',
};

// Status label mapping
const STATUS_LABELS = {
  scraping_done: 'Scraping Done',
  pending: 'Pending',
  no_result: 'No Result',
  invalid_search_results: 'Invalid Search Results',
  category_not_match: 'Category Not Match',
  processing: 'Processing',
  error: 'Error',
};

function Stats() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [collapsedCategories, setCollapsedCategories] = useState(new Set());

  const loadStats = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchScrapingStats();
      setStats(data);
    } catch (err) {
      setError(err.message || 'Failed to load stats');
      console.error('Error loading stats:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStats();
  }, []);

  // Initialize all categories as collapsed when stats are loaded
  useEffect(() => {
    if (stats && Object.keys(stats).length > 0) {
      const allCategories = Object.keys(stats);
      setCollapsedCategories(new Set(allCategories));
    }
  }, [stats]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading stats...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md">
          <h2 className="text-red-800 font-semibold mb-2">Error Loading Stats</h2>
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={loadStats}
            className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-200"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!stats || Object.keys(stats).length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-gray-600 text-lg">No stats data available</p>
        </div>
      </div>
    );
  }

  // Convert stats object to array for easier rendering
  const categories = Object.entries(stats).map(([category, statuses]) => {
    // Calculate total count for the category
    const totalCount = Object.values(statuses).reduce(
      (sum, statusData) => sum + (statusData.status_count || 0),
      0
    );

    // Calculate pending count
    const pendingCount = statuses.pending?.status_count || 0;
    
    // Calculate non-pending count
    const nonPendingCount = totalCount - pendingCount;
    
    // Calculate total progress: (non-pending count) / (total count)
    const totalProgress = totalCount > 0 ? (nonPendingCount / totalCount) * 100 : 0;

    return {
      category,
      statuses: Object.entries(statuses).map(([status, data]) => ({
        status,
        ...data,
      })),
      totalCount,
      pendingCount,
      nonPendingCount,
      totalProgress,
    };
  });

  // Sort categories by total count (descending)
  categories.sort((a, b) => b.totalCount - a.totalCount);

  const toggleCategory = (category) => {
    setCollapsedCategories((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(category)) {
        newSet.delete(category);
      } else {
        newSet.add(category);
      }
      return newSet;
    });
  };

  const isCollapsed = (category) => collapsedCategories.has(category);

  return (
    <div className="w-full max-w-full px-1 py-8">
      <div className="mb-6 flex justify-between items-center px-2">
        <h1 className="text-3xl font-bold text-gray-800">Scraping Stats</h1>
        <button
          onClick={loadStats}
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-200"
        >
          Refresh
        </button>
      </div>

      <div className="space-y-6">
        {categories.map(({ category, statuses, totalCount, totalProgress }) => {
          const collapsed = isCollapsed(category);
          return (
            <div
              key={category}
              className="bg-white rounded-lg shadow-lg overflow-hidden"
            >
              <div
                className="bg-gradient-to-r from-indigo-500 to-purple-600 px-6 py-4 cursor-pointer hover:from-indigo-600 hover:to-purple-700 transition-colors"
                onClick={() => toggleCategory(category)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h2 className="text-xl font-bold text-white">{category}</h2>
                      <span className="text-white text-sm font-semibold bg-white/20 px-3 py-1 rounded-full">
                        {totalProgress.toFixed(1)}%
                      </span>
                    </div>
                    <p className="text-indigo-100 text-sm mb-2">
                      Total: {totalCount.toLocaleString()} items
                    </p>
                    <div className="w-full bg-white/20 rounded-full h-2 overflow-hidden">
                      <div
                        className="h-full bg-white transition-all duration-500"
                        style={{ width: `${totalProgress}%` }}
                      ></div>
                    </div>
                  </div>
                  <svg
                    className={`w-6 h-6 text-white transition-transform duration-200 ml-4 flex-shrink-0 ${
                      collapsed ? '' : 'rotate-180'
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>
              </div>

              {!collapsed && (
                <div className="p-6">
                  <div className="space-y-4">
                    {statuses.map(({ status, status_count, percentage }) => {
                      const statusColor = STATUS_COLORS[status] || 'bg-gray-100 text-gray-800 border-gray-300';
                      const statusLabel = STATUS_LABELS[status] || status;

                      return (
                        <div key={status} className="border rounded-lg p-4">
                          <div className="flex items-center justify-between mb-2">
                            <span
                              className={`px-3 py-1 rounded-full text-sm font-semibold border ${statusColor}`}
                            >
                              {statusLabel}
                            </span>
                            <div className="text-right">
                              <span className="text-lg font-bold text-gray-900">
                                {status_count.toLocaleString()}
                              </span>
                              <span className="text-sm text-gray-600 ml-2">
                                ({percentage.toFixed(2)}%)
                              </span>
                            </div>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                            <div
                              className={`h-full transition-all duration-500 ${
                                status === 'scraping_done'
                                  ? 'bg-green-500'
                                  : status === 'pending'
                                  ? 'bg-yellow-500'
                                  : status === 'no_result'
                                  ? 'bg-red-500'
                                  : status === 'invalid_search_results'
                                  ? 'bg-orange-500'
                                  : status === 'category_not_match'
                                  ? 'bg-purple-500'
                                  : status === 'processing'
                                  ? 'bg-blue-500'
                                  : 'bg-gray-500'
                              }`}
                              style={{ width: `${percentage}%` }}
                            ></div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-6 text-sm text-gray-600 px-2">
        Showing {categories.length} categor{categories.length !== 1 ? 'ies' : 'y'}
      </div>
    </div>
  );
}

export default Stats;

