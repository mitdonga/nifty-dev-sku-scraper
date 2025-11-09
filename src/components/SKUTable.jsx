import { useState, useEffect } from 'react';
import { fetchSKUData } from '../services/api';
import { formatDate } from '../utils/dateFormatter';
import SKUDetailDrawer from './SKUDetailDrawer';

function SKUTable() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedSKU, setSelectedSKU] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const skuData = await fetchSKUData();
      setData(skuData);
    } catch (err) {
      setError(err.message || 'Failed to load data');
      console.error('Error loading data:', err);
    } finally {
      setLoading(false);
    }
  };

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

      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
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

