import { supabase } from '../lib/supabase';
 import jsPDF from'jspdf';
 import html2canvas from'html2canvas';

export const reportService = {
  // Get all reports for the user's company
  async getReports(filters = {}) {
    try {
      let query = supabase
        .from('reports')
        .select(`
          *,
          user_profiles!reports_generated_by_fkey (full_name, email)
        `)
        .order('created_at', { ascending: false })

      if (filters.report_type) {
        query = query.eq('report_type', filters.report_type)
      }

      if (filters.status) {
        query = query.eq('status', filters.status)
      }

      const { data, error } = await query

      if (error) {
        return { success: false, error: error.message, data: [] }
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
      return { success: false, error: 'Failed to load reports', data: [] }
    }
  },

  // Generate a new report
  async generateReport(reportConfig) {
    try {
      const { data: userProfile } = await supabase
        .from('user_profiles')
        .select('company_id')
        .eq('id', (await supabase.auth.getUser()).data.user?.id)
        .single()

      if (!userProfile?.company_id) {
        return { success: false, error: 'User company not found' }
      }

      // Create report record
      const { data: report, error: reportError } = await supabase
        .from('reports')
        .insert({
          company_id: userProfile.company_id,
          name: reportConfig.name,
          description: reportConfig.description,
          report_type: reportConfig.report_type,
          data_filters: reportConfig.data_filters || {},
          generated_by: (await supabase.auth.getUser()).data.user?.id,
          status: 'generating',
          generation_started_at: new Date().toISOString()
        })
        .select()
        .single()

      if (reportError) {
        return { success: false, error: reportError.message }
      }

      // Generate report data based on type
      let reportData = {}
      
      switch (reportConfig.report_type) {
        case 'product_summary':
          reportData = await this.generateProductSummaryData(reportConfig.data_filters)
          break
        case 'submission_analysis':
          reportData = await this.generateSubmissionAnalysisData(reportConfig.data_filters)
          break
        case 'innovation_pipeline':
          reportData = await this.generateInnovationPipelineData(reportConfig.data_filters)
          break
        default:
          reportData = { error: 'Unknown report type' }
      }

      if (reportData.error) {
        await supabase
          .from('reports')
          .update({
            status: 'failed',
            error_message: reportData.error
          })
          .eq('id', report.id)
        
        return { success: false, error: reportData.error }
      }

      // Update report as completed
      const { data: updatedReport, error: updateError } = await supabase
        .from('reports')
        .update({
          status: 'completed',
          generation_completed_at: new Date().toISOString(),
          template_config: reportData
        })
        .eq('id', report.id)
        .select()
        .single()

      if (updateError) {
        return { success: false, error: updateError.message }
      }

      return { success: true, data: { ...updatedReport, reportData } }
    } catch (error) {
      if (error?.message?.includes('Failed to fetch')) {
        return { 
          success: false, 
          error: 'Cannot connect to database. Your Supabase project may be paused or deleted.'
        }
      }
      return { success: false, error: 'Failed to generate report' }
    }
  },

  // Generate product summary data
  async generateProductSummaryData(filters = {}) {
    try {
      let query = supabase
        .from('products')
        .select(`
          *,
          product_categories (name),
          user_profiles!products_created_by_fkey (full_name)
        `)

      if (filters.categories && filters.categories.length > 0) {
        const { data: categoryIds } = await supabase
          .from('product_categories')
          .select('id')
          .in('name', filters.categories)
        
        if (categoryIds?.length > 0) {
          query = query.in('category_id', categoryIds.map(c => c.id))
        }
      }

      if (filters.date_range) {
        if (filters.date_range.start) {
          query = query.gte('created_at', filters.date_range.start)
        }
        if (filters.date_range.end) {
          query = query.lte('created_at', filters.date_range.end)
        }
      }

      const { data: products, error } = await query

      if (error) {
        return { error: error.message }
      }

      // Calculate summary statistics
      const totalProducts = products?.length || 0
      const totalValue = products?.reduce((sum, p) => sum + (p.price * p.stock_quantity), 0) || 0
      const totalCost = products?.reduce((sum, p) => sum + (p.cost * p.stock_quantity), 0) || 0
      const totalStock = products?.reduce((sum, p) => sum + p.stock_quantity, 0) || 0

      const categorySummary = products?.reduce((acc, product) => {
        const categoryName = product.product_categories?.name || 'Uncategorized'
        if (!acc[categoryName]) {
          acc[categoryName] = { count: 0, value: 0, stock: 0 }
        }
        acc[categoryName].count++
        acc[categoryName].value += product.price * product.stock_quantity
        acc[categoryName].stock += product.stock_quantity
        return acc
      }, {})

      return {
        summary: {
          totalProducts,
          totalValue,
          totalCost,
          totalStock,
          profitMargin: totalValue > 0 ? ((totalValue - totalCost) / totalValue * 100).toFixed(2) : 0
        },
        products: products || [],
        categorySummary: categorySummary || {},
        generatedAt: new Date().toISOString()
      }
    } catch (error) {
      return { error: 'Failed to generate product summary data' }
    }
  },

  // Generate submission analysis data
  async generateSubmissionAnalysisData(filters = {}) {
    try {
      let query = supabase
        .from('form_submissions')
        .select(`
          *,
          form_templates (name),
          user_profiles!form_submissions_submitted_by_fkey (full_name)
        `)

      if (filters.form_template_id) {
        query = query.eq('form_template_id', filters.form_template_id)
      }

      const { data: submissions, error } = await query

      if (error) {
        return { error: error.message }
      }

      const totalSubmissions = submissions?.length || 0
      const statusSummary = submissions?.reduce((acc, submission) => {
        if (!acc[submission.status]) {
          acc[submission.status] = 0
        }
        acc[submission.status]++
        return acc
      }, {})

      const averageCompletionTime = submissions
        ?.filter(s => s.submitted_at && s.created_at)
        ?.reduce((sum, s) => {
          const start = new Date(s.created_at)
          const end = new Date(s.submitted_at)
          return sum + (end - start)
        }, 0) / (submissions?.filter(s => s.submitted_at).length || 1)

      return {
        summary: {
          totalSubmissions,
          statusSummary: statusSummary || {},
          averageCompletionTime: averageCompletionTime || 0
        },
        submissions: submissions || [],
        generatedAt: new Date().toISOString()
      }
    } catch (error) {
      return { error: 'Failed to generate submission analysis data' }
    }
  },

  // Generate innovation pipeline data
  async generateInnovationPipelineData(filters = {}) {
    try {
      const { data: submissions, error } = await supabase
        .from('form_submissions')
        .select(`
          *,
          form_templates (name),
          user_profiles!form_submissions_submitted_by_fkey (full_name)
        `)
        .eq('form_templates.name', 'Innovation Assessment')

      if (error) {
        return { error: error.message }
      }

      return {
        summary: {
          totalIdeas: submissions?.length || 0,
          pendingReview: submissions?.filter(s => s.status === 'submitted').length || 0,
          approved: submissions?.filter(s => s.status === 'approved').length || 0
        },
        innovations: submissions || [],
        generatedAt: new Date().toISOString()
      }
    } catch (error) {
      return { error: 'Failed to generate innovation pipeline data' }
    }
  },

  // Generate PDF from HTML element
  async generatePDF(elementId, filename = 'report.pdf') {
    try {
      const element = document.getElementById(elementId)
      if (!element) {
        return { success: false, error: 'Report element not found' }
      }

      const canvas = await html2canvas(element, {
        scale: 2,
        logging: false,
        useCORS: true
      })

      const imgData = canvas.toDataURL('image/png')
      const pdf = new jsPDF('p', 'mm', 'a4')
      
      const imgWidth = 210
      const pageHeight = 295
      const imgHeight = (canvas.height * imgWidth) / canvas.width
      let heightLeft = imgHeight

      let position = 0

      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight)
      heightLeft -= pageHeight

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight
        pdf.addPage()
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight)
        heightLeft -= pageHeight
      }

      pdf.save(filename)
      return { success: true }
    } catch (error) {
      return { success: false, error: 'Failed to generate PDF' }
    }
  }
}