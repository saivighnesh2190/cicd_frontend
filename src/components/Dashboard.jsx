import { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Box,
  Paper
} from '@mui/material'
import {
  People,
  Business,
  TrendingUp,
  AttachMoney
} from '@mui/icons-material'
import { contactService } from '../services/contactService'
import { companyService } from '../services/companyService'

const Dashboard = () => {
  const { user } = useAuth()
  const [stats, setStats] = useState({
    totalContacts: 0,
    totalCompanies: 0,
    activeDeals: 0,
    totalRevenue: 0
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      const [contactsResponse, companiesResponse] = await Promise.all([
        contactService.getAllContacts(),
        companyService.getAllCompanies()
      ])

      setStats({
        totalContacts: contactsResponse.data.length,
        totalCompanies: companiesResponse.data.length,
        activeDeals: 15, // Mock data
        totalRevenue: 125000 // Mock data
      })
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  const statCards = [
    {
      title: 'Total Contacts',
      value: stats.totalContacts,
      icon: <People fontSize="large" />,
      color: '#1976d2'
    },
    {
      title: 'Total Companies',
      value: stats.totalCompanies,
      icon: <Business fontSize="large" />,
      color: '#388e3c'
    },
    {
      title: 'Active Deals',
      value: stats.activeDeals,
      icon: <TrendingUp fontSize="large" />,
      color: '#f57c00'
    },
    {
      title: 'Total Revenue',
      value: `$${stats.totalRevenue.toLocaleString()}`,
      icon: <AttachMoney fontSize="large" />,
      color: '#7b1fa2'
    }
  ]

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        Welcome back, {user?.firstName}!
      </Typography>
      
      <Typography variant="h6" color="text.secondary" gutterBottom>
        Here's what's happening with your CRM today
      </Typography>

      <Grid container spacing={3} sx={{ mt: 2 }}>
        {statCards.map((card, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card>
              <CardContent>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}
                >
                  <Box>
                    <Typography color="text.secondary" gutterBottom>
                      {card.title}
                    </Typography>
                    <Typography variant="h4" component="div">
                      {loading ? '...' : card.value}
                    </Typography>
                  </Box>
                  <Box sx={{ color: card.color }}>
                    {card.icon}
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={3} sx={{ mt: 3 }}>
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Recent Activity
            </Typography>
            <Typography color="text.secondary">
              No recent activity to display. Start by adding contacts and companies!
            </Typography>
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Quick Actions
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Typography color="text.secondary">
                • Add new contact
              </Typography>
              <Typography color="text.secondary">
                • Create company
              </Typography>
              <Typography color="text.secondary">
                • Schedule follow-up
              </Typography>
              <Typography color="text.secondary">
                • Generate report
              </Typography>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  )
}

export default Dashboard