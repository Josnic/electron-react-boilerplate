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
import { ToastContainer } from 'react-toastify';

import OverlayLoader from '../../components/OverlayLoader';
import { showToast } from '../../utils/toast';

import { sqlite3All } from '../../helpers/Sqlite3Operations'; 

const Home = () => {
  const [openLoader, setOpenLoader] = React.useState(false);
  const [courses, setCourses] = useState([]);
    const getCourses = async() => {
      const result = await sqlite3All("SELECT * FROM courses ORDWER BY id DESC");
      if (result.OK) {
        if (result.OK.length && result.OK.length > 0) {
            setCourses(result.OK);
        }else{
          showToast("No se encontraron cursos disponibles");
        }
      }else{
        console.log(result)
        showToast("Ocurrió un error. Intenta nuevamente.", "error");
      }
      setOpenLoader(false);
    }

  useEffect(()=>{
    setOpenLoader(true);
    getCourses();
  }, [])

    return (
        <React.Fragment>
            <CssBaseline />
            <Container disableGutters className="f-container fixed-hf">
            <OverlayLoader open={openLoader} />
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
                              {courses.map((card, index) => (
                                <Grid item xs={4}>
                                  <ListCard course={card} />
                                </Grid>
                              ))}
                            </Grid>
                        </div>
                    </div>

                    
                </Box>
                <Box className="footer">
                    <MenuFooter />
                </Box>
                <ToastContainer limit={3} autoClose={3000} />
            </Container>
        </React.Fragment>
    )
}

export default Home;