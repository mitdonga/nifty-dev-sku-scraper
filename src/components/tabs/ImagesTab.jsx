import { useState, useEffect } from 'react';
import ImagePreviewModal from '../ImagePreviewModal';

function ImagesTab({ filteredImages, allImages }) {
  const [selectedImage, setSelectedImage] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [imageDimensions, setImageDimensions] = useState({});

  const filteredSet = new Set(filteredImages);

  // Load image dimensions
  useEffect(() => {
    const loadDimensions = async () => {
      const allImageUrls = [...new Set([...filteredImages, ...allImages])];
      const dimensions = {};

      const loadImage = (url) => {
        return new Promise((resolve) => {
          const img = new Image();
          img.onload = () => {
            dimensions[url] = { width: img.naturalWidth, height: img.naturalHeight };
            resolve();
          };
          img.onerror = () => {
            dimensions[url] = null;
            resolve();
          };
          img.src = url;
        });
      };

      await Promise.all(allImageUrls.map(loadImage));
      setImageDimensions(dimensions);
    };

    loadDimensions();
  }, [filteredImages, allImages]);

  const handleImageClick = (imageUrl) => {
    setSelectedImage(imageUrl);
    setIsModalOpen(true);
  };

  const getImageDimensions = (imageUrl) => {
    const dims = imageDimensions[imageUrl];
    if (!dims) return null;
    return `${dims.width} × ${dims.height}`;
  };

  return (
    <div className="space-y-6">
      {/* Filtered Images Section */}
      <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Filtered Images ({filteredImages.length})
        </h3>
        {filteredImages.length > 0 ? (
          <div className="grid grid-cols-3 gap-4">
            {filteredImages.map((imageUrl, index) => (
              <div
                key={index}
                className="relative aspect-square cursor-pointer group overflow-hidden rounded-lg border border-gray-200 hover:border-indigo-500 transition-all"
                onClick={() => handleImageClick(imageUrl)}
              >
                <img
                  src={imageUrl}
                  alt={`Filtered ${index + 1}`}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  onError={(e) => {
                    e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="200" height="200"%3E%3Crect fill="%23ddd" width="200" height="200"/%3E%3Ctext fill="%23999" font-family="sans-serif" font-size="10" x="50%25" y="50%25" text-anchor="middle" dy=".3em"%3EProtected Image - Click URL to view%3C/text%3E%3C/svg%3E';
                  }}
                />
                {getImageDimensions(imageUrl) && (
                  <div className="absolute top-2 left-2 bg-black bg-opacity-75 text-white text-xs px-2 py-1 rounded font-medium">
                    {getImageDimensions(imageUrl)}
                  </div>
                )}
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-opacity flex items-center justify-center">
                  <span className="text-white opacity-0 group-hover:opacity-100 text-sm font-medium">
                    Click to preview
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-sm">No filtered images available</p>
        )}
      </div>

      {/* All Images Section - always visible, filtered ones highlighted */}
      <div className="border-t border-gray-200 pt-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          All Images ({allImages.length})
        </h3>
        {allImages.length > 0 ? (
          <div className="grid grid-cols-3 gap-4">
            {allImages.map((imageUrl, index) => {
              const isFiltered = filteredSet.has(imageUrl);
              return (
                <div
                  key={index}
                  className={`relative aspect-square cursor-pointer group overflow-hidden rounded-lg border-2 transition-all ${
                    isFiltered
                      ? 'border-indigo-500 ring-2 ring-indigo-200'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => handleImageClick(imageUrl)}
                >
                  <img
                    src={imageUrl}
                    alt={`Image ${index + 1}`}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    onError={(e) => {
                      e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="200" height="200"%3E%3Crect fill="%23ddd" width="200" height="200"/%3E%3Ctext fill="%23999" font-family="sans-serif" font-size="10" x="50%25" y="50%25" text-anchor="middle" dy=".3em"%3EProtected Image - Click URL to view%3C/text%3E%3C/svg%3E';
                    }}
                  />
                  {getImageDimensions(imageUrl) && (
                    <div className="absolute top-2 left-2 bg-black bg-opacity-75 text-white text-xs px-2 py-1 rounded font-medium">
                      {getImageDimensions(imageUrl)}
                    </div>
                  )}
                  {isFiltered && (
                    <div className="absolute top-2 right-2 bg-indigo-500 text-white text-xs px-2 py-1 rounded font-medium shadow">
                      Filtered
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-opacity flex items-center justify-center">
                    <span className="text-white opacity-0 group-hover:opacity-100 text-sm font-medium">
                      Click to preview
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-gray-500 text-sm">No images available</p>
        )}
      </div>

      {/* Image Preview Modal */}
      {isModalOpen && selectedImage && (
        <ImagePreviewModal
          imageUrl={selectedImage}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedImage(null);
          }}
        />
      )}
    </div>
  );
}

export default ImagesTab;

