import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

const AuthContext = createContext({})

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [userProfile, setUserProfile] = useState(null)
  const [company, setCompany] = useState(null)
  const [loading, setLoading] = useState(true)
  const [authError, setAuthError] = useState('')

  useEffect(() => {
    // Get initial session
    supabase?.auth?.getSession()?.then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      if (session?.user) {
        fetchUserProfile(session?.user?.id)
      } else {
        setLoading(false)
      }
    })

    // Listen for auth changes
    const { data: { subscription } } = supabase?.auth?.onAuthStateChange(
      async (event, session) => {
        setUser(session?.user ?? null)
        if (session?.user) {
          await fetchUserProfile(session?.user?.id)
        } else {
          setUserProfile(null)
          setCompany(null)
          setLoading(false)
        }
      }
    )

    return () => subscription?.unsubscribe()
  }, [])

  const fetchUserProfile = async (userId) => {
    try {
      const { data: profile, error } = await supabase?.from('user_profiles')?.select(`
          *,
          companies (*)
        `)?.eq('id', userId)?.single()

      if (error) {
        setAuthError('Failed to load user profile')
        setLoading(false)
        return
      }

      setUserProfile(profile)
      setCompany(profile?.companies)
      setLoading(false)
    } catch (error) {
      if (error?.message?.includes('Failed to fetch') || 
          error?.message?.includes('AuthRetryableFetchError')) {
        setAuthError('Cannot connect to authentication service. Your Supabase project may be paused or inactive. Please check your Supabase dashboard and resume your project if needed.')
        setLoading(false)
        return
      }
      setAuthError('Failed to load user profile')
      setLoading(false)
    }
  }

  const signUp = async (email, password, userData = {}) => {
    try {
      setAuthError('')
      setLoading(true)
      
      const { data, error } = await supabase?.auth?.signUp({
        email,
        password,
        options: {
          data: userData
        }
      })

      if (error) {
        setAuthError(error?.message)
        setLoading(false)
        return { success: false, error: error?.message };
      }

      setLoading(false)
      return { success: true, data }
    } catch (error) {
      if (error?.message?.includes('Failed to fetch') || 
          error?.message?.includes('AuthRetryableFetchError')) {
        setAuthError('Cannot connect to authentication service. Your Supabase project may be paused or inactive. Please check your Supabase dashboard and resume your project if needed.')
        setLoading(false)
        return { success: false, error: 'Connection failed' }
      }
      setAuthError('Something went wrong during sign up. Please try again.')
      setLoading(false)
      return { success: false, error: 'Sign up failed' }
    }
  }

  const signIn = async (email, password) => {
    try {
      setAuthError('')
      setLoading(true)
      
      const { data, error } = await supabase?.auth?.signInWithPassword({
        email,
        password
      })

      if (error) {
        setAuthError(error?.message)
        setLoading(false)
        return { success: false, error: error?.message };
      }

      setLoading(false)
      return { success: true, data }
    } catch (error) {
      if (error?.message?.includes('Failed to fetch') || 
          error?.message?.includes('AuthRetryableFetchError')) {
        setAuthError('Cannot connect to authentication service. Your Supabase project may be paused or inactive. Please check your Supabase dashboard and resume your project if needed.')
        setLoading(false)
        return { success: false, error: 'Connection failed' }
      }
      setAuthError('Something went wrong during sign in. Please try again.')
      setLoading(false)
      return { success: false, error: 'Sign in failed' }
    }
  }

  const signOut = async () => {
    try {
      setLoading(true)
      const { error } = await supabase?.auth?.signOut()
      
      if (error) {
        setAuthError(error?.message)
        return { success: false, error: error?.message };
      }

      setUser(null)
      setUserProfile(null)
      setCompany(null)
      setLoading(false)
      return { success: true }
    } catch (error) {
      setAuthError('Failed to sign out')
      setLoading(false)
      return { success: false, error: 'Sign out failed' }
    }
  }

  const updateProfile = async (updates) => {
    try {
      setAuthError('')
      const { data, error } = await supabase?.from('user_profiles')?.update(updates)?.eq('id', user?.id)?.select()

      if (error) {
        setAuthError(error?.message)
        return { success: false, error: error?.message };
      }

      setUserProfile({ ...userProfile, ...updates })
      return { success: true, data }
    } catch (error) {
      setAuthError('Failed to update profile')
      return { success: false, error: 'Update failed' }
    }
  }

  const value = {
    user,
    userProfile,
    company,
    loading,
    authError,
    signUp,
    signIn,
    signOut,
    updateProfile,
    clearError: () => setAuthError('')
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}