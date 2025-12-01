import { useState, useEffect } from 'react';
import { Package, Search, X, Download } from 'lucide-react';
import ProductsTable from '../components/ProductsTable';
import { fetchCampaignProducts } from '../services/api';
import { SkeletonSearchBar, SkeletonStats, SkeletonTable } from '../components/Skeleton';

const CampaignProductsPage = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [limit, setLimit] = useState(50);
  const [offset, setOffset] = useState(0);
  const [searchProductId, setSearchProductId] = useState('');
  const [searchCampaignId, setSearchCampaignId] = useState('');
  const [searchProductName, setSearchProductName] = useState('');
  const [downloading, setDownloading] = useState(false);

  const loadData = async (newLimit = limit, newOffset = offset, searchFilters = {}) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetchCampaignProducts(newLimit, newOffset, searchFilters);
      setData(response.data);
      setLimit(newLimit);
      setOffset(newOffset);
    } catch (err) {
      setError('Failed to load campaign products. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Perform API-side search with all supported parameters
  useEffect(() => {
    const performSearch = async () => {
      // Build search filters object
      const searchFilters = {};
      if (searchProductId.trim()) searchFilters.product_id = searchProductId.trim();
      if (searchCampaignId.trim()) searchFilters.campaign_id = searchCampaignId.trim();
      if (searchProductName.trim()) searchFilters.product_name = searchProductName.trim();

      // Load data with search filters (API handles everything server-side)
      await loadData(limit, 0, searchFilters); // Reset to first page when searching
    };

    // Debounce search to avoid too many API calls
    const timeoutId = setTimeout(() => {
      performSearch();
    }, 500); // Wait 500ms after user stops typing

    return () => clearTimeout(timeoutId);
  }, [searchProductId, searchCampaignId, searchProductName]);

  const handlePageChange = (newLimit, newOffset) => {
    // Always maintain search filters when paginating
    const searchFilters = {};
    if (searchProductId.trim()) searchFilters.product_id = searchProductId.trim();
    if (searchCampaignId.trim()) searchFilters.campaign_id = searchCampaignId.trim();
    if (searchProductName.trim()) searchFilters.product_name = searchProductName.trim();

    loadData(newLimit, newOffset, searchFilters);
  };

  const handleClearSearch = () => {
    setSearchProductId('');
    setSearchCampaignId('');
    setSearchProductName('');
  };

  const stripHtmlTags = (html) => {
    if (!html) return '';
    const tmp = document.createElement('DIV');
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || '';
  };

  const escapeCSV = (value) => {
    if (value === null || value === undefined) return '';
    const stringValue = String(value);
    // Escape double quotes and wrap in quotes if contains comma, newline, or quote
    if (stringValue.includes(',') || stringValue.includes('\n') || stringValue.includes('"')) {
      return `"${stringValue.replace(/"/g, '""')}"`;
    }
    return stringValue;
  };

  // Special function to format IDs as text to prevent Excel scientific notation
  const formatIDForCSV = (value) => {
    if (value === null || value === undefined) return '';
    // Use ="value" format to force Excel to treat as text and preserve full number
    return `="${String(value)}"`;
  };

  const handleDownloadCSV = async () => {
    if (!data?.pagination) {
      alert('No products to download');
      return;
    }

    setDownloading(true);

    try {
      // Fetch ALL products from the API
      const totalProducts = data.pagination.total;
      const allProducts = [];

      // Fetch in batches of 1000 (or max allowed by API)
      const batchSize = 1000;
      const totalBatches = Math.ceil(totalProducts / batchSize);

      for (let i = 0; i < totalBatches; i++) {
        const response = await fetchCampaignProducts(batchSize, i * batchSize);
        if (response.data && response.data.products) {
          allProducts.push(...response.data.products);
        }
      }

      // Apply search filter if active
      let productsToExport = allProducts;
      const hasSearch = searchProductId.trim() || searchCampaignId.trim() || searchProductName.trim();

      if (hasSearch) {
        productsToExport = allProducts.filter((product) => {
          const productIdMatch = !searchProductId.trim() ||
            product.product_id?.toLowerCase().includes(searchProductId.toLowerCase());

          const campaignIdMatch = !searchCampaignId.trim() ||
            product.campaign_id?.toLowerCase().includes(searchCampaignId.toLowerCase());

          const productNameMatch = !searchProductName.trim() ||
            product.name?.toLowerCase().includes(searchProductName.toLowerCase());

          return productIdMatch && campaignIdMatch && productNameMatch;
        });
      }

      if (productsToExport.length === 0) {
        alert('No products to download');
        setDownloading(false);
        return;
      }

      // CSV Headers
      const headers = [
        'No',
        'Product ID',
        'Campaign ID',
        'Name',
        'Shop Name',
        'Main Image URL',
        'Product Description',
        'Lowest Price',
        'Highest Price',
        'Inventory',
        'Product Sales',
        'Open Collaboration Commission Rate (%)',
        'Partner Commission Rate (%)',
        'Calculated Commission Rate (%)'
      ];

      // CSV Rows
      const rows = productsToExport.map((product, index) => [
        index + 1,
        formatIDForCSV(product.product_id), // Format as text to prevent scientific notation
        formatIDForCSV(product.campaign_id), // Format as text to prevent scientific notation
        escapeCSV(product.name),
        escapeCSV(product.shop_name),
        escapeCSV(product.main_image_url),
        escapeCSV(stripHtmlTags(product.product_description)),
        escapeCSV(product.lowest_price_amount),
        escapeCSV(product.highest_price_amount),
        escapeCSV(product.inventory),
        escapeCSV(product.product_sales),
        escapeCSV(product.open_collaboration_commission_rate),
        escapeCSV(product.partner_commission_rate),
        escapeCSV(product.calculated_commission_rate)
      ]);

      // Combine headers and rows
      const csvContent = [
        headers.join(','),
        ...rows.map(row => row.join(','))
      ].join('\n');

      // Create blob and download
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);

      const isFiltered = searchProductId || searchCampaignId || searchProductName;
      const filename = isFiltered
        ? `tap_campaign_products_filtered_${new Date().toISOString().split('T')[0]}.csv`
        : `tap_campaign_products_all_${new Date().toISOString().split('T')[0]}.csv`;

      link.setAttribute('href', url);
      link.setAttribute('download', filename);
      link.style.visibility = 'hidden';

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      URL.revokeObjectURL(url);

      // Show success message
      alert(`Successfully downloaded ${productsToExport.length} products!`);
    } catch (error) {
      console.error('Error downloading CSV:', error);
      alert('Failed to download CSV. Please try again.');
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-[1600px] mx-auto">
        {/* Header */}
        <div className="mb-6 sm:mb-8 animate-fade-in">
          <div className="flex flex-col gap-4 mb-6">
            <div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800 mb-2 flex items-center gap-2 sm:gap-3">
                <Package className="w-8 h-8 sm:w-10 sm:h-10 text-purple-600" />
                TAP Campaign Products
              </h1>
              <p className="text-sm sm:text-base text-gray-600">
                Browse all products from partners joined on TAP campaign
              </p>
            </div>
            <button
              onClick={handleDownloadCSV}
              disabled={loading || downloading || !data?.pagination}
              className="flex items-center justify-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base w-full sm:w-auto"
              title={data?.pagination ? `Download all ${data.pagination.total.toLocaleString()} products` : 'No products available'}
            >
              <Download className={`w-4 h-4 sm:w-5 sm:h-5 ${downloading ? 'animate-bounce' : ''}`} />
              <span className="hidden sm:inline">
                {downloading ? 'Downloading All Products...' : `Download All CSV (${data?.pagination?.total.toLocaleString() || 0})`}
              </span>
              <span className="sm:hidden">
                {downloading ? 'Downloading...' : 'Download CSV'}
              </span>
            </button>
          </div>

          {/* Search Filters */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <Search className="w-5 h-5 text-purple-600" />
              <h3 className="text-lg font-semibold text-gray-800">Search Filters</h3>
              {(searchProductId || searchCampaignId || searchProductName) && (
                <button
                  onClick={handleClearSearch}
                  className="ml-auto text-sm text-purple-600 hover:text-purple-700 font-medium flex items-center gap-1"
                >
                  <X className="w-4 h-4" />
                  Clear All
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Product ID Search */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Product ID
                </label>
                <input
                  type="text"
                  value={searchProductId}
                  onChange={(e) => setSearchProductId(e.target.value)}
                  placeholder="Enter product ID..."
                  disabled={loading}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                />
              </div>

              {/* Campaign ID Search */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Campaign ID
                </label>
                <input
                  type="text"
                  value={searchCampaignId}
                  onChange={(e) => setSearchCampaignId(e.target.value)}
                  placeholder="Enter campaign ID..."
                  disabled={loading}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                />
              </div>

              {/* Product Name Search */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Product Name
                </label>
                <input
                  type="text"
                  value={searchProductName}
                  onChange={(e) => setSearchProductName(e.target.value)}
                  placeholder="Enter product name..."
                  disabled={loading}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                />
              </div>
            </div>

            {/* Search Status Messages */}
            {(searchProductId || searchCampaignId || searchProductName) && data && (
              <div className="mt-3 text-sm text-gray-600">
                {loading ? (
                  <div className="flex items-center gap-2 text-purple-600">
                    <Search className="w-4 h-4 animate-pulse" />
                    Searching...
                  </div>
                ) : (
                  <div>
                    Found <span className="font-semibold text-purple-600">{data.pagination.total.toLocaleString()}</span> matching product(s)
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Stats Summary */}
          {data?.pagination && (
            <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl p-4 sm:p-6 border border-purple-100">
              <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6 text-sm">
                <div className="flex items-center gap-2">
                  <span className="text-gray-600">Total Products:</span>
                  <span className="font-semibold text-gray-800">
                    {data.pagination.total.toLocaleString()}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-gray-600">Current Page:</span>
                  <span className="font-semibold text-gray-800">
                    {Math.floor(data.pagination.offset / data.pagination.limit) + 1} of{' '}
                    {Math.ceil(data.pagination.total / data.pagination.limit)}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-gray-600">Showing:</span>
                  <span className="font-semibold text-gray-800">
                    {data.pagination.returned} products
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
            <SkeletonSearchBar />
            <SkeletonStats />
            <SkeletonTable />
          </div>
        )}

        {/* Products Table */}
        {data && (
          <ProductsTable
            products={data.products || []}
            pagination={data.pagination}
            onPageChange={handlePageChange}
            loading={loading}
          />
        )}
      </div>
    </div>
  );
};

export default CampaignProductsPage;

