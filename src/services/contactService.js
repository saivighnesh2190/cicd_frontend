import api from './api'

export const contactService = {
  // Get all contacts
  getAllContacts: () => api.get('/contacts'),
  
  // Get contact by ID
  getContactById: (id) => api.get(`/contacts/${id}`),
  
  // Create new contact
  createContact: (contactData) => api.post('/contacts', contactData),
  
  // Update contact
  updateContact: (id, contactData) => api.put(`/contacts/${id}`, contactData),
  
  // Delete contact
  deleteContact: (id) => api.delete(`/contacts/${id}`),
  
  // Get contacts by company
  getContactsByCompany: (companyId) => api.get(`/contacts/company/${companyId}`),
  
  // Get contacts by status
  getContactsByStatus: (status) => api.get(`/contacts/status/${status}`)
}