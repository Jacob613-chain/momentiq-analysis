import axios from 'axios';

// Use Vercel serverless function as proxy to bypass CORS
// In production, this will be /api/metrics
// In development, you can use the full Vercel URL or run locally
const API_BASE_URL = '/api';

/**
 * Fetch historical TikTok metrics
 * @param {string} startDate - Start date in YYYY-MM-DD format
 * @returns {Promise} API response with metrics data
 */
export const fetchHistoricalMetrics = async (startDate) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/metrics`, {
      params: {
        start_date: startDate
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching historical metrics:', error);
    throw error;
  }
};

/**
 * Get date range for the last N days
 * @param {number} days - Number of days to go back
 * @returns {string} Date in YYYY-MM-DD format
 */
export const getDateDaysAgo = (days) => {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return date.toISOString().split('T')[0];
};

/**
 * Fetch campaign products with pagination and optional search filters
 * @param {number} limit - Number of products per page (default: 50)
 * @param {number} offset - Offset for pagination (default: 0)
 * @param {Object} searchFilters - Optional search filters { product_id, campaign_id, product_name }
 * @returns {Promise} API response with products data
 */
export const fetchCampaignProducts = async (limit = 50, offset = 0, searchFilters = {}) => {
  try {
    const params = {
      limit,
      offset
    };

    // Add search filters if provided
    if (searchFilters.product_id) params.product_id = searchFilters.product_id;
    if (searchFilters.campaign_id) params.campaign_id = searchFilters.campaign_id;
    if (searchFilters.product_name) params.product_name = searchFilters.product_name;

    const response = await axios.get(`${API_BASE_URL}/campaign-products`, {
      params
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching campaign products:', error);
    throw error;
  }
};

/**
 * Fetch all creators
 * @returns {Promise} API response with creators data
 */
export const fetchCreators = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/creators`);
    return response.data;
  } catch (error) {
    console.error('Error fetching creators:', error);
    throw error;
  }
};

/**
 * Fetch campaigns with pagination and optional campaign type filter
 * @param {number} limit - Number of campaigns per page (default: 50)
 * @param {number} offset - Offset for pagination (default: 0)
 * @param {string} campaignType - Campaign type filter (all, EXCLUSIVE_TIKTOK_SHOP, GS_SELLING_CAMPAIGNS, SELLER_CAMPAIGNS, MY_CAMPAIGNS)
 * @returns {Promise} API response with campaigns data
 */
export const fetchCampaigns = async (limit = 50, offset = 0, campaignType = 'all') => {
  try {
    const params = {
      limit,
      offset,
      campaign_type: campaignType
    };

    const response = await axios.get(`${API_BASE_URL}/campaigns`, {
      params
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching campaigns:', error);
    throw error;
  }
};
