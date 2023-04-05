import React, { useEffect, useState } from 'react';
import { styled } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Container from '@mui/material/Container';
import MenuHeader from '../../components/Layout/MenuHeader';
import MenuFooter from '../../components/Layout/MenuFooter';
import Box from '@mui/material/Box';
import ListCard from '../../components/ListCard';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import './styles.scss';

import NewConcept from '../../components/BarChart';

const Course = () => {

    return (
        <React.Fragment>
            <CssBaseline />
            <Container disableGutters className="f-container fixed-hf">
                <Box className="header">
                    <MenuHeader />
                </Box>
                
                <Box className="main">
                <div className='course-container'>
                    <Grid container columns={{ xs: 12, md: 12 }} spacing={2}>
                        <Grid item xs={3} className='menu-container'>
                            
                        </Grid>
                        <Grid item xs={9} className='lesson-container'>
                            <NewConcept data={null} />
                        </Grid>
                        
                    </Grid>
                </div>
                    
                </Box>
                <Box className="footer">
                    <MenuFooter />
                </Box>
              
            </Container>
        </React.Fragment>
    )
}

export default Course;