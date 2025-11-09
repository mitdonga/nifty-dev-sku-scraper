import { createPortal } from 'react-dom';

function ImagePreviewModal({ imageUrl, onClose }) {
  const modalContent = (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-75 z-[9999] flex items-center justify-center p-4"
        onClick={onClose}
      >
        {/* Modal Content */}
        <div
          className="relative max-w-7xl max-h-[90vh] bg-white rounded-lg shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 bg-white rounded-full p-2 shadow-lg hover:bg-gray-100 transition-colors"
          >
            <svg
              className="w-6 h-6 text-gray-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>

          {/* Image */}
          <div className="p-4">
            <img
              src={imageUrl}
              alt="Preview"
              className="max-w-full max-h-[85vh] object-contain mx-auto"
              onError={(e) => {
                e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="400"%3E%3Crect fill="%23ddd" width="400" height="400"/%3E%3Ctext fill="%23999" font-family="sans-serif" font-size="12" x="50%25" y="50%25" text-anchor="middle" dy=".3em"%3EProtected Image - Click URL to view%3C/text%3E%3C/svg%3E';
              }}
            />
          </div>

          {/* Image URL */}
          <div className="px-4 pb-4">
            <a
              href={imageUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-indigo-600 hover:text-indigo-800 break-all"
            >
              {imageUrl}
            </a>
          </div>
        </div>
      </div>
    </>
  );

  // Render modal using portal to document body, so it's always visible regardless of scroll position
  return createPortal(modalContent, document.body);
}

export default ImagePreviewModal;

