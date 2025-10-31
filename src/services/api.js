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

