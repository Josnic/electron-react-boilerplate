import * as React from 'react';
import { styled, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import CssBaseline from '@mui/material/CssBaseline';
import MuiAppBar, { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ListItem from '@mui/material/ListItem';
import Grid from '@mui/material/Grid';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import HomeIcon from '@mui/icons-material/Home';
import MenuHeader from '../../components/Layout/MenuHeader';
import MenuFooter from '../../components/Layout/MenuFooter';
//https://github.com/mui/material-ui/blob/v5.11.16/docs/data/material/getting-started/templates/dashboard/Dashboard.tsx
const drawerWidth = 300;
import ListCard from '../../components/ListCard';
import MenuTreeView from './components/MenuTreeView';
import ContentRenderer from 'renderer/components/ContentRenderer';
import FormQuestion from '../../components/FormQuestion';
import RadioButtonTest from '../../components/Tests/RadioButtonTest';
import InputNumberTest from '../../components/Tests/InputNumberTest'

import { useNavigate, useParams } from 'react-router-dom';

import { sqlite3All } from '../../helpers/Sqlite3Operations'

import "./styles.scss";
interface Props {
  window?: () => Window;
}

const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })<{
  open?: boolean;
}>(({ theme, open }) => ({
  flexGrow: 1,
  padding: theme.spacing(3),
  transition: theme.transitions.create('margin', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  marginLeft: `-${drawerWidth}px`,
  ...(open && {
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: 0,
  }),
}));

interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
}

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

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
  justifyContent: 'flex-end',
}));

export default function CourseHome() {
  const theme = useTheme();
  const [open, setOpen] = React.useState(true);
  const [showUnits, setShowUnits] = React.useState(true);
  const [units, setUnits] = React.useState([]);
  const [dataMenu, setDataMenu] = React.useState([]);
  const [htmlContent, setHtmlContent] = React.useState(null);
  const [formData, setFormData] = React.useState(null);
  const [testData, setTestData] = React.useState(null);
  const menuTreeViewRef = React.useRef();
  const navigate = useNavigate();
  const handleDrawerOpen = () => {
    setOpen(true);
  };
  const [nextNodeId, setNextNodeId] = React.useState(null);
  const { courseCode } = useParams();

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const loadMenu = async() => {
    const units = await sqlite3All(`SELECT *, imagen_unid AS imagen, video AS videos FROM unidades WHERE cod_curso = '${courseCode}' ORDER BY orden ASC`);
    let dataMenu = [];

    if (units.OK){
      dataMenu = units.OK;
      setUnits(units.OK);
      for (let i = 0; i < dataMenu.length; i++) {
        const lessons = await sqlite3All(`SELECT *, objetivo AS contenido  FROM lecciones WHERE cod_unidad = '${dataMenu[i].cod_unidad}' ORDER BY cod_leccion ASC`);
        if (lessons.OK){
          for (let j = 0; j < lessons.OK.length; j++) {
            const sublessons = await sqlite3All(`SELECT *, CASE WHEN test_id IS NULL THEN '' ELSE (SELECT test_tipo FROM tests WHERE cod_test = test_id) END AS test_tipo 
                                                 FROM sublecciones WHERE cod_leccion = '${lessons.OK[j].cod_leccion}' ORDER BY orden ASC`);
            if (sublessons.OK){
              lessons.OK[j]["sublessons"] = sublessons.OK;
            }
          }
        }
        dataMenu[i]["lessons"] = lessons.OK;
      }
    }
    setDataMenu(dataMenu);
    console.log(dataMenu)
  }

  const renderContent = async(type, data) => {
    console.log(type, data)
    setShowUnits(false);

    if (data.cod_formulario && data.cod_formulario != ""){
      setHtmlContent(null);
      setTestData(null);
      setFormData(data);
    }else if (data.test_id && data.test_id != ""){
      setFormData(null);
      setHtmlContent(null);
      setTestData(data);
    }else{
      setFormData(null);
      setTestData(null);
      setHtmlContent({
        type: type,
        data: data
      })
    }
  }

  React.useEffect(()=>{
    loadMenu();
  }, []);

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar position="fixed" open={open}>
        <MenuHeader
          handleDrawerOpen={handleDrawerOpen}
          open={open}
          isCourse={true}
        />
      </AppBar>
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
          },
        }}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile.
        }}
        variant="persistent"
        anchor="left"
        open={open}
      >
        <DrawerHeader>
          <IconButton style={{ marginRight: "50%" }} onClick={()=>{
            navigate("/home");
          }}>
            <HomeIcon /> Inicio
          </IconButton>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === 'ltr' ? (
              <ChevronLeftIcon />
            ) : (
              <ChevronRightIcon />
            )}
          </IconButton>
        </DrawerHeader>
        <Divider />
        <MenuTreeView 
          data={dataMenu} 
          onClickItem={(type, data, nextNodeIdData) => {
            if (nextNodeIdData){
              setNextNodeId(nextNodeIdData);
            }else{
              setNextNodeId(null);
            }
            renderContent(type, data)
          }}
          ref={menuTreeViewRef} 
        />
      </Drawer>
      <Main open={open} className="f-container fixed-hf">
        <DrawerHeader />
        <Box className="main">
          {
            showUnits ? (
              <div className='list-units-container'>
                <Grid container columns={{ xs: 4, md: 12 }} spacing={2}>
                  {units.map((card, index) => (
                    <Grid item xs={4} key={index}>
                      <ListCard cardData={card} onCardClick={()=>{
                        menuTreeViewRef.current.setSelectedNode(`UNIT-${index}-${card.cod_unidad}`)
                      }}/>
                    </Grid>
                  ))}
                </Grid>
            </div>
            ):(
              <>
              {
                htmlContent ? (
                  <ContentRenderer 
                    data={htmlContent.data} 
                    type={htmlContent.type} 
                    courseCode={courseCode}
                    onContinue={()=> {
                      if (nextNodeId){
                        menuTreeViewRef.current.setSelectedNode(nextNodeId);
                      }
                    }} 
                  />
                ):(
                  null
                )
              }
              {
                formData ? (
                  <FormQuestion 
                    data={formData} 
                    courseCode={courseCode}
                  />
                ):(
                  null
                )
              }
              {
                testData && testData.test_tipo == "RADIO" ? (
                  <RadioButtonTest 
                    data={testData} 
                    courseCode={courseCode}
                  />
                ):(
                  null
                )
              }
              {
                testData && testData.test_tipo == "INPUTN" ? (
                  <InputNumberTest 
                    data={testData} 
                    courseCode={courseCode}
                  />
                ):(
                  null
                )
              }
              </>
            )
          }
        </Box>

        <Box className="footer">
          <MenuFooter open={open} isCourse={true} />
        </Box>
      </Main>
    </Box>
  );
}
