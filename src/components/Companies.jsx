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
import { companyService } from '../services/companyService'

const Companies = () => {
  const [companies, setCompanies] = useState([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingCompany, setEditingCompany] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    industry: '',
    size: '',
    website: '',
    status: 'Active',
    revenue: ''
  })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    fetchCompanies()
  }, [])

  const fetchCompanies = async () => {
    try {
      const response = await companyService.getAllCompanies()
      setCompanies(response.data)
    } catch (error) {
      console.error('Error fetching companies:', error)
      setError('Failed to fetch companies')
    } finally {
      setLoading(false)
    }
  }

  const handleAdd = () => {
    setEditingCompany(null)
    setFormData({
      name: '',
      industry: '',
      size: '',
      website: '',
      status: 'Active',
      revenue: ''
    })
    setDialogOpen(true)
  }

  const handleEdit = (company) => {
    setEditingCompany(company)
    setFormData({
      name: company.name || '',
      industry: company.industry || '',
      size: company.size || '',
      website: company.website || '',
      status: company.status || 'Active',
      revenue: company.revenue || ''
    })
    setDialogOpen(true)
  }

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this company?')) {
      try {
        await companyService.deleteCompany(id)
        setSuccess('Company deleted successfully')
        fetchCompanies()
      } catch (error) {
        setError('Failed to delete company')
      }
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    try {
      const companyData = {
        ...formData,
        revenue: formData.revenue ? parseFloat(formData.revenue) : null
      }

      if (editingCompany) {
        await companyService.updateCompany(editingCompany.id, companyData)
        setSuccess('Company updated successfully')
      } else {
        await companyService.createCompany(companyData)
        setSuccess('Company created successfully')
      }

      setDialogOpen(false)
      fetchCompanies()
    } catch (error) {
      setError('Failed to save company')
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
      field: 'name',
      headerName: 'Company Name',
      width: 200,
      editable: false,
    },
    {
      field: 'industry',
      headerName: 'Industry',
      width: 130,
      editable: false,
    },
    {
      field: 'size',
      headerName: 'Size',
      width: 100,
      editable: false,
    },
    {
      field: 'website',
      headerName: 'Website',
      width: 200,
      editable: false,
    },
    {
      field: 'status',
      headerName: 'Status',
      width: 100,
      editable: false,
    },
    {
      field: 'revenue',
      headerName: 'Revenue',
      width: 130,
      valueFormatter: (params) => 
        params.value ? `$${params.value.toLocaleString()}` : 'N/A',
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
          Companies
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={handleAdd}
        >
          Add Company
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
          rows={companies}
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
          {editingCompany ? 'Edit Company' : 'Add New Company'}
        </DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  margin="dense"
                  name="name"
                  label="Company Name"
                  fullWidth
                  variant="outlined"
                  required
                  value={formData.name}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  margin="dense"
                  name="industry"
                  label="Industry"
                  fullWidth
                  variant="outlined"
                  value={formData.industry}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth margin="dense">
                  <InputLabel>Size</InputLabel>
                  <Select
                    name="size"
                    value={formData.size}
                    onChange={handleChange}
                    label="Size"
                  >
                    <MenuItem value="">
                      <em>None</em>
                    </MenuItem>
                    <MenuItem value="Small">Small (1-50)</MenuItem>
                    <MenuItem value="Medium">Medium (51-500)</MenuItem>
                    <MenuItem value="Large">Large (500+)</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  margin="dense"
                  name="website"
                  label="Website"
                  fullWidth
                  variant="outlined"
                  value={formData.website}
                  onChange={handleChange}
                />
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
              <Grid item xs={12} sm={6}>
                <TextField
                  margin="dense"
                  name="revenue"
                  label="Revenue"
                  type="number"
                  fullWidth
                  variant="outlined"
                  value={formData.revenue}
                  onChange={handleChange}
                  InputProps={{
                    startAdornment: '$'
                  }}
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button type="submit" variant="contained">
              {editingCompany ? 'Update' : 'Create'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Container>
  )
}

export default Companies