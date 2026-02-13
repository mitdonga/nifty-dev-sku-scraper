import { supabase } from './supabase';
import { categories as defaultInitCategories } from '../constants';

/** Supabase table name for category options (matches n8n: category_sheet_data) */
const CATEGORY_TABLE = 'category_sheet_data';

const SKU_SELECT_COLUMNS =
  'id,sku,category,sub_category,init_category_name,status,image_processing_status,updated_at,image_urls,image_urls_raw,search_result,filterable_attributes,custom_attributes';

/** Default limit for initial/main page load */
const DEFAULT_SKU_LIMIT = 500;

/**
 * Fetch SKU data from Supabase (bcit_products)
 * @param {Object} filters - Filter options
 * @param {string} filters.status - Status filter (scraping_done, category_not_match, no_result, firecrawl_scrapper_error)
 * @param {string} filters.sku - SKU search query
 * @param {string} filters.category - Category filter
 * @param {string} filters.init_category_name - Initial category name filter
 * @param {number} [limit=500] - Max number of SKUs to fetch (default: 500 latest)
 * @returns {Promise<Array>} Array of SKU data items
 */
export async function fetchSKUData(filters = {}, limit = DEFAULT_SKU_LIMIT) {
  try {
    const { status, sku, category, init_category_name } = filters;

    let query = supabase
      .from('bcit_products')
      .select(SKU_SELECT_COLUMNS)
      .order('updated_at', { ascending: false })
      .limit(limit);

    if (status) {
      query = query.eq('status', status);
    }
    if (category) {
      query = query.eq('category', category);
    }
    if (init_category_name) {
      query = query.eq('init_category_name', init_category_name);
    }
    if (sku && sku.trim()) {
      query = query.ilike('sku', `%${sku.trim()}%`);
    }

    const { data, error } = await query;

    if (error) {
      throw new Error(error.message || 'Failed to fetch SKU data');
    }

    return data ?? [];
  } catch (error) {
    console.error('Error fetching SKU data:', error);
    throw error;
  }
}

/**
 * Fetch distinct category names from the category table for the filter dropdown
 * @returns {Promise<string[]>} Sorted array of category names
 */
export async function fetchCategoryOptions() {
  try {
    const { data, error } = await supabase.from(CATEGORY_TABLE).select('category');

    if (error) {
      throw new Error(error.message || 'Failed to fetch categories');
    }

    const names = [...new Set((data ?? []).map((row) => row.category).filter(Boolean))];
    return names.sort((a, b) => a.localeCompare(b));
  } catch (error) {
    console.error('Error fetching category options:', error);
    throw error;
  }
}

/**
 * Fetch distinct init_category_name values from bcit_products for the filter dropdown.
 * Uses RPC to get all distinct values (avoids Supabase's 1000-row limit).
 * Falls back to constants if RPC is not available (migration not run).
 * @returns {Promise<string[]>} Sorted array of initial category names
 */
export async function fetchInitCategoryOptions() {
  try {
    const { data, error } = await supabase.rpc('get_distinct_init_categories');

    if (error) {
      console.warn('RPC get_distinct_init_categories failed, using fallback:', error.message);
      return defaultInitCategories;
    }

    const names = (data ?? []).map((row) => row.init_category_name).filter(Boolean);
    return names.length > 0 ? names : defaultInitCategories;
  } catch (error) {
    console.error('Error fetching init category options:', error);
    return defaultInitCategories;
  }
}

/**
 * Fetch scraping stats from the API
 * @returns {Promise<Object>} Object containing category-wise status statistics
 */
export async function fetchScrapingStats() {
  try {
    const response = await fetch('https://n8n.bizaudit.site/webhook/scraping-stats', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching scraping stats:', error);
    throw error;
  }
}

/**
 * Fetch workflow stats from the webhook endpoint
 * @returns {Promise<Array>} Array of workflow data with id, name, tags, and running status
 */
export async function fetchWorkflowStats() {
  try {
    const response = await fetch('https://n8n.bizaudit.site/webhook/workflow-stats', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching workflow stats:', error);
    throw error;
  }
}

