import React from 'react'
import MenuHeader from '../../components/MenuHeader';
import { Box } from '@mui/material';

const About = () => {
  return (
    <Box m ="20px">
      <Box display="flex" justifyContent="space-between" alignItems="center">
      <MenuHeader title="About" subtitle=" TeamTuner"/>
      
        </Box>
        

<Box
  sx={{
    position: 'absolute',
    top: '50%',
    left: '62%',
    transform: 'translate(-50%, -50%)', // Adjusts to the exact center
  }}
>
  <h3>A project by Tasnia Iffat and Farhan Ibne Shahid</h3>
</Box>

      
    </Box>
  )
}

export default About;