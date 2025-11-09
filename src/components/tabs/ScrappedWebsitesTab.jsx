import { useState } from 'react';

function ScrappedWebsitesTab({ searchResults }) {
  const [openIndex, setOpenIndex] = useState(null);

  if (!searchResults || searchResults.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No scrapped websites available
      </div>
    );
  }

  const toggleAccordion = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  // Check if a string is an image URL
  const isImageUrl = (str) => {
    if (typeof str !== 'string') return false;
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg', '.bmp'];
    const lowerStr = str.toLowerCase();
    return (
      (str.startsWith('http://') || str.startsWith('https://')) &&
      imageExtensions.some(ext => lowerStr.includes(ext))
    );
  };

  // Render a value - if it's an image URL, make it clickable
  const renderValue = (value) => {
    if (typeof value === 'string' && isImageUrl(value)) {
      return (
        <a
          href={value}
          target="_blank"
          rel="noopener noreferrer"
          className="text-indigo-600 hover:text-indigo-800 hover:underline break-all"
        >
          {value}
        </a>
      );
    }
    return <span className="text-sm text-gray-900 whitespace-pre-wrap">{String(value)}</span>;
  };

  const renderProductInformation = (productInfo) => {
    if (!productInfo || typeof productInfo !== 'object') {
      return <p className="text-gray-500 text-sm">No product information available</p>;
    }

    return (
      <div className="space-y-3">
        {Object.entries(productInfo).map(([key, value]) => {
          if (value === null || value === undefined || value === '') return null;

          // Handle arrays
          if (Array.isArray(value)) {
            return (
              <div key={key} className="border-b border-gray-100 pb-2">
                <div className="flex">
                  <div className="w-1/3">
                    <span className="text-sm font-semibold text-gray-700">{key}</span>
                  </div>
                  <div className="w-2/3">
                    {value.length > 0 ? (
                      <div className="space-y-2">
                        {value.map((item, idx) => {
                          if (typeof item === 'object' && item !== null) {
                            return (
                              <div key={idx} className="bg-gray-50 p-3 rounded border border-gray-200">
                                {Object.entries(item).map(([subKey, subValue]) => (
                                  <div key={subKey} className="flex mb-1 last:mb-0">
                                    <span className="text-xs font-medium text-gray-600 w-1/3">{subKey}:</span>
                                    <span className="text-xs text-gray-900 w-2/3 break-all">
                                      {renderValue(subValue)}
                                    </span>
                                  </div>
                                ))}
                              </div>
                            );
                          }
                          return (
                            <div key={idx} className="text-sm text-gray-900 break-all">
                              {renderValue(item)}
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <p className="text-gray-500 text-sm">Empty array</p>
                    )}
                  </div>
                </div>
              </div>
            );
          }

          // Handle objects
          if (typeof value === 'object' && value !== null) {
            return (
              <div key={key} className="border-b border-gray-100 pb-2">
                <div className="flex">
                  <div className="w-1/3">
                    <span className="text-sm font-semibold text-gray-700">{key}</span>
                  </div>
                  <div className="w-2/3">
                    <div className="bg-gray-50 p-3 rounded border border-gray-200">
                      {Object.entries(value).map(([subKey, subValue]) => (
                        <div key={subKey} className="flex mb-1 last:mb-0">
                          <span className="text-xs font-medium text-gray-600 w-1/2">{subKey}:</span>
                          <span className="text-xs text-gray-900 w-1/2 break-all">
                            {renderValue(subValue)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            );
          }

          // Handle simple values
          return (
            <div key={key} className="border-b border-gray-100 pb-2">
              <div className="flex">
                <div className="w-1/3">
                  <span className="text-sm font-semibold text-gray-700">{key}</span>
                </div>
                <div className="w-2/3 break-all">
                  {renderValue(value)}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="space-y-4">
      {searchResults.map((result, index) => (
        <div key={index} className="border border-gray-200 rounded-lg overflow-hidden">
          {/* Accordion Header */}
          <button
            onClick={() => toggleAccordion(index)}
            className="w-full px-6 py-4 bg-gray-50 hover:bg-gray-100 transition-colors flex justify-between items-center text-left"
          >
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-semibold text-gray-800 truncate">{result.title || 'Untitled'}</h4>
              <a
                href={result.url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="text-xs text-indigo-600 hover:text-indigo-800 truncate block mt-1"
              >
                {result.url}
              </a>
            </div>
            <div className="ml-4 flex items-center">
              {result.response && (
                <div className="flex gap-2 mr-4">
                  {result.response['Category Match'] && (
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      result.response['Category Match']
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {result.response['Category Match'] ? 'Category Match' : 'No Match'}
                    </span>
                  )}
                  {result.response['Is Product Page'] && (
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      result.response['Is Product Page']
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {result.response['Is Product Page'] ? 'Product Page' : 'Not Product Page'}
                    </span>
                  )}
                  {result.response['SKU Match Result'] && (
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      result.response['SKU Match Result'] === 'full_match'
                        ? 'bg-green-100 text-green-800'
                        : result.response['SKU Match Result'] === 'partial_match'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {result.response['SKU Match Result']}
                    </span>
                  )}
                </div>
              )}
              <svg
                className={`w-5 h-5 text-gray-500 transform transition-transform ${
                  openIndex === index ? 'rotate-180' : ''
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </button>

          {/* Accordion Content */}
          {openIndex === index && result.response && (
            <div className="px-6 py-4 bg-white border-t border-gray-200">
              <div className="space-y-4">
                {/* Response Metadata */}
                <div className="grid grid-cols-2 gap-4 pb-4 border-b border-gray-200">
                  {result.response['Category Match'] !== undefined && (
                    <div>
                      <span className="text-xs font-semibold text-gray-500 uppercase">Category Match</span>
                      <p className="text-sm text-gray-900 mt-1">
                        {result.response['Category Match'] ? 'Yes' : 'No'}
                      </p>
                    </div>
                  )}
                  {result.response['Is Product Page'] !== undefined && (
                    <div>
                      <span className="text-xs font-semibold text-gray-500 uppercase">Is Product Page</span>
                      <p className="text-sm text-gray-900 mt-1">
                        {result.response['Is Product Page'] ? 'Yes' : 'No'}
                      </p>
                    </div>
                  )}
                  {result.response['SKU Match Result'] && (
                    <div>
                      <span className="text-xs font-semibold text-gray-500 uppercase">SKU Match Result</span>
                      <p className="text-sm text-gray-900 mt-1">{result.response['SKU Match Result']}</p>
                    </div>
                  )}
                </div>

                {/* Product Information */}
                {result.response['Product Information'] && (
                  <div>
                    <h5 className="text-sm font-semibold text-gray-800 mb-3">Product Information</h5>
                    {renderProductInformation(result.response['Product Information'])}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export default ScrappedWebsitesTab;

