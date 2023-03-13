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

const Home = () => {

    return (
        <React.Fragment>
            <CssBaseline />
            <Container disableGutters className="f-container fixed-hf">
                <Box className="header">
                    <MenuHeader />
                </Box>
                
                <Box className="main">
                    <div className='courses-container'>
                        <div className='title'>
                        <Typography variant="h4" color="text.primary" gutterBottom>
                            Cursos
                        </Typography>
                        </div>
                        <div className='list-container'>
                            <Grid container columns={{ xs: 4, md: 12 }} spacing={2}>
                                <Grid item xs={4}>
                                    <ListCard />
                                </Grid>
                                <Grid item xs={4}>
                                    <ListCard />
                                </Grid>
                                <Grid item xs={4}>
                                    <ListCard />
                                </Grid>
                            </Grid>
                        </div>
                    </div>

                    
                </Box>
                <Box className="footer">
                    <MenuFooter />
                </Box>
              
            </Container>
        </React.Fragment>
    )
}

export default Home;