const API_URL = 'https://n8n.mitdonga.com/webhook/nifty-skus';

/**
 * Fetch SKU data from the API
 * @param {Object} filters - Filter options
 * @param {string} filters.status - Status filter (scraping_done, category_not_match, no_result, firecrawl_scrapper_error)
 * @param {string} filters.sku - SKU search query
 * @returns {Promise<Array>} Array of SKU data items
 */
export async function fetchSKUData(filters = {}) {
  try {
    const { status, sku } = filters;
    
    // Build URL with query parameters
    let url = API_URL;
    const queryParams = [];
    
    if (status) {
      queryParams.push(`status=${encodeURIComponent(status)}`);
    }
    
    if (sku) {
      queryParams.push(`sku=${encodeURIComponent(sku)}`);
    }
    
    if (queryParams.length > 0) {
      url += `?${queryParams.join('&')}`;
    }
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    
    // The API returns an array with objects containing a "data" property
    // We need to flatten this structure
    if (Array.isArray(data) && data.length > 0 && data[0].data) {
      return data[0].data;
    }
    
    return data;
  } catch (error) {
    console.error('Error fetching SKU data:', error);
    throw error;
  }
}

