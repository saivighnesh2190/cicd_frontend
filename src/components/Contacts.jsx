import { useState, useEffect } from 'react'
import {
  Container,
  Typography,
  Button,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Grid,
  IconButton,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material'
import { DataGrid } from '@mui/x-data-grid'
import { Add, Edit, Delete } from '@mui/icons-material'
import { contactService } from '../services/contactService'
import { companyService } from '../services/companyService'

const Contacts = () => {
  const [contacts, setContacts] = useState([])
  const [companies, setCompanies] = useState([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingContact, setEditingContact] = useState(null)
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    position: '',
    companyId: '',
    status: 'Active'
  })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    fetchContacts()
    fetchCompanies()
  }, [])

  const fetchContacts = async () => {
    try {
      const response = await contactService.getAllContacts()
      setContacts(response.data)
    } catch (error) {
      console.error('Error fetching contacts:', error)
      setError('Failed to fetch contacts')
    } finally {
      setLoading(false)
    }
  }

  const fetchCompanies = async () => {
    try {
      const response = await companyService.getAllCompanies()
      setCompanies(response.data)
    } catch (error) {
      console.error('Error fetching companies:', error)
    }
  }

  const handleAdd = () => {
    setEditingContact(null)
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      position: '',
      companyId: '',
      status: 'Active'
    })
    setDialogOpen(true)
  }

  const handleEdit = (contact) => {
    setEditingContact(contact)
    setFormData({
      firstName: contact.firstName || '',
      lastName: contact.lastName || '',
      email: contact.email || '',
      phone: contact.phone || '',
      position: contact.position || '',
      companyId: contact.company?.id || '',
      status: contact.status || 'Active'
    })
    setDialogOpen(true)
  }

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this contact?')) {
      try {
        await contactService.deleteContact(id)
        setSuccess('Contact deleted successfully')
        fetchContacts()
      } catch (error) {
        setError('Failed to delete contact')
      }
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    try {
      const contactData = {
        ...formData,
        company: formData.companyId ? { id: formData.companyId } : null
      }

      if (editingContact) {
        await contactService.updateContact(editingContact.id, contactData)
        setSuccess('Contact updated successfully')
      } else {
        await contactService.createContact(contactData)
        setSuccess('Contact created successfully')
      }

      setDialogOpen(false)
      fetchContacts()
    } catch (error) {
      setError('Failed to save contact')
    }
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const columns = [
    {
      field: 'firstName',
      headerName: 'First Name',
      width: 130,
      editable: false,
    },
    {
      field: 'lastName',
      headerName: 'Last Name',
      width: 130,
      editable: false,
    },
    {
      field: 'email',
      headerName: 'Email',
      width: 200,
      editable: false,
    },
    {
      field: 'phone',
      headerName: 'Phone',
      width: 130,
      editable: false,
    },
    {
      field: 'position',
      headerName: 'Position',
      width: 150,
      editable: false,
    },
    {
      field: 'company',
      headerName: 'Company',
      width: 150,
      valueGetter: (params) => params.row.company?.name || 'N/A',
      editable: false,
    },
    {
      field: 'status',
      headerName: 'Status',
      width: 100,
      editable: false,
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 120,
      renderCell: (params) => (
        <Box>
          <IconButton
            size="small"
            onClick={() => handleEdit(params.row)}
            color="primary"
          >
            <Edit />
          </IconButton>
          <IconButton
            size="small"
            onClick={() => handleDelete(params.row.id)}
            color="error"
          >
            <Delete />
          </IconButton>
        </Box>
      ),
    },
  ]

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" gutterBottom>
          Contacts
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={handleAdd}
        >
          Add Contact
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccess('')}>
          {success}
        </Alert>
      )}

      <Box sx={{ height: 600, width: '100%' }}>
        <DataGrid
          rows={contacts}
          columns={columns}
          pageSize={10}
          rowsPerPageOptions={[10]}
          checkboxSelection
          disableSelectionOnClick
          loading={loading}
        />
      </Box>

      <Dialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {editingContact ? 'Edit Contact' : 'Add New Contact'}
        </DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  margin="dense"
                  name="firstName"
                  label="First Name"
                  fullWidth
                  variant="outlined"
                  required
                  value={formData.firstName}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  margin="dense"
                  name="lastName"
                  label="Last Name"
                  fullWidth
                  variant="outlined"
                  required
                  value={formData.lastName}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  margin="dense"
                  name="email"
                  label="Email"
                  type="email"
                  fullWidth
                  variant="outlined"
                  value={formData.email}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  margin="dense"
                  name="phone"
                  label="Phone"
                  fullWidth
                  variant="outlined"
                  value={formData.phone}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  margin="dense"
                  name="position"
                  label="Position"
                  fullWidth
                  variant="outlined"
                  value={formData.position}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth margin="dense">
                  <InputLabel>Company</InputLabel>
                  <Select
                    name="companyId"
                    value={formData.companyId}
                    onChange={handleChange}
                    label="Company"
                  >
                    <MenuItem value="">
                      <em>None</em>
                    </MenuItem>
                    {companies.map((company) => (
                      <MenuItem key={company.id} value={company.id}>
                        {company.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth margin="dense">
                  <InputLabel>Status</InputLabel>
                  <Select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    label="Status"
                  >
                    <MenuItem value="Active">Active</MenuItem>
                    <MenuItem value="Inactive">Inactive</MenuItem>
                    <MenuItem value="Prospect">Prospect</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button type="submit" variant="contained">
              {editingContact ? 'Update' : 'Create'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Container>
  )
}

export default Contacts