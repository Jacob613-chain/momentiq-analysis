import { useState, useEffect } from 'react';
import { fetchCreators } from '../services/api';
import { Users, Search, X, ChevronLeft, ChevronRight, ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';
import { format } from 'date-fns';
import { SkeletonCreatorCard, SkeletonSearchBar, SkeletonStats } from '../components/Skeleton';

function CreatorsPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredCreators, setFilteredCreators] = useState([]);
  const [limit, setLimit] = useState(50);
  const [offset, setOffset] = useState(0);
  const [sortField, setSortField] = useState(null); // 'products_substituted' or 'gmv_generated'
  const [sortDirection, setSortDirection] = useState('desc'); // 'asc' or 'desc'

  const loadCreators = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetchCreators();
      if (response.success && response.data) {
        setData(response.data);
        setFilteredCreators(response.data.creators || []);
      } else {
        setError('Failed to load creators data');
      }
    } catch (err) {
      console.error('Error loading creators:', err);
      setError('Failed to load creators. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCreators();
  }, []);

  // Filter and sort creators based on search query and sort settings
  useEffect(() => {
    if (!data?.creators) return;

    let filtered = data.creators;

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter((creator) => {
        return (
          creator.creator_username?.toLowerCase().includes(query) ||
          creator.discord_username?.toLowerCase().includes(query) ||
          creator.creator_user_id?.toLowerCase().includes(query) ||
          creator.discord_id?.toLowerCase().includes(query)
        );
      });
    }

    // Apply sorting
    if (sortField) {
      filtered = [...filtered].sort((a, b) => {
        const aValue = a[sortField] || 0;
        const bValue = b[sortField] || 0;

        if (sortDirection === 'asc') {
          return aValue - bValue;
        } else {
          return bValue - aValue;
        }
      });
    }

    setFilteredCreators(filtered);
    setOffset(0); // Reset to first page when filter/sort changes
  }, [searchQuery, data, sortField, sortDirection]);

  const handleClearSearch = () => {
    setSearchQuery('');
  };

  const handleSort = (field) => {
    if (sortField === field) {
      // Toggle direction if same field
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      // Set new field with descending as default
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const handlePageChange = (newLimit, newOffset) => {
    setLimit(newLimit);
    setOffset(newOffset);
  };

  // Calculate pagination
  const totalCreators = filteredCreators.length;
  const totalPages = Math.ceil(totalCreators / limit);
  const currentPage = Math.floor(offset / limit) + 1;
  const paginatedCreators = filteredCreators.slice(offset, offset + limit);

  if (loading) {
    return (
      <div className="py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-[1600px] mx-auto space-y-6">
          <SkeletonSearchBar />
          <SkeletonStats />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {[...Array(6)].map((_, i) => (
              <SkeletonCreatorCard key={i} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-red-600 text-lg mb-4">{error}</p>
          <button
            onClick={loadCreators}
            className="px-6 py-3 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-all duration-300"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-[1600px] mx-auto">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <div className="flex items-center gap-2 sm:gap-3 mb-6">
            <div className="p-2 sm:p-3 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl shadow-lg">
              <Users className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Creators
              </h1>
              <p className="text-sm sm:text-base text-gray-600 mt-1">
                All registered creators in the system
              </p>
            </div>
          </div>

          {/* Search Bar */}
          <div className="relative mb-6">
            <Search className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
            <input
              type="text"
              placeholder="Search creators..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 sm:pl-12 pr-10 sm:pr-12 py-3 sm:py-4 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all duration-300 text-sm sm:text-lg"
            />
            {searchQuery && (
              <button
                onClick={handleClearSearch}
                className="absolute right-3 sm:right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            )}
          </div>

          {/* Stats Summary */}
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-6 shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Total Creators</p>
                <p className="text-3xl font-bold text-purple-600 mt-1">
                  {data?.total_count?.toLocaleString() || 0}
                </p>
              </div>
              {searchQuery && (
                <div>
                  <p className="text-gray-600 text-sm font-medium">Search Results</p>
                  <p className="text-3xl font-bold text-pink-600 mt-1">
                    {filteredCreators.length.toLocaleString()}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Creators Table */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-purple-600 to-pink-600 text-white">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold">No</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Discord Username</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">TikTok Username</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">TikTok User ID</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Discord ID</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold">
                    <button
                      onClick={() => handleSort('products_substituted')}
                      className="flex items-center justify-center gap-1 w-full hover:text-purple-200 transition-colors"
                    >
                      Products Substituted
                      {sortField === 'products_substituted' ? (
                        sortDirection === 'asc' ? <ArrowUp className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />
                      ) : (
                        <ArrowUpDown className="w-4 h-4 opacity-50" />
                      )}
                    </button>
                  </th>
                  <th className="px-6 py-4 text-center text-sm font-semibold">
                    <button
                      onClick={() => handleSort('gmv_generated')}
                      className="flex items-center justify-center gap-1 w-full hover:text-purple-200 transition-colors"
                    >
                      GMV Generated
                      {sortField === 'gmv_generated' ? (
                        sortDirection === 'asc' ? <ArrowUp className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />
                      ) : (
                        <ArrowUpDown className="w-4 h-4 opacity-50" />
                      )}
                    </button>
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Created At</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Updated At</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {paginatedCreators.length === 0 ? (
                  <tr>
                    <td colSpan="9" className="px-6 py-12 text-center text-gray-500">
                      {searchQuery ? 'No creators found matching your search' : 'No creators available'}
                    </td>
                  </tr>
                ) : (
                  paginatedCreators.map((creator, index) => (
                    <tr
                      key={creator.id}
                      className="hover:bg-purple-50 transition-colors duration-150"
                    >
                      <td className="px-6 py-4 text-sm text-gray-900 font-medium">
                        {offset + index + 1}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-indigo-600">
                            {creator.discord_username || 'N/A'}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-purple-600">
                            {creator.creator_username || 'N/A'}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700 font-mono">
                        {creator.creator_user_id || 'N/A'}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700 font-mono">
                        {creator.discord_id || 'N/A'}
                      </td>
                      <td className="px-6 py-4 text-sm text-center">
                        <span className="inline-flex items-center justify-center px-3 py-1 rounded-full text-sm font-semibold bg-blue-100 text-blue-800">
                          {creator.products_substituted?.toLocaleString() || 0}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-center">
                        <span className="inline-flex items-center justify-center px-3 py-1 rounded-full text-sm font-semibold bg-green-100 text-green-800">
                          ${(creator.gmv_generated || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {creator.created_at
                          ? format(new Date(creator.created_at), 'MMM dd, yyyy HH:mm')
                          : 'N/A'}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {creator.updated_at
                          ? format(new Date(creator.updated_at), 'MMM dd, yyyy HH:mm')
                          : 'N/A'}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          {totalCreators > 0 && (
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                {/* Items per page selector */}
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">Show:</span>
                  <select
                    value={limit}
                    onChange={(e) => handlePageChange(Number(e.target.value), 0)}
                    className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value={50}>50</option>
                    <option value={100}>100</option>
                    <option value={200}>200</option>
                  </select>
                  <span className="text-sm text-gray-600">per page</span>
                </div>

                {/* Page info and navigation */}
                <div className="flex items-center gap-4">
                  <span className="text-sm text-gray-600">
                    Showing {offset + 1} to {Math.min(offset + limit, totalCreators)} of {totalCreators.toLocaleString()} creators
                  </span>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handlePageChange(limit, Math.max(0, offset - limit))}
                      disabled={offset === 0}
                      className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-1"
                    >
                      <ChevronLeft className="w-4 h-4" />
                      Previous
                    </button>

                    <span className="text-sm text-gray-600">
                      Page {currentPage} of {totalPages}
                    </span>

                    <button
                      onClick={() => handlePageChange(limit, Math.min(totalCreators - limit, offset + limit))}
                      disabled={offset + limit >= totalCreators}
                      className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-1"
                    >
                      Next
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default CreatorsPage;

