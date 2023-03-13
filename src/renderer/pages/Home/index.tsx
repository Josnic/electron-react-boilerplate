import React, { useEffect, useState } from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import Container from '@mui/material/Container';
import MenuHeader from '../../components/MenuHeader';
import MenuFooter from '../../components/MenuFooter';

const Home = () => {

    return (
        <React.Fragment>
            <CssBaseline />
            <Container className='generic-container'>
                <MenuHeader />
                <MenuFooter />
            </Container>
        </React.Fragment>
    )
}

export default Home;