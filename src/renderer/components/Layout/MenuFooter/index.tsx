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
import { useNavigate } from 'react-router-dom';

import { styled, useTheme } from '@mui/material/styles';
import Drawer from '@mui/material/Drawer';
import CssBaseline from '@mui/material/CssBaseline';
import MuiAppBar, { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar';

import { openSystemBrowser } from '../../../utils/electronFunctions';

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

const drawerWidth = 240;

export default function MenuFooter({ progress, open }) {

    const navigate = useNavigate();

    const pages = [
        {
            id: "close-session",
            text: "Cerrar sesión",
            icon: (color) => { return (<ExitToAppIcon sx={{ color: color }} />)}
        },
        {
            id: "sync",
            text: "Sincronizar",
            icon: (color) => { return (<CloudSyncIcon sx={{ color: color }} />)}
        },
        {
            id: "certificate",
            text: "Constancia",
            icon: (color) => { return (<CardMembershipIcon sx={{ color: color }} />)}
        },
        {
            id: "downloads",
            text: "Centro de descargas",
            icon: (color) => { return (<CloudDownloadIcon sx={{ color: color }} />)}
        }
    ]

    const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(null);
    const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(null);

    const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorElNav(event.currentTarget);
    };

    const handleCloseNavMenu = (id) => {
        setAnchorElNav(null);
        let path = "/";
        switch(id){
            case "close-session":


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
      <AppBar open={open} position="absolute" color="primary" sx={{ top: 'auto', bottom: 0 }}>
        <Toolbar disableGutters>
        <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
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
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: 'block', md: 'none' },
              }}
            >
              {pages.map((page) => (
                <MenuItem key={"menu1-" + page.id} onClick={handleCloseNavMenu}>
                    <ListItemIcon>
                        {page.icon("gray")}
                    </ListItemIcon>
                  <Typography textAlign="center">{page.text}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
            {pages.map((page) => (
              <MenuItem key={"menu2-" + page.id} onClick={handleCloseNavMenu}>
                    <ListItemIcon>
                        {page.icon("white")}
                    </ListItemIcon>
                    <Typography textAlign="center">{page.text}</Typography>
              </MenuItem>
            ))}
          </Box>
          <Box sx={{ flexGrow: 0 }}>
            <MenuItem onClick={()=>{
              openSystemBrowser("https://www.google.com")
            }}>
                <ListItemIcon>
                    <LanguageIcon sx={{ color: "white" }} />
                </ListItemIcon>
                <Typography textAlign="center">{"Sitio Web"}</Typography>
              </MenuItem>
          </Box>
        </Toolbar>
      </AppBar>
  );
}