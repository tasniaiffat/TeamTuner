import React from 'react'
import MenuHeader from '../../components/MenuHeader';
import { Box } from '@mui/material';

const Dashboard = () => {
  return (
    <Box m ="20px">
      <Box display="flex" justifyContent="space-between" alignItems="center">
      <MenuHeader title="DASHBOARD" subtitle="Welcome to your Dashboard!"/>
        </Box>
      
    </Box>
  )
}

export default Dashboard;