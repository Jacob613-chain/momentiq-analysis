import { useState, useEffect } from 'react';
import { Megaphone } from 'lucide-react';
import { fetchCampaigns } from '../services/api';
import { SkeletonStats, SkeletonTable } from '../components/Skeleton';

const CAMPAIGN_TYPES = [
  { id: 'all', label: 'All', color: 'bg-gray-600 hover:bg-gray-700' },
  { id: 'MY_CAMPAIGNS', label: 'My Campaigns', color: 'bg-blue-600 hover:bg-blue-700' },
  { id: 'GS_SELLING_CAMPAIGNS', label: 'GS Seller Campaigns', color: 'bg-purple-600 hover:bg-purple-700' },
  { id: 'SELLER_CAMPAIGNS', label: 'Seller Campaigns', color: 'bg-green-600 hover:bg-green-700' },
  { id: 'EXCLUSIVE_TIKTOK_SHOP', label: 'Exclusive TikTok Shop', color: 'bg-pink-600 hover:bg-pink-700' },
];

const CampaignsPage = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedType, setSelectedType] = useState('all');

  const loadData = async (campaignType = selectedType) => {
    setLoading(true);
    setError(null);
    try {
      // Fetch all campaigns without limit (use max limit of 1000)
      const response = await fetchCampaigns(1000, 0, campaignType);
      setData(response.data);
    } catch (err) {
      setError('Failed to load campaigns. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Load data when campaign type changes
  useEffect(() => {
    loadData(selectedType);
  }, [selectedType]);

  const handleTypeChange = (type) => {
    setSelectedType(type);
  };

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-[1600px] mx-auto">
        {/* Header */}
        <div className="mb-6 sm:mb-8 animate-fade-in">
          <div className="mb-6">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800 mb-2 flex items-center gap-2 sm:gap-3">
              <Megaphone className="w-8 h-8 sm:w-10 sm:h-10 text-orange-600" />
              Campaigns
            </h1>
            <p className="text-sm sm:text-base text-gray-600">
              Browse all TikTok partner campaigns by type
            </p>
          </div>

          {/* Campaign Type Filter Buttons */}
          <div className="mb-6">
            <h3 className="text-sm font-medium text-gray-700 mb-3">Filter by Campaign Type:</h3>
            <div className="flex flex-wrap gap-2 sm:gap-3">
              {CAMPAIGN_TYPES.map((type) => (
                <button
                  key={type.id}
                  onClick={() => handleTypeChange(type.id)}
                  disabled={loading}
                  className={`px-4 sm:px-6 py-2 sm:py-2.5 rounded-xl text-white font-medium transition-all duration-300 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base ${
                    selectedType === type.id
                      ? `${type.color} ring-4 ring-offset-2 ring-opacity-50`
                      : `${type.color} opacity-70`
                  }`}
                >
                  {type.label}
                </button>
              ))}
            </div>
          </div>
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
            <SkeletonStats />
            <SkeletonTable />
          </div>
        )}

        {/* Content */}
        {!loading && data && (
          <>
            {/* Stats Summary */}
            {data.campaigns && (
              <div className="bg-gradient-to-r from-orange-50 to-pink-50 rounded-xl p-4 sm:p-6 border border-orange-100 mb-6">
                <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6 text-sm">
                  <div className="flex items-center gap-2">
                    <span className="text-gray-600">Total Campaigns:</span>
                    <span className="font-semibold text-gray-800">
                      {data.campaigns.length.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-600">Total Approved Products:</span>
                    <span className="font-semibold text-blue-600">
                      {data.campaigns.reduce((sum, campaign) => sum + (campaign.product_count || 0), 0).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-600">Campaign Type:</span>
                    <span className="font-semibold text-orange-600">
                      {CAMPAIGN_TYPES.find(t => t.id === selectedType)?.label || 'All'}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Campaigns Table */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden mb-6">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gradient-to-r from-orange-50 to-pink-50 border-b border-gray-200">
                    <tr>
                      <th className="px-4 py-3 text-center text-xs font-medium text-gray-700 uppercase tracking-wider w-16">
                        No.
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                        Campaign ID
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                        Campaign Name
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                        Campaign Type
                      </th>
                      <th className="px-4 py-3 text-center text-xs font-medium text-gray-700 uppercase tracking-wider">
                        Total Approved Products
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                        Start Date
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                        End Date
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {data.campaigns && data.campaigns.length > 0 ? (
                      data.campaigns.map((campaign, index) => (
                        <tr key={campaign.campaign_id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-4 py-3 text-sm text-gray-600 text-center font-medium">
                            {index + 1}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-900 font-mono">
                            {campaign.campaign_id}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-900 font-medium">
                            {campaign.name || 'N/A'}
                          </td>
                          <td className="px-4 py-3 text-sm">
                            <span className="px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                              {campaign.campaign_type || 'N/A'}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-sm text-center">
                            <span className="inline-flex items-center justify-center px-3 py-1 rounded-full text-sm font-semibold bg-blue-100 text-blue-800">
                              {campaign.product_count?.toLocaleString() || 0}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-600">
                            {campaign.campaign_start_date || 'N/A'}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-600">
                            {campaign.campaign_end_date || 'N/A'}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="7" className="px-4 py-8 text-center text-gray-500">
                          No campaigns found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default CampaignsPage;

