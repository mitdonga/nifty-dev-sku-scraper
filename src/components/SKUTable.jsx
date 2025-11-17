import { useState, useEffect, useRef } from 'react';
import { fetchSKUData } from '../services/api';
import { formatDate } from '../utils/dateFormatter';
import SKUDetailDrawer from './SKUDetailDrawer';

const STATUS_OPTIONS = [
  { value: '', label: 'All' },
  { value: 'scraping_done', label: 'Scraping Done' },
  { value: 'category_not_match', label: 'Category Not Match' },
  { value: 'no_result', label: 'No Result' },
  { value: 'firecrawl_scrapper_error', label: 'Firecrawl Scrapper Error' },
];

function SKUTable() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedSKU, setSelectedSKU] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState('');
  const [skuSearch, setSkuSearch] = useState('');
  const debounceTimerRef = useRef(null);
  const isInitialMount = useRef(true);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const filters = {};
      if (statusFilter) {
        filters.status = statusFilter;
      }
      if (skuSearch.trim()) {
        filters.sku = skuSearch.trim();
      }
      const skuData = await fetchSKUData(filters);
      setData(skuData);
    } catch (err) {
      setError(err.message || 'Failed to load data');
      console.error('Error loading data:', err);
    } finally {
      setLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      loadData();
    }
  }, []);

  // Status filter changes - call immediately
  useEffect(() => {
    if (!isInitialMount.current) {
      // Clear SKU search debounce timer when status changes
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
      loadData();
    }
  }, [statusFilter]);

  // Debounce SKU search - wait 5 seconds after user input
  useEffect(() => {
    if (!isInitialMount.current) {
      // Clear existing timer
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }

      // Set new timer for 5 seconds
      debounceTimerRef.current = setTimeout(() => {
        loadData();
      }, 3000);
    }

    // Cleanup on unmount or when skuSearch changes
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [skuSearch]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading SKU data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md">
          <h2 className="text-red-800 font-semibold mb-2">Error Loading Data</h2>
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={loadData}
            className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-200"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-gray-600 text-lg">No SKU data available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-full px-1 py-8">
      <div className="mb-6 flex justify-between items-center px-2">
        <h1 className="text-3xl font-bold text-gray-800">SKU Data</h1>
        <button
          onClick={loadData}
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-200"
        >
          Refresh
        </button>
      </div>

      {/* Filters Section */}
      <div className="mb-6 px-2 flex flex-wrap gap-4 items-end">
        {/* Status Filter */}
        <div className="flex-1 min-w-[200px]">
          <label htmlFor="status-filter" className="block text-sm font-medium text-gray-700 mb-2">
            Status
          </label>
          <select
            id="status-filter"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          >
            {STATUS_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* SKU Search */}
        <div className="flex-1 min-w-[200px]">
          <label htmlFor="sku-search" className="block text-sm font-medium text-gray-700 mb-2">
            SKU Search
          </label>
          <input
            id="sku-search"
            type="text"
            value={skuSearch}
            onChange={(e) => setSkuSearch(e.target.value)}
            placeholder="Search by SKU..."
            className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ID
                </th>
                <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  SKU
                </th>
                <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Sub Category
                </th>
                <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Image Processing Status
                </th>
                <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Updated At
                </th>
                <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Filtered Image Count
                </th>
                <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Search Result Count
                </th>
                <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Custom Attributes Count
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {data.map((item) => (
                <tr
                  key={item.id}
                  className="hover:bg-gray-50 cursor-pointer"
                  onClick={() => {
                    setSelectedSKU(item);
                    setIsDrawerOpen(true);
                  }}
                >
                  <td className="px-2 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{item.id || 'N/A'}</div>
                  </td>
                  <td className="px-2 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{item.sku || 'N/A'}</div>
                  </td>
                  <td className="px-2 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{item.category || 'N/A'}</div>
                  </td>
                  <td className="px-2 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{item.sub_category || 'N/A'}</div>
                  </td>
                  <td className="px-2 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      item.status === 'scraping_done' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {item.status || 'N/A'}
                    </span>
                  </td>
                  <td className="px-2 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      item.image_processing_status === 'done' 
                        ? 'bg-blue-100 text-blue-800' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {item.image_processing_status || 'N/A'}
                    </span>
                  </td>
                  <td className="px-2 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{formatDate(item.updated_at)}</div>
                  </td>
                  <td className="px-2 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {item.image_urls ? item.image_urls.length : 0}
                    </div>
                  </td>
                  <td className="px-2 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {item.search_result ? item.search_result.length : 0}
                    </div>
                  </td>
                  <td className="px-2 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {item.custom_attributes ? Object.keys(item.custom_attributes).length : 0}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-4 text-sm text-gray-600 px-2">
        Showing {data.length} SKU{data.length !== 1 ? 's' : ''}
      </div>

      {/* SKU Detail Drawer */}
      <SKUDetailDrawer
        isOpen={isDrawerOpen}
        onClose={() => {
          setIsDrawerOpen(false);
          setSelectedSKU(null);
        }}
        skuData={selectedSKU}
      />
    </div>
  );
}

export default SKUTable;

