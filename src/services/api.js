const API_URL = 'https://n8n.mitdonga.com/webhook/nifty-skus';

/**
 * Fetch SKU data from the API
 * @returns {Promise<Array>} Array of SKU data items
 */
export async function fetchSKUData() {
  try {
    const response = await fetch(API_URL, {
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

