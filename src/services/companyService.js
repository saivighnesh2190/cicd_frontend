import api from './api'

export const companyService = {
  // Get all companies
  getAllCompanies: () => api.get('/companies'),
  
  // Get company by ID
  getCompanyById: (id) => api.get(`/companies/${id}`),
  
  // Create new company
  createCompany: (companyData) => api.post('/companies', companyData),
  
  // Update company
  updateCompany: (id, companyData) => api.put(`/companies/${id}`, companyData),
  
  // Delete company
  deleteCompany: (id) => api.delete(`/companies/${id}`),
  
  // Get companies by industry
  getCompaniesByIndustry: (industry) => api.get(`/companies/industry/${industry}`),
  
  // Get companies by status
  getCompaniesByStatus: (status) => api.get(`/companies/status/${status}`)
}