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
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import OverlayLoader from '../../components/OverlayLoader';
import { showToast } from '../../utils/toast';

import { sqlite3All } from '../../helpers/Sqlite3Operations'; 

const Home = () => {
  const [openLoader, setOpenLoader] = React.useState(true);
  const [courses, setCourses] = useState([]);
  const [percentage, setPercentage] = React.useState(0);
  const navigate = useNavigate();
  const authState = useSelector((state) => state);
  const userId = authState.user ? authState.user.nombre_completo : "test"
  const getCourses = async() => {
    const result = await sqlite3All("SELECT * FROM cursos ORDER BY cod_curso ASC");
    console.log(result)
    if (result.OK) {
      if (result.OK.length && result.OK.length > 0) {
          setCourses(result.OK);

        const sublessonsHistory = await sqlite3All(`SELECT id, (SELECT COUNT(subleccion_id) FROM sublecciones_vistas WHERE sublecciones_vistas.subleccion_id = sublecciones.id AND user_id = '${userId}') AS viewed 
          FROM sublecciones
        `);
  
        if (sublessonsHistory.OK && sublessonsHistory.OK.length > 0){
          const views = sublessonsHistory.OK.filter(ele => ele.viewed > 0).length;
          setPercentage(parseInt((views * 100) / sublessonsHistory.OK.length))
        }
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
    getCourses();
  }, [])

    return (
        <React.Fragment>
            <CssBaseline />
            <Container disableGutters className="f-container fixed-hf">
            <OverlayLoader open={openLoader} />
                <Box className="header">
                    <MenuHeader 
                      progress={percentage}
                    />
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
                                <Grid item xs={4} key={index}>
                                  <ListCard cardData={card} onCardClick={()=>{
                                    navigate("/course/" + card.cod_curso);
                                  }}/>
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