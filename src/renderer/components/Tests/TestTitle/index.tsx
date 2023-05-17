import React, { useEffect, useState } from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';

const TestTitle = ({ title, component, color, barColor }) => {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" color={barColor ? barColor : 'primary'}>
        <Toolbar>
          <Typography
            variant="h6"
            component={component ? component : 'div'}
            color={color ? color : 'primary'}
            sx={{ flexGrow: 1 }}
          >
            {title}
          </Typography>
        </Toolbar>
      </AppBar>
    </Box>
  );
};

export default TestTitle;
