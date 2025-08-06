import { supabase } from '../lib/supabase';

export const authService = {
  // Get current session
  async getSession() {
    try {
      const { data: { session }, error } = await supabase?.auth?.getSession()
      
      if (error) {
        return { success: false, error: error?.message, session: null };
      }

      return { success: true, session }
    } catch (error) {
      if (error?.message?.includes('Failed to fetch') || 
          error?.message?.includes('AuthRetryableFetchError')) {
        return { 
          success: false, 
          error: 'Cannot connect to authentication service. Your Supabase project may be paused or inactive.',
          session: null 
        }
      }
      return { success: false, error: 'Failed to get session', session: null }
    }
  },

  // Get user profile with company information
  async getUserProfile(userId) {
    try {
      const { data, error } = await supabase?.from('user_profiles')?.select(`
          *,
          companies (*)
        `)?.eq('id', userId)?.single()

      if (error) {
        return { success: false, error: error?.message, profile: null };
      }

      return { success: true, profile: data }
    } catch (error) {
      if (error?.message?.includes('Failed to fetch')) {
        return { 
          success: false, 
          error: 'Cannot connect to database. Your Supabase project may be paused or deleted.',
          profile: null 
        }
      }
      return { success: false, error: 'Failed to load user profile', profile: null }
    }
  },

  // Sign up a new user
  async signUp(email, password, userData = {}) {
    try {
      const { data, error } = await supabase?.auth?.signUp({
        email,
        password,
        options: {
          data: {
            full_name: userData?.full_name || '',
            company_name: userData?.company_name || ''
          }
        }
      })

      if (error) {
        return { success: false, error: error?.message };
      }

      // If company_name provided, create company and link user
      if (userData?.company_name && data?.user) {
        await this.createCompanyAndLinkUser(data?.user?.id, userData?.company_name, userData?.full_name)
      }

      return { success: true, data }
    } catch (error) {
      if (error?.message?.includes('Failed to fetch') || 
          error?.message?.includes('AuthRetryableFetchError')) {
        return { 
          success: false, 
          error: 'Cannot connect to authentication service. Your Supabase project may be paused or inactive.'
        }
      }
      return { success: false, error: 'Sign up failed' }
    }
  },

  // Sign in user
  async signIn(email, password) {
    try {
      const { data, error } = await supabase?.auth?.signInWithPassword({
        email,
        password
      })

      if (error) {
        return { success: false, error: error?.message };
      }

      return { success: true, data }
    } catch (error) {
      if (error?.message?.includes('Failed to fetch') || 
          error?.message?.includes('AuthRetryableFetchError')) {
        return { 
          success: false, 
          error: 'Cannot connect to authentication service. Your Supabase project may be paused or inactive.'
        }
      }
      return { success: false, error: 'Sign in failed' }
    }
  },

  // Sign out user
  async signOut() {
    try {
      const { error } = await supabase?.auth?.signOut()
      
      if (error) {
        return { success: false, error: error?.message };
      }

      return { success: true }
    } catch (error) {
      return { success: false, error: 'Sign out failed' }
    }
  },

  // Create company and link user (for new signups)
  async createCompanyAndLinkUser(userId, companyName, fullName) {
    try {
      // Create company
      const { data: company, error: companyError } = await supabase?.from('companies')?.insert({
          name: companyName,
          domain: companyName?.toLowerCase()?.replace(/\s+/g, '') + '.com'
        })?.select()?.single()

      if (companyError) {
        return { success: false, error: companyError?.message };
      }

      // Update user profile with company
      const { error: profileError } = await supabase?.from('user_profiles')?.upsert({
          id: userId,
          company_id: company?.id,
          full_name: fullName,
          role: 'admin' // First user becomes admin
        })

      if (profileError) {
        return { success: false, error: profileError?.message };
      }

      return { success: true, company }
    } catch (error) {
      return { success: false, error: 'Failed to setup company' }
    }
  },

  // Update user profile
  async updateProfile(userId, updates) {
    try {
      const { data, error } = await supabase?.from('user_profiles')?.update(updates)?.eq('id', userId)?.select()?.single()

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
      return { success: false, error: 'Failed to update profile' }
    }
  },

  // Get company users (for admins)
  async getCompanyUsers(companyId) {
    try {
      const { data, error } = await supabase?.from('user_profiles')?.select('*')?.eq('company_id', companyId)?.order('created_at', { ascending: false })

      if (error) {
        return { success: false, error: error?.message, users: [] };
      }

      return { success: true, users: data || [] }
    } catch (error) {
      if (error?.message?.includes('Failed to fetch')) {
        return { 
          success: false, 
          error: 'Cannot connect to database. Your Supabase project may be paused or deleted.',
          users: [] 
        }
      }
      return { success: false, error: 'Failed to load company users', users: [] }
    }
  }
}