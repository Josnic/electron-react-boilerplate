import * as React from 'react';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import ArticleIcon from '@mui/icons-material/Article';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import CloudSyncIcon from '@mui/icons-material/CloudSync';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import CardMembershipIcon from '@mui/icons-material/CardMembership';
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';
import LanguageIcon from '@mui/icons-material/Language';
import { ToastContainer } from 'react-toastify';
import { styled, useTheme } from '@mui/material/styles';
import OverlayLoader from '../../OverlayLoader';
import Drawer from '@mui/material/Drawer';
import CssBaseline from '@mui/material/CssBaseline';
import MuiAppBar, { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar';
import { useDispatch, useSelector } from 'react-redux';
import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css
import parse from 'html-react-parser';
import { useNavigate } from 'react-router-dom';
import { formatDate, getMysqlDate } from '../../../utils/generals';
import AuthTypes from '../../../redux/constants';
import { openSystemBrowser, getPathCourseResource } from '../../../utils/electronFunctions';
import { showToast } from '../../../utils/toast';
import { sqlite3Run, sqlite3All } from '../../../helpers/Sqlite3Operations';
import { syncData } from '../../../helpers/sync';
import AlertModal from '../../Tests/components/AlertModal';
import exportDiscPdf from '../../../helpers/ExportPDF';
const drawerWidth = 300;

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

export default function MenuFooter({ isCourse, open, courseCode, legalPage, website }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const authState = useSelector((state) => state);
  const [openLoader, setOpenLoader] = React.useState(false);
  const [showLegal, setShowLegal] = React.useState(false);
  const closeSession = () => {
    dispatch({
      type: AuthTypes.LOGOUT,
    });
    navigate('/');
  };

  const checkLesson = (lesson) => {
    return lesson.sublessons &&
          Array.isArray(lesson.sublessons) &&
          lesson.sublessons.length > 0 &&
          lesson.sublessons.filter(ele => ele.viewed == 0).length == 0
  }

  const checkUnit = (unit) => {
    return unit.lessons &&
          Array.isArray(unit.lessons) &&
          unit.lessons.length > 0 &&
          unit.lessons.filter(ele => ele.viewed == 0).length == 0
  }

  const getContance = async() => {
    setOpenLoader(true);
    const constancia_porc_lecciones = [];
    const constancia_porc_formularios = [];
    const constancia_porc_tests = [];
    const userId = authState && authState.auth.user ? authState.auth.user.email : "test";
    let sublessonsEV = [];
    const units = await sqlite3All(`SELECT *, 0 AS viewed, imagen_unid AS imagen, video AS videos FROM unidades WHERE cod_curso = '${courseCode}' ORDER BY orden ASC`);
    if (units.OK){
      const dataMenu = units.OK;
      for (let i = 0; i < dataMenu.length; i++) {
        const lessons = await sqlite3All(`SELECT *, objetivo AS contenido, 0 AS viewed  FROM lecciones WHERE cod_unidad = '${dataMenu[i].cod_unidad}' ORDER BY cod_leccion ASC`);
        if (lessons.OK){
          for (let j = 0; j < lessons.OK.length; j++) {
            const sublessons = await sqlite3All(`SELECT *, '${dataMenu[i].cod_unidad}' AS cod_unidad, 
            (SELECT COUNT(subleccion_id) FROM sublecciones_vistas WHERE sublecciones_vistas.subleccion_id = sublecciones.id AND user_id = '${userId}') AS viewed,
            CASE WHEN test_id IS NULL THEN '' ELSE (SELECT test_tipo FROM tests WHERE cod_test = test_id) END AS test_tipo 
            FROM sublecciones 
            WHERE cod_leccion = '${lessons.OK[j].cod_leccion}' ORDER BY orden ASC`);
            if (sublessons.OK){
              sublessonsEV = sublessons.OK.filter(ele => ele.tipo == "EV");
              lessons.OK[j]["sublessons"] = sublessons.OK;
              lessons.OK[j]["viewed"] = checkLesson(lessons.OK[j]) ? 1 : 0;
            }else{
              lessons.OK[j]["sublessons"] = [];
              lessons.OK[j]["viewed"] = 1;
            }
          }
          dataMenu[i]["lessons"] = lessons.OK;
          dataMenu[i]["viewed"] = checkUnit(dataMenu[i])
        }else{
          dataMenu[i]["lessons"] = [];
          dataMenu[i]["viewed"] = 1;
        }
      }

      const configuration = await sqlite3All(`SELECT * FROM configuracion WHERE cod_curso = '${courseCode}' LIMIT 1`);
      console.log(configuration)
      if (configuration.OK && configuration.OK.length > 0){
        const courseconfiguration = configuration.OK[0];
        for (let i = 0; i < dataMenu.length; i++) {
          if (dataMenu[i].lessons.length > 0){
            for (let j = 0; j < dataMenu[i].lessons.length; j++) {
              if (dataMenu[i].lessons[j].sublessons.length > 0){
                const sublessons = dataMenu[i].lessons[j].sublessons;
                const tests = sublessons.filter(ele => ele.test_id && ele.test_id != "");
                const forms = sublessons.filter(ele => ele.cod_formulario && ele.cod_formulario != "");
                const restlessons = sublessons.filter(ele => !ele.cod_formulario && !ele.test_id);
                if (restlessons.length > 0){
                  constancia_porc_lecciones.push( (restlessons.filter(ele => ele.viewed == 1).length * 100 ) /  restlessons.length);
                }
                if (forms.length > 0){
                  constancia_porc_formularios.push( (forms.filter(ele => ele.viewed == 1).length * 100 ) /  forms.length);
                }
                if (tests.length > 0){
                  constancia_porc_tests.push((tests.filter(ele => ele.viewed == 1).length * 100 ) /  tests.length);
                }
              }
            }
          }
        }

        if (courseconfiguration.constancia_porc_lecciones <= parseInt(constancia_porc_lecciones.reduce((accumulator, currentValue) => { return accumulator + currentValue;}, 0))  &&
          courseconfiguration.constancia_porc_formularios <= parseInt(constancia_porc_formularios.reduce((accumulator, currentValue) => { return accumulator + currentValue;}, 0)) &&
          courseconfiguration.constancia_porc_tests <= parseInt(constancia_porc_tests.reduce((accumulator, currentValue) => { return accumulator + currentValue;}, 0)) &&
          sublessonsEV.filter(ele => ele.viewed == 0) == 0
        ){
          const filePath = `/constancias.asar/${courseCode}.pdf`

          const userFullName = authState && authState.auth.user ? authState.auth.user.nombre_completo : 'test';
          const today = formatDate(new Date(getMysqlDate())).split("-");
          const months = [
            "Enero", "Febrero", "Marzo",
            "Abril", "Mayo", "Junio", "Julio",
            "Agosto", "Septiembre", "Octubre",
            "Noviembre", "Diciembre"
          ]

          const customFonts = [
            {
              name: "BonheurRoyale-Regular",
              font: '/commonassets/BonheurRoyale-Regular.ttf'
            }
          ]

          const objText = {
            nombre: {
              value: userFullName,
              fontFamily: "BonheurRoyale-Regular",
              textAlign: "Center",
              fontSize: 25
            },
            identificacion: {
              value: authState && authState.auth.user ? authState.auth.user.documento : 'test',
              textAlign: "Center"
            },
            dia: {
              value: today[2],
              textAlign: "Center"
            },
            mes: {
              value: months[parseInt(today[1]) - 1].toLowerCase(),
              textAlign: "Center"
            },
            ano: {
              value: today[0],
              textAlign: "Center"
            },
          }

          exportDiscPdf(objText, [], filePath, customFonts);
        }else{
          showToast('No es posible generar la constancia ya que te falta realizar actividades y/o Evaluaciones.');
        }

      }else{
        showToast('Ocurrió un error. Intenta nuevamente.');
      }

    }else{
      showToast('Curso sin contenido.');
    }
    setOpenLoader(false);
  }

  const pages = [
    {
      id: 'close-session',
      text: 'Cerrar sesión',
      hidden: false,
      icon: (color) => {
        return <ExitToAppIcon sx={{ color: color }} />;
      },
    },
    {
      id: 'sync',
      text: 'Sincronizar',
      hidden: false,
      icon: (color) => {
        return <CloudSyncIcon sx={{ color: color }} />;
      },
    },
    {
      id: 'certificate',
      text: 'Constancia',
      hidden: isCourse ? false : true,
      icon: (color) => {
        return <CardMembershipIcon sx={{ color: color }} />;
      },
    },
    {
      id: 'legal',
      text: 'Página legal',
      hidden: false,
      icon: (color) => {
        return <ArticleIcon sx={{ color: color }} />;
      },
    },
    /*{
      id: 'downloads',
      text: 'Centro de descargas',
      hidden: isCourse ? false : true,
      icon: (color) => {
        return <CloudDownloadIcon sx={{ color: color }} />;
      },
    }*/
  ];

  const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(
    null
  );
  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(
    null
  );

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleClickNavMenu = async(id) => {
    setAnchorElNav(null);
    switch (id) {
      case 'close-session':
        closeSession();
        break;

      case 'sync':
        confirmAlert({
          title: 'Confirmar',
          message: '¿Deseas realizar el proceso de sincronización? Debes tener una conexión a internet estable. Este proceso puede durar algunos minutos.',
          buttons: [
            {
              label: 'Sincronizar',
              onClick: async() => {
                setOpenLoader(true);
                const userId = authState && authState.auth.user ? authState.auth.user.email : "test";
                try{
                  const result = await syncData(userId);
                  setOpenLoader(false);
                  if (result.error){
                    showToast(result?.error, 'error');
                  }else{
                    showToast("Sincronización finalizada con éxito.", "success")
                  }
                }catch(e){
                  console.log(e)
                  setOpenLoader(false);
                  showToast("Ocurrió un error desconocido. Intenta nuevamente.", 'error');
                }
                
              }
            },
            {
              label: 'Cancelar',
              onClick: () => {

              }
            }
          ]
        });
        break;

      case 'certificate':
        await getContance();
        break;

        case 'legal':
          if(legalPage){
            setShowLegal(true);
          }
          break;

      case 'downloads':
        break;
    }
  };

  return (
    <AppBar
      open={open}
      position="fixed"
      color="primary"
      sx={{ top: 'auto', bottom: 0 }}
    >
      <OverlayLoader open={openLoader} />
      <Toolbar disableGutters>
        <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
          <IconButton size="large" onClick={handleOpenNavMenu} color="inherit">
            <MenuIcon />
          </IconButton>
          <Menu
            key={'menu-appbar'}
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
              <div key={page.id}>
                {!page.hidden ? (
                  <MenuItem
                    key={'menu1-' + page.id}
                    onClick={() => {
                      handleClickNavMenu(page.id);
                    }}
                  >
                    <ListItemIcon key={'list1-' + page.id}>
                      {page.icon('gray')}
                    </ListItemIcon>
                    <Typography textAlign="center">{page.text}</Typography>
                  </MenuItem>
                ) : null}
              </div>
            ))}
          </Menu>
        </Box>
        <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
          {pages.map((page) => (
            <div key={page.id}>
              {!page.hidden ? (
                <MenuItem
                  key={'menu2-' + page.id}
                  onClick={() => {
                    handleClickNavMenu(page.id);
                  }}
                >
                  <ListItemIcon key={'list2-' + page.id}>
                    {page.icon('white')}
                  </ListItemIcon>
                  <Typography textAlign="center">{page.text}</Typography>
                </MenuItem>
              ) : null}
            </div>
          ))}
        </Box>
        <Box sx={{ flexGrow: 0 }}>
          <MenuItem
            key={'menu-browser'}
            onClick={() => {
              openSystemBrowser(website);
            }}
          >
            <ListItemIcon key="unique-open">
              <LanguageIcon sx={{ color: 'white' }} />
            </ListItemIcon>
            <Typography sx={{ flexGrow: 0, display: { xs: 'none', md: 'flex' } }} textAlign="center">{'Sitio Web'}</Typography>
          </MenuItem>
        </Box>
      </Toolbar>
      <ToastContainer />
      <AlertModal
          open={showLegal}
          title={''}
          content={legalPage ? parse(legalPage) : ''}
          buttonText={'Cerrar'}
          onButtonClick={() => {
            setShowLegal(false);
          }}
        />
    </AppBar>
  );
}
