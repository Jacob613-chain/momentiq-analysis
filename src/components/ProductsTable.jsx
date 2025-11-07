import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Image as ImageIcon, X } from 'lucide-react';

const ProductsTable = ({ products, pagination, onPageChange, loading }) => {
  const [hoveredName, setHoveredName] = useState(null);
  const [hoveredDescription, setHoveredDescription] = useState(null);
  const [imageModalOpen, setImageModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  const truncateText = (text, maxLength = 30) => {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  const stripHtmlTags = (html) => {
    if (!html) return '';
    const tmp = document.createElement('DIV');
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || '';
  };

  const handlePreviousPage = () => {
    if (pagination.has_previous) {
      const newOffset = Math.max(0, pagination.offset - pagination.limit);
      onPageChange(pagination.limit, newOffset);
    }
  };

  const handleNextPage = () => {
    if (pagination.has_next) {
      const newOffset = pagination.offset + pagination.limit;
      onPageChange(pagination.limit, newOffset);
    }
  };

  const handlePageSizeChange = (newLimit) => {
    onPageChange(newLimit, 0);
  };

  const currentPage = Math.floor(pagination.offset / pagination.limit) + 1;
  const totalPages = Math.ceil(pagination.total / pagination.limit);

  const handleImageClick = (imageUrl, productName) => {
    setSelectedImage({ url: imageUrl, name: productName });
    setImageModalOpen(true);
  };

  const closeImageModal = () => {
    setImageModalOpen(false);
    setTimeout(() => setSelectedImage(null), 300); // Clear after animation
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden relative">
      {/* Table Controls */}
      <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">
              Showing <span className="font-semibold">{pagination.offset + 1}</span> to{' '}
              <span className="font-semibold">
                {Math.min(pagination.offset + pagination.limit, pagination.total)}
              </span>{' '}
              of <span className="font-semibold">{pagination.total}</span> products
            </span>
          </div>
          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-600">Items per page:</label>
            <select
              value={pagination.limit}
              onChange={(e) => handlePageSizeChange(Number(e.target.value))}
              className="px-3 py-1 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value={50}>50</option>
              <option value={100}>100</option>
              <option value={200}>200</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">No</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">Product ID</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">Campaign ID</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">Name</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">Shop Name</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">Image</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">Description</th>
              <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider">Low Price</th>
              <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider">High Price</th>
              <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider">Inventory</th>
              <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider">Sales</th>
              <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider">Open Comm %</th>
              <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider">Partner Comm %</th>
              <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider">Calc Comm %</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {loading ? (
              <tr>
                <td colSpan="14" className="px-4 py-8 text-center">
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    <span className="ml-3 text-gray-600">Loading products...</span>
                  </div>
                </td>
              </tr>
            ) : products.length === 0 ? (
              <tr>
                <td colSpan="14" className="px-4 py-8 text-center text-gray-500">
                  No products found
                </td>
              </tr>
            ) : (
              products.map((product, index) => (
                <tr
                  key={product.id}
                  className="hover:bg-blue-50 transition-colors duration-150"
                >
                  <td className="px-4 py-3 text-sm text-gray-700">
                    {pagination.offset + index + 1}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700 font-mono">
                    {product.product_id}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700 font-mono">
                    {product.campaign_id}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700 relative">
                    <div
                      className="cursor-help"
                      onMouseEnter={() => setHoveredName(product.id)}
                      onMouseLeave={() => setHoveredName(null)}
                    >
                      {truncateText(product.name, 40)}
                      {hoveredName === product.id && (
                        <div className="absolute z-50 left-0 top-full mt-2 p-3 bg-gray-900 text-white text-xs rounded-lg shadow-xl max-w-md">
                          {product.name}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700">
                    {product.shop_name}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <div className="cursor-pointer">
                      {product.main_image_url ? (
                        <img
                          src={product.main_image_url}
                          alt={product.name}
                          onClick={() => handleImageClick(product.main_image_url, product.name)}
                          className="w-12 h-12 object-cover rounded-lg border border-gray-300 hover:border-blue-500 hover:shadow-lg transition-all duration-200 hover:scale-110"
                        />
                      ) : (
                        <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
                          <ImageIcon className="w-6 h-6 text-gray-400" />
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700 relative">
                    <div
                      className="cursor-help"
                      onMouseEnter={() => setHoveredDescription(product.id)}
                      onMouseLeave={() => setHoveredDescription(null)}
                    >
                      {truncateText(stripHtmlTags(product.product_description), 30)}
                      {hoveredDescription === product.id && (
                        <div className="absolute z-50 left-0 top-full mt-2 p-3 bg-gray-900 text-white text-xs rounded-lg shadow-xl max-w-md max-h-64 overflow-y-auto">
                          {stripHtmlTags(product.product_description)}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700 text-right font-medium">
                    ${product.lowest_price_amount}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700 text-right font-medium">
                    ${product.highest_price_amount}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700 text-right">
                    {product.inventory.toLocaleString()}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700 text-right">
                    {product.product_sales.toLocaleString()}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700 text-right">
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      {product.open_collaboration_commission_rate}%
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700 text-right">
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {product.partner_commission_rate}%
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700 text-right">
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                      {product.calculated_commission_rate}%
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 border-t border-gray-200">
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-600">
            Page <span className="font-semibold">{currentPage}</span> of{' '}
            <span className="font-semibold">{totalPages}</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePreviousPage}
              disabled={!pagination.has_previous || loading}
              className="flex items-center gap-1 px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-150"
            >
              <ChevronLeft className="w-4 h-4" />
              Previous
            </button>
            <button
              onClick={handleNextPage}
              disabled={!pagination.has_next || loading}
              className="flex items-center gap-1 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-150"
            >
              Next
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Image Modal */}
      {imageModalOpen && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black bg-opacity-75 animate-fade-in"
          onClick={closeImageModal}
        >
          <div
            className="relative max-w-4xl max-h-[90vh] p-4 animate-scale-in"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={closeImageModal}
              className="absolute -top-2 -right-2 bg-white rounded-full p-2 shadow-lg hover:bg-gray-100 transition-colors duration-200 z-10"
            >
              <X className="w-6 h-6 text-gray-700" />
            </button>
            {selectedImage && (
              <div className="bg-white rounded-xl shadow-2xl overflow-hidden">
                <img
                  src={selectedImage.url}
                  alt={selectedImage.name}
                  className="max-w-full max-h-[80vh] object-contain"
                />
                <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50">
                  <p className="text-sm text-gray-700 font-medium">{selectedImage.name}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductsTable;

