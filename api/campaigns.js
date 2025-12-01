// Vercel Serverless Function to proxy campaigns API requests and bypass CORS
export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  // Handle preflight request
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Only allow GET requests
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { 
      limit = 50, 
      offset = 0, 
      campaign_type = 'all'
    } = req.query;

    // Build query parameters
    const params = new URLSearchParams();

    // Add pagination parameters
    params.append('limit', limit.toString());
    params.append('offset', offset.toString());

    // Add campaign_type filter if provided
    if (campaign_type && campaign_type !== 'all') {
      params.append('campaign_type', campaign_type);
    }

    // Use the /all/ endpoint which supports campaign_type filter
    const apiUrl = `https://api.bemomentiq.com/v1/tiktok/partner/campaigns/all/?${params.toString()}`;
    
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`API responded with status: ${response.status}`);
    }

    const data = await response.json();

    // Return the data
    return res.status(200).json(data);
  } catch (error) {
    console.error('Proxy error:', error);
    return res.status(500).json({ 
      error: 'Failed to fetch campaigns data from API',
      message: error.message 
    });
  }
}

