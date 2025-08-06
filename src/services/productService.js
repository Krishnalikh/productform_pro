import { supabase } from '../lib/supabase';

export const productService = {
  // Get all products for the user's company
  async getProducts(filters = {}) {
    try {
      let query = supabase?.from('products')?.select(`
          *,
          product_categories (name),
          user_profiles!products_created_by_fkey (full_name)
        `)?.order('created_at', { ascending: false })

      if (filters?.category_id) {
        query = query?.eq('category_id', filters?.category_id)
      }

      if (filters?.status) {
        query = query?.eq('status', filters?.status)
      }

      if (filters?.search) {
        query = query?.or(`name.ilike.%${filters?.search}%,description.ilike.%${filters?.search}%,sku.ilike.%${filters?.search}%`)
      }

      const { data, error } = await query

      if (error) {
        return { success: false, error: error?.message, data: [] };
      }

      return { success: true, data: data || [] }
    } catch (error) {
      if (error?.message?.includes('Failed to fetch')) {
        return { 
          success: false, 
          error: 'Cannot connect to database. Your Supabase project may be paused or deleted. Please visit your Supabase dashboard to check project status.',
          data: [] 
        }
      }
      return { success: false, error: 'Failed to load products', data: [] }
    }
  },

  // Get a single product by ID
  async getProduct(id) {
    try {
      const { data, error } = await supabase?.from('products')?.select(`
          *,
          product_categories (name, description),
          user_profiles!products_created_by_fkey (full_name, email)
        `)?.eq('id', id)?.single()

      if (error) {
        return { success: false, error: error?.message, data: null };
      }

      return { success: true, data }
    } catch (error) {
      if (error?.message?.includes('Failed to fetch')) {
        return { 
          success: false, 
          error: 'Cannot connect to database. Your Supabase project may be paused or deleted.',
          data: null 
        }
      }
      return { success: false, error: 'Failed to load product', data: null }
    }
  },

  // Create a new product
  async createProduct(productData) {
    try {
      // Get user's company_id
      const { data: userProfile } = await supabase?.from('user_profiles')?.select('company_id')?.eq('id', (await supabase?.auth?.getUser())?.data?.user?.id)?.single()

      if (!userProfile?.company_id) {
        return { success: false, error: 'User company not found' }
      }

      const { data, error } = await supabase?.from('products')?.insert({
          ...productData,
          company_id: userProfile?.company_id,
          created_by: (await supabase?.auth?.getUser())?.data?.user?.id
        })?.select()?.single()

      if (error) {
        return { success: false, error: error?.message };
      }

      return { success: true, data }
    } catch (error) {
      if (error?.message?.includes('Failed to fetch')) {
        return { 
          success: false, 
          error: 'Cannot connect to database. Your Supabase project may be paused or deleted.'
        }
      }
      return { success: false, error: 'Failed to create product' }
    }
  },

  // Update a product
  async updateProduct(id, updates) {
    try {
      const { data, error } = await supabase?.from('products')?.update(updates)?.eq('id', id)?.select()?.single()

      if (error) {
        return { success: false, error: error?.message };
      }

      return { success: true, data }
    } catch (error) {
      if (error?.message?.includes('Failed to fetch')) {
        return { 
          success: false, 
          error: 'Cannot connect to database. Your Supabase project may be paused or deleted.'
        }
      }
      return { success: false, error: 'Failed to update product' }
    }
  },

  // Delete a product
  async deleteProduct(id) {
    try {
      const { error } = await supabase?.from('products')?.delete()?.eq('id', id)

      if (error) {
        return { success: false, error: error?.message };
      }

      return { success: true }
    } catch (error) {
      if (error?.message?.includes('Failed to fetch')) {
        return { 
          success: false, 
          error: 'Cannot connect to database. Your Supabase project may be paused or deleted.'
        }
      }
      return { success: false, error: 'Failed to delete product' }
    }
  },

  // Get product categories
  async getCategories() {
    try {
      const { data, error } = await supabase?.from('product_categories')?.select('*')?.order('sort_order', { ascending: true })

      if (error) {
        return { success: false, error: error?.message, data: [] };
      }

      return { success: true, data: data || [] }
    } catch (error) {
      if (error?.message?.includes('Failed to fetch')) {
        return { 
          success: false, 
          error: 'Cannot connect to database. Your Supabase project may be paused or deleted.',
          data: [] 
        }
      }
      return { success: false, error: 'Failed to load categories', data: [] }
    }
  },

  // Create a new category
  async createCategory(categoryData) {
    try {
      const { data: userProfile } = await supabase?.from('user_profiles')?.select('company_id')?.eq('id', (await supabase?.auth?.getUser())?.data?.user?.id)?.single()

      if (!userProfile?.company_id) {
        return { success: false, error: 'User company not found' }
      }

      const { data, error } = await supabase?.from('product_categories')?.insert({
          ...categoryData,
          company_id: userProfile?.company_id
        })?.select()?.single()

      if (error) {
        return { success: false, error: error?.message };
      }

      return { success: true, data }
    } catch (error) {
      if (error?.message?.includes('Failed to fetch')) {
        return { 
          success: false, 
          error: 'Cannot connect to database. Your Supabase project may be paused or deleted.'
        }
      }
      return { success: false, error: 'Failed to create category' }
    }
  }
}