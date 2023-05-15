import * as React from 'react';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Avatar from '@mui/material/Avatar';
import LinearProgress, { linearProgressClasses } from '@mui/material/LinearProgress';
import CardHeader from '@mui/material/CardHeader';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import CloudSyncIcon from '@mui/icons-material/CloudSync';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import CardMembershipIcon from '@mui/icons-material/CardMembership';
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';
import LanguageIcon from '@mui/icons-material/Language';
import { styled, useTheme } from '@mui/material/styles';
import Drawer from '@mui/material/Drawer';
import CssBaseline from '@mui/material/CssBaseline';
import MuiAppBar, { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar';

import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import AuthTypes from '../../../redux/constants';
import { openSystemBrowser } from '../../../utils/electronFunctions';
const drawerWidth = 240;

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})<AppBarProps>(({ theme, open }) => ({
  transition: theme.transitions.create(['margin', 'width'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: `${drawerWidth}px`,
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

export default function MenuFooter({ isCourse, open }) {

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const closeSession = () =>{
    dispatch({
      type: AuthTypes.LOGOUT
    });
    navigate("/");
  }

    const pages = [
        {
            id: "close-session",
            text: "Cerrar sesión",
            hidden: false,
            icon: (color) => { return (<ExitToAppIcon sx={{ color: color }} />)}
        },
        {
            id: "sync",
            text: "Sincronizar",
            hidden: false,
            icon: (color) => { return (<CloudSyncIcon sx={{ color: color }} />)}
        },
        {
            id: "certificate",
            text: "Constancia",
            hidden: isCourse ? false : true,
            icon: (color) => { return (<CardMembershipIcon sx={{ color: color }} />)}
        },
        {
            id: "downloads",
            text: "Centro de descargas",
            hidden: isCourse ? false : true,
            icon: (color) => { return (<CloudDownloadIcon sx={{ color: color }} />)}
        }
    ]

    const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(null);
    const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(null);

    const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorElNav(event.currentTarget);
    };

    const handleClickNavMenu = (id) => {
        setAnchorElNav(null);
        let path = "/";
        switch(id){
            case "close-session":
              closeSession();
            break;

            case "sync":


            break;

            case "certificate":


            break;

            case "downloads":


            break;
        }
        navigate(path);
    };


  return (
      <AppBar open={open} position="fixed" color="primary" sx={{ top: 'auto', bottom: 0 }}>
        <Toolbar disableGutters>
        <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }} key={1}>
            <IconButton
              size="large"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              key={"menu-appbar"}
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              open={Boolean(anchorElNav)}
              onClose={handleClickNavMenu}
              sx={{
                display: { xs: 'block', md: 'none' },
              }}
            >
              {pages.map((page) => (
                <div>
                {
                  !page.hidden ? (
                    <MenuItem key={"menu1-" + page.id} onClick={()=>{handleClickNavMenu(page.id)}}>
                      <ListItemIcon key={"list1-" + page.id}>
                        {page.icon("gray")}
                      </ListItemIcon>
                      <Typography textAlign="center">{page.text}</Typography>
                    </MenuItem>
                  ):(
                    null
                  )
                }
                </div>
              ))}
            </Menu>
          </Box>
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }} key={2}>
            {pages.map((page) => (
              <>
                {
                  !page.hidden ? (
                    <MenuItem key={"menu2-" + page.id} onClick={()=>{handleClickNavMenu(page.id)}}>
                        <ListItemIcon key={"list2-" + page.id}>
                          {page.icon("white")}
                        </ListItemIcon>
                        <Typography textAlign="center">{page.text}</Typography>
                    </MenuItem>
                  ):(
                    null
                  )
                }
              </>
            ))}
          </Box>
          <Box sx={{ flexGrow: 0 }} key={3}>
            <MenuItem key={"menu-browser"} onClick={()=>{
              openSystemBrowser("https://www.google.com")
            }}>
              <ListItemIcon key="unique-open">
                <LanguageIcon sx={{ color: "white" }} />
              </ListItemIcon>
              <Typography textAlign="center">{"Sitio Web"}</Typography>
            </MenuItem>
          </Box>
        </Toolbar>
      </AppBar>
  );
}