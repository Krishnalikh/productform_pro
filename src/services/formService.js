import { supabase } from '../lib/supabase';

export const formService = {
  // Get all form templates for the user's company
  async getFormTemplates() {
    try {
      const { data, error } = await supabase?.from('form_templates')?.select(`
          *,
          user_profiles!form_templates_created_by_fkey (full_name)
        `)?.order('created_at', { ascending: false })

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
      return { success: false, error: 'Failed to load form templates', data: [] }
    }
  },

  // Get a single form template with questions
  async getFormTemplate(id) {
    try {
      const { data: template, error: templateError } = await supabase?.from('form_templates')?.select('*')?.eq('id', id)?.single()

      if (templateError) {
        return { success: false, error: templateError?.message, data: null };
      }

      const { data: questions, error: questionsError } = await supabase?.from('form_questions')?.select('*')?.eq('form_template_id', id)?.order('step_number', { ascending: true })?.order('sort_order', { ascending: true })

      if (questionsError) {
        return { success: false, error: questionsError?.message, data: null };
      }

      return { 
        success: true, 
        data: { 
          ...template, 
          questions: questions || [] 
        } 
      }
    } catch (error) {
      if (error?.message?.includes('Failed to fetch')) {
        return { 
          success: false, 
          error: 'Cannot connect to database. Your Supabase project may be paused or deleted.',
          data: null 
        }
      }
      return { success: false, error: 'Failed to load form template', data: null }
    }
  },

  // Create a new form template
  async createFormTemplate(templateData) {
    try {
      const { data: userProfile } = await supabase?.from('user_profiles')?.select('company_id')?.eq('id', (await supabase?.auth?.getUser())?.data?.user?.id)?.single()

      if (!userProfile?.company_id) {
        return { success: false, error: 'User company not found' }
      }

      const { data, error } = await supabase?.from('form_templates')?.insert({
          ...templateData,
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
      return { success: false, error: 'Failed to create form template' }
    }
  },

  // Create form questions for a template
  async createFormQuestions(templateId, questions) {
    try {
      const questionsWithTemplateId = questions?.map(question => ({
        ...question,
        form_template_id: templateId
      }))

      const { data, error } = await supabase?.from('form_questions')?.insert(questionsWithTemplateId)?.select()

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
      return { success: false, error: 'Failed to create form questions' }
    }
  },

  // Get form submissions
  async getFormSubmissions(filters = {}) {
    try {
      let query = supabase?.from('form_submissions')?.select(`
          *,
          form_templates (name),
          products (name, sku),
          user_profiles!form_submissions_submitted_by_fkey (full_name, email)
        `)?.order('created_at', { ascending: false })

      if (filters?.form_template_id) {
        query = query?.eq('form_template_id', filters?.form_template_id)
      }

      if (filters?.status) {
        query = query?.eq('status', filters?.status)
      }

      if (filters?.submitted_by) {
        query = query?.eq('submitted_by', filters?.submitted_by)
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
          error: 'Cannot connect to database. Your Supabase project may be paused or deleted.',
          data: [] 
        }
      }
      return { success: false, error: 'Failed to load form submissions', data: [] }
    }
  },

  // Create a new form submission
  async createFormSubmission(submissionData) {
    try {
      const { data: userProfile } = await supabase?.from('user_profiles')?.select('company_id')?.eq('id', (await supabase?.auth?.getUser())?.data?.user?.id)?.single()

      if (!userProfile?.company_id) {
        return { success: false, error: 'User company not found' }
      }

      const { data, error } = await supabase?.from('form_submissions')?.insert({
          ...submissionData,
          company_id: userProfile?.company_id,
          submitted_by: (await supabase?.auth?.getUser())?.data?.user?.id
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
      return { success: false, error: 'Failed to create form submission' }
    }
  },

  // Update form submission (for multi-step progress)
  async updateFormSubmission(id, updates) {
    try {
      const { data, error } = await supabase?.from('form_submissions')?.update(updates)?.eq('id', id)?.select()?.single()

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
      return { success: false, error: 'Failed to update form submission' }
    }
  },

  // Submit form (mark as completed)
  async submitForm(id) {
    try {
      const { data, error } = await supabase?.from('form_submissions')?.update({
          status: 'submitted',
          submitted_at: new Date()?.toISOString()
        })?.eq('id', id)?.select()?.single()

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
      return { success: false, error: 'Failed to submit form' }
    }
  }
}