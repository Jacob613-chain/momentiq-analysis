import { useState, useEffect } from 'react';
import { fetchCreators } from '../services/api';
import { Users, RefreshCw, Search, X } from 'lucide-react';
import { format } from 'date-fns';

function CreatorsPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredCreators, setFilteredCreators] = useState([]);

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

  // Filter creators based on search query
  useEffect(() => {
    if (!data?.creators) return;

    if (!searchQuery.trim()) {
      setFilteredCreators(data.creators);
      return;
    }

    const query = searchQuery.toLowerCase();
    const filtered = data.creators.filter((creator) => {
      return (
        creator.creator_username?.toLowerCase().includes(query) ||
        creator.discord_username?.toLowerCase().includes(query) ||
        creator.creator_user_id?.toLowerCase().includes(query) ||
        creator.discord_id?.toLowerCase().includes(query) ||
        creator.region?.toLowerCase().includes(query)
      );
    });
    setFilteredCreators(filtered);
  }, [searchQuery, data]);

  const handleRefresh = () => {
    setSearchQuery('');
    loadCreators();
  };

  const handleClearSearch = () => {
    setSearchQuery('');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <RefreshCw className="w-12 h-12 text-purple-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600 text-lg">Loading creators...</p>
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
            onClick={handleRefresh}
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
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl shadow-lg">
                <Users className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  Creators
                </h1>
                <p className="text-gray-600 mt-1">
                  All registered creators in the system
                </p>
              </div>
            </div>
            <button
              onClick={handleRefresh}
              disabled={loading}
              className="flex items-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
          </div>

          {/* Search Bar */}
          <div className="relative mb-6">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by Discord username, TikTok username, user ID, Discord ID, or region..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-12 py-4 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all duration-300 text-lg"
            />
            {searchQuery && (
              <button
                onClick={handleClearSearch}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-5 h-5" />
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
                  <th className="px-6 py-4 text-left text-sm font-semibold">Region</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Created At</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Updated At</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredCreators.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="px-6 py-12 text-center text-gray-500">
                      {searchQuery ? 'No creators found matching your search' : 'No creators available'}
                    </td>
                  </tr>
                ) : (
                  filteredCreators.map((creator, index) => (
                    <tr
                      key={creator.id}
                      className="hover:bg-purple-50 transition-colors duration-150"
                    >
                      <td className="px-6 py-4 text-sm text-gray-900 font-medium">
                        {index + 1}
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
                      <td className="px-6 py-4 text-sm">
                        <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium uppercase">
                          {creator.region || 'N/A'}
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
        </div>
      </div>
    </div>
  );
}

export default CreatorsPage;

