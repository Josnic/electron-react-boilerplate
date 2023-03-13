import React, { useEffect, useState } from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import Container from '@mui/material/Container';
import MenuHeader from '../../components/MenuHeader';
import MenuFooter from '../../components/MenuFooter';
import Box from '@mui/material/Box';

const Home = () => {

    return (
        <React.Fragment>
            <CssBaseline />
            <Container disableGutters className="f-container fixed-hf">
                <Box className="header">
                    <MenuHeader />
                </Box>
                
                <Box className="main">


                </Box>
                <Box className="footer">
                    <MenuFooter />
                </Box>
              
            </Container>
        </React.Fragment>
    )
}

export default Home;