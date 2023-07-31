import * as React from 'react';
import { styled } from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Avatar from '@mui/material/Avatar';
import { useSelector } from 'react-redux';
import LinearProgress, { linearProgressClasses } from '@mui/material/LinearProgress';
import CardHeader from '@mui/material/CardHeader';
import MenuIcon from '@mui/icons-material/Menu';
import { getPathCourseResource } from '../../../utils/electronFunctions';

const BorderLinearProgress = styled(LinearProgress)(({ theme }) => ({
  height: 12,
  borderRadius: 5,
  borderColor: "white",
  [`&.${linearProgressClasses.colorPrimary}`]: {
    border: "1px solid white",
    backgroundColor: theme.palette.primary.main,
  },
  [`& .${linearProgressClasses.bar}`]: {
    borderRadius: 5,
    border: "1px solid white",
    backgroundColor: "white"
  },
}));

const NumberLinearProgress = (props) =>{
  return (
    <Box display="flex" alignItems="center">
      <Box width="100%" mr={1}>
        <BorderLinearProgress variant="determinate" value={props.value} />
      </Box>
      <Typography variant="body2" color="white">{`${
        props.value
      }%`}</Typography>
    </Box>
  );
}


export default function MenuHeader({ progress, isCourse, courseCode, handleDrawerOpen, open }) {
  const authState = useSelector((state) => state);
  const userName = authState.auth.user ? authState.auth.user.nombre_completo : "test";
  const [imgCourse, setImageCourse] = React.useState(null);
  const [imgApp, setImageApp] = React.useState(null);
  const getImageCourse = async() => {
    const imgPath = await getPathCourseResource(courseCode + "/img.asar/logo_curso.png");
    setImageCourse(imgPath)
  }

  const getImageApp = async() => {
    const imgPath = await getPathCourseResource("/commonassets/logo.png");
    setImageApp(imgPath)
  }
  const processNameForAvatar = (fullName) => {
    const arName = fullName.split(" ");
    if (arName.length == 0){
      return "U";
    }

    if (arName.length == 1){
      return arName[0][0] && arName[0][0] != "" ? (arName[0][0]).toUpperCase() : "U";
    }

    if (arName.length >= 2){
      return arName[0][0] && arName[0][0] != "" ? (arName[0][0]).toUpperCase() : "U"
      + arName[1][0] && arName[1][0] != "" ? (arName[1][0]).toUpperCase() : "";
    }
  }

  React.useEffect(()=>{
    getImageApp();
    if (isCourse) getImageCourse();
  }, [])
  return (
      <AppBar position="absolute">
        <Toolbar disableGutters>
          {
            isCourse ? (
              <IconButton
                color="inherit"
                aria-label="open drawer"
                onClick={handleDrawerOpen}
                edge="start"
                sx={{ marginLeft:'5px', mr: 2, ...(open && { display: 'none' }) }}
              >
                <MenuIcon />
              </IconButton>
            ):(
              null
            )
          }
          <Avatar
            variant="square"
            src={imgApp}
            sx={{ display: { xs: 'none', md: 'flex' }, width: 156, height: 'auto' }}
          />
          <Box sx={{ flexGrow: 0.5 }} />
          <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
            {
               isCourse && imgCourse ? (
                <Avatar
                  variant="square"
                  src={imgCourse}
                  sx={{ display: { xs: 'none', md: 'flex' }, width: 150, height: 'auto' }}
                />
               ):(
                null
               )
            }
          </Box>
          <Box sx={{ flexGrow: 0.5 }} />
          <Box sx={{ flexGrow: 0 }}>
              <CardHeader
                avatar={
                    <IconButton sx={{ p: 0, display: { md: 'flex' } }}>
                      <Avatar>{processNameForAvatar(userName)}</Avatar>
                    </IconButton>
                }
                title={userName}
                subheader={<NumberLinearProgress value={progress} />}
              />
          </Box>
        </Toolbar>
      </AppBar>
  );
}