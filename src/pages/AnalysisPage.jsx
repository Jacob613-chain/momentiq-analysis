import { useState, useEffect } from 'react';
import { TrendingUp } from 'lucide-react';
import MetricsCards from '../components/MetricsCards';
import MetricsCharts from '../components/MetricsCharts';
import { fetchHistoricalMetrics } from '../services/api';
import { SkeletonCard, SkeletonChart } from '../components/Skeleton';

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
        <div className="mb-6 sm:mb-8 animate-fade-in">
          <div className="mb-6">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800 mb-2 flex items-center gap-2 sm:gap-3">
              <TrendingUp className="w-8 h-8 sm:w-10 sm:h-10 text-blue-600" />
              Analytics Dashboard
            </h1>
            <p className="text-sm sm:text-base text-gray-600">
              Track your performance metrics and growth over time
            </p>
          </div>

          {/* Period Info */}
          {data?.period && (
            <div className="mt-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-4 sm:p-6 border border-blue-100">
              <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6 text-sm">
                <div className="flex items-center gap-2">
                  <span className="text-gray-600">Period:</span>
                  <span className="font-semibold text-gray-800">
                    2025-11-03 to {data.period.end_date}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-gray-600">Total Days:</span>
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
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {[...Array(4)].map((_, i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
            <SkeletonChart />
            <SkeletonChart />
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

