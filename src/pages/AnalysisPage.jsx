import { useState, useEffect } from 'react';
import { RefreshCw, TrendingUp } from 'lucide-react';
import MetricsCards from '../components/MetricsCards';
import MetricsCharts from '../components/MetricsCharts';
import { fetchHistoricalMetrics } from '../services/api';

const AnalysisPage = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      // Always use fixed start date 2025-11-03
      const fixedStartDate = '2025-11-03';
      const response = await fetchHistoricalMetrics(fixedStartDate);

      // Calculate total_days based on end_date - 2025-11-03
      if (response.data && response.data.period) {
        const startDate = new Date(fixedStartDate);
        const endDate = new Date(response.data.period.end_date);
        const diffTime = Math.abs(endDate - startDate);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // +1 to include both start and end dates

        response.data.period.total_days = diffDays;
      }

      setData(response.data);
    } catch (err) {
      setError('Failed to load metrics data. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const latestMetrics = data?.metrics?.[data.metrics.length - 1];

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 animate-fade-in">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <div>
              <h1 className="text-4xl font-bold text-gray-800 mb-2 flex items-center gap-3">
                <TrendingUp className="w-10 h-10 text-blue-600" />
                Analytics Dashboard
              </h1>
              <p className="text-gray-600">
                Track your performance metrics and growth over time
              </p>
            </div>
            <button
              onClick={loadData}
              disabled={loading}
              className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
          </div>

          {/* Period Info */}
          {data?.period && (
            <div className="mt-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-4 border border-blue-100">
              <div className="flex items-center gap-6 text-sm">
                <div>
                  <span className="text-gray-600">Period: </span>
                  <span className="font-semibold text-gray-800">
                    2025-11-03 to {data.period.end_date}
                  </span>
                </div>
                <div>
                  <span className="text-gray-600">Total Days: </span>
                  <span className="font-semibold text-gray-800">
                    {data.period.total_days}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-xl mb-8 animate-fade-in">
            <p className="font-medium">{error}</p>
          </div>
        )}

        {/* Loading State */}
        {loading && !data && (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <RefreshCw className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
              <p className="text-gray-600 text-lg">Loading metrics data...</p>
            </div>
          </div>
        )}

        {/* Content */}
        {!loading && data && (
          <>
            {/* Metrics Cards */}
            <MetricsCards latestMetrics={latestMetrics} />

            {/* Charts */}
            <MetricsCharts metrics={data.metrics} />

            {/* Summary Section */}
            {data.summary && (
              <div className="mt-8 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl p-6 text-white shadow-xl animate-fade-in">
                <h3 className="text-2xl font-bold mb-4">Period Summary</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                    <p className="text-sm opacity-90 mb-1">Creators Change</p>
                    <p className="text-2xl font-bold">
                      {data.summary.total_creators_change > 0 ? '+' : ''}
                      {data.summary.total_creators_change}
                    </p>
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                    <p className="text-sm opacity-90 mb-1">Products Change</p>
                    <p className="text-2xl font-bold">
                      {data.summary.total_products_substituted_change > 0 ? '+' : ''}
                      {data.summary.total_products_substituted_change}
                    </p>
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                    <p className="text-sm opacity-90 mb-1">System Products Change</p>
                    <p className="text-2xl font-bold">
                      {data.summary.total_products_in_system_change > 0 ? '+' : ''}
                      {data.summary.total_products_in_system_change}
                    </p>
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                    <p className="text-sm opacity-90 mb-1">GMV Change</p>
                    <p className="text-2xl font-bold">
                      ${data.summary.gmv_change.toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default AnalysisPage;

