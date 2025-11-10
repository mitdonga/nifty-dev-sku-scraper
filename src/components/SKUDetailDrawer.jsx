import { useState, useEffect } from 'react';
import AttributesTab from './tabs/AttributesTab';
import CustomAttributesTab from './tabs/CustomAttributesTab';
import ImagesTab from './tabs/ImagesTab';
import ScrappedWebsitesTab from './tabs/ScrappedWebsitesTab';

function SKUDetailDrawer({ isOpen, onClose, skuData }) {
  const [activeTab, setActiveTab] = useState('attributes');

  useEffect(() => {
    if (isOpen && skuData) {
      setActiveTab('attributes');
    }
  }, [isOpen, skuData]);

  if (!isOpen || !skuData) return null;

  const tabs = [
    { id: 'attributes', label: 'Attributes' },
    { id: 'custom-attributes', label: 'Custom Attributes' },
    { id: 'images', label: 'Images' },
    { id: 'scrapped-websites', label: 'Scrapped Websites' },
  ];

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity"
        onClick={onClose}
      />

      {/* Drawer */}
      <div
        className={`fixed top-0 left-0 h-full w-[70%] bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } overflow-y-auto`}
      >
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 z-10">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">{skuData.sku || 'N/A'}</h2>
              <p className="text-sm text-gray-600 mt-1">
                {skuData.category} {skuData.sub_category && `• ${skuData.sub_category}`}
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
            >
              ×
            </button>
          </div>
        </div>

        {/* Basic Details */}
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <span className="text-xs font-semibold text-gray-500 uppercase">Status</span>
              <p className="text-sm text-gray-900 mt-1">
                <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                  skuData.status === 'scraping_done' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {skuData.status || 'N/A'}
                </span>
              </p>
            </div>
            <div>
              <span className="text-xs font-semibold text-gray-500 uppercase">Image Processing Status</span>
              <p className="text-sm text-gray-900 mt-1">
                <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                  skuData.image_processing_status === 'done' 
                    ? 'bg-blue-100 text-blue-800' 
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {skuData.image_processing_status || 'N/A'}
                </span>
              </p>
            </div>
            <div>
              <span className="text-xs font-semibold text-gray-500 uppercase">Filtered Images</span>
              <p className="text-sm text-gray-900 mt-1">
                {skuData.image_urls ? skuData.image_urls.length : 0}
              </p>
            </div>
            <div>
              <span className="text-xs font-semibold text-gray-500 uppercase">Search Results</span>
              <p className="text-sm text-gray-900 mt-1">
                {skuData.search_result ? skuData.search_result.length : 0}
              </p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200">
          <div className="flex px-6">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-indigo-600 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {activeTab === 'attributes' && <AttributesTab attributes={skuData.attributes} />}
          {activeTab === 'custom-attributes' && <CustomAttributesTab customAttributes={skuData.custom_attributes} />}
          {activeTab === 'images' && (
            <ImagesTab
              filteredImages={skuData.image_urls || []}
              allImages={skuData.image_urls_raw || []}
            />
          )}
          {activeTab === 'scrapped-websites' && (
            <ScrappedWebsitesTab searchResults={skuData.search_result || []} />
          )}
        </div>
      </div>
    </>
  );
}

export default SKUDetailDrawer;

