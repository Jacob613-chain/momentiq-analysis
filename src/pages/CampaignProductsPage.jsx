import { useState, useEffect } from 'react';
import { Package, RefreshCw, Search, X, Download } from 'lucide-react';
import ProductsTable from '../components/ProductsTable';
import { fetchCampaignProducts } from '../services/api';

const CampaignProductsPage = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [limit, setLimit] = useState(50);
  const [offset, setOffset] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [downloading, setDownloading] = useState(false);

  const loadData = async (newLimit = limit, newOffset = offset) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetchCampaignProducts(newLimit, newOffset);
      setData(response.data);
      setFilteredProducts(response.data.products || []);
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

  // Filter products based on search query
  useEffect(() => {
    if (!data?.products) return;

    if (!searchQuery.trim()) {
      setFilteredProducts(data.products);
      return;
    }

    const query = searchQuery.toLowerCase();
    const filtered = data.products.filter((product) => {
      return (
        product.name?.toLowerCase().includes(query) ||
        product.product_id?.toLowerCase().includes(query) ||
        product.campaign_id?.toLowerCase().includes(query) ||
        product.shop_name?.toLowerCase().includes(query) ||
        product.product_description?.toLowerCase().includes(query)
      );
    });

    setFilteredProducts(filtered);
  }, [searchQuery, data]);

  const handlePageChange = (newLimit, newOffset) => {
    setSearchQuery(''); // Clear search when changing pages
    loadData(newLimit, newOffset);
  };

  const handleRefresh = () => {
    setSearchQuery(''); // Clear search on refresh
    loadData(limit, offset);
  };

  const handleClearSearch = () => {
    setSearchQuery('');
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
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        productsToExport = allProducts.filter((product) => {
          return (
            product.name?.toLowerCase().includes(query) ||
            product.product_id?.toLowerCase().includes(query) ||
            product.campaign_id?.toLowerCase().includes(query) ||
            product.shop_name?.toLowerCase().includes(query) ||
            product.product_description?.toLowerCase().includes(query)
          );
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
        escapeCSV(product.product_id),
        escapeCSV(product.campaign_id),
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

      const filename = searchQuery
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
        <div className="mb-8 animate-fade-in">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <div>
              <h1 className="text-4xl font-bold text-gray-800 mb-2 flex items-center gap-3">
                <Package className="w-10 h-10 text-purple-600" />
                TAP Campaign Products
              </h1>
              <p className="text-gray-600">
                Browse all products from partners joined on TAP campaign
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleDownloadCSV}
                disabled={loading || downloading || !data?.pagination}
                className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                title={data?.pagination ? `Download all ${data.pagination.total.toLocaleString()} products` : 'No products available'}
              >
                <Download className={`w-5 h-5 ${downloading ? 'animate-bounce' : ''}`} />
                {downloading ? 'Downloading All Products...' : `Download All CSV (${data?.pagination?.total.toLocaleString() || 0})`}
              </button>
              <button
                onClick={handleRefresh}
                disabled={loading}
                className="flex items-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </button>
            </div>
          </div>

          {/* Search Bar */}
          <div className="mb-6">
            <div className="relative max-w-2xl">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search className="w-5 h-5 text-gray-400" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by product name, ID, campaign ID, shop name, or description..."
                className="w-full pl-12 pr-12 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 shadow-sm hover:shadow-md"
              />
              {searchQuery && (
                <button
                  onClick={handleClearSearch}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 transition-colors duration-200"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>
            {searchQuery && (
              <div className="mt-2 text-sm text-gray-600">
                Found <span className="font-semibold text-purple-600">{filteredProducts.length}</span> product(s) matching "{searchQuery}"
              </div>
            )}
          </div>

          {/* Stats Summary */}
          {data?.pagination && (
            <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl p-4 border border-purple-100">
              <div className="flex items-center gap-6 text-sm">
                <div>
                  <span className="text-gray-600">Total Products: </span>
                  <span className="font-semibold text-gray-800">
                    {data.pagination.total.toLocaleString()}
                  </span>
                </div>
                <div>
                  <span className="text-gray-600">Current Page: </span>
                  <span className="font-semibold text-gray-800">
                    {Math.floor(data.pagination.offset / data.pagination.limit) + 1} of{' '}
                    {Math.ceil(data.pagination.total / data.pagination.limit)}
                  </span>
                </div>
                <div>
                  <span className="text-gray-600">Showing: </span>
                  <span className="font-semibold text-gray-800">
                    {searchQuery ? filteredProducts.length : data.pagination.returned} products
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
              <RefreshCw className="w-12 h-12 text-purple-600 animate-spin mx-auto mb-4" />
              <p className="text-gray-600 text-lg">Loading campaign products...</p>
            </div>
          </div>
        )}

        {/* Products Table */}
        {data && (
          <ProductsTable
            products={filteredProducts}
            pagination={{
              ...data.pagination,
              returned: filteredProducts.length,
              total: searchQuery ? filteredProducts.length : data.pagination.total
            }}
            onPageChange={handlePageChange}
            loading={loading}
          />
        )}
      </div>
    </div>
  );
};

export default CampaignProductsPage;

