import * as React from 'react';
import { styled } from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Avatar from '@mui/material/Avatar';
import LinearProgress, { linearProgressClasses } from '@mui/material/LinearProgress';
import CardHeader from '@mui/material/CardHeader';
import MenuIcon from '@mui/icons-material/Menu';

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


export default function MenuHeader({ username, progress, isCourse, handleDrawerOpen, open }) {
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
            src="https://mui.com/static/images/avatar/1.jpg"
            sx={{ display: { xs: 'none', md: 'flex' }, width: 156, height: 56 }}
          />
          <Box sx={{ flexGrow: 0.5 }} />
          <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
            {
               isCourse ? (
                <Avatar
                  variant="square"
                  src="https://mui.com/static/images/avatar/1.jpg"
                  sx={{ display: { xs: 'none', md: 'flex' }, width: 56, height: 56 }}
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
                      <Avatar alt="Remy Sharp" src="https://mui.com/static/images/avatar/2.jpg" />
                    </IconButton>
                }
                title={"nombre de usuario"}
                subheader={<NumberLinearProgress value={50} />}
              />
          </Box>
        </Toolbar>
      </AppBar>
  );
}