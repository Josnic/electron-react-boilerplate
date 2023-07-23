import React, { useEffect, useState, useRef } from 'react';
import Grid from '@mui/material/Grid';
import DOMPurify from 'dompurify';
import TextField from '@mui/material/TextField';
import ButtomCustom from '../../ButtonRound';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import RadioGroup from '@mui/material/RadioGroup';
import Radio from '@mui/material/Radio';
import FormControlLabel from '@mui/material/FormControlLabel';
import LiveHelpIcon from '@mui/icons-material/LiveHelp';
import IconButton from '@mui/material/IconButton';
import Link from '@mui/material/Link';
import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';
import Badge from '@mui/material/Badge';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import CommentIcon from '@mui/icons-material/Comment';
import Tooltip, { TooltipProps, tooltipClasses } from '@mui/material/Tooltip';
import NumericInput from 'react-numeric-input';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Divider from '@mui/material/Divider';
import TestTitle from '../TestTitle';
import parse from 'html-react-parser';
import { getPathCourseResource } from '../../../utils/electronFunctions';
import { sqlite3All } from '../../../helpers/Sqlite3Operations';
import AlertModal from '../components/AlertModal';
import { ToastContainer } from 'react-toastify';
import OverlayLoader from '../../OverlayLoader';
import { showToast } from '../../../utils/toast';
import RadarChart from '../../RadarChart';
import '../styles.scss';

const InputNumberTest = ({ data, courseCode }) => {
  const answers = useRef(Array(0).fill({
    category: '',
    value: 0
  }));
  const [questions, setQuestions] = useState(Array(0).fill('Pregunta'));
  const [openModalWelcome, setOpenModalWelcome] = useState(true);
  const [openModalEnd, setOpenModalEnd] = useState(false);
  const [categories, setCategories] = useState([]);
  const [currentTest, setTest] = useState(null);
  const [open, setOpen] = useState(false);
  const [isOpenRadarModal, setIsOpenRadarModal] = useState(false);
  const [modalInitData, setModalInitData] = useState({
    title: '',
    content: '',
    buttonText: '',
  });

  const [modalEndData, setModalEndData] = useState({
    title: '',
    content: '',
    buttonText: '',
  });

  const [serieRadarChart, setSerieRadarChart] = useState([{
    name: 'Área',
    data: [],
  }]);

  const [listEndModalSituacional, setListEndModalSituacional] = useState([]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log((event.target as HTMLInputElement).value);
  };

  const handleAnswerChange = (valueAsNumber, valueAsString, input) => {
    const nameParts = input.name.split("-");
    if ((valueAsNumber < currentTest.rango_inicial && questions[parseInt(nameParts[2])].permite_cero == 0) || valueAsNumber > currentTest.rango_final){
      showToast("Valor no válido");
    }else{
      const newAnswers = [...answers.current];
      newAnswers[parseInt(nameParts[2])] = {
        category: nameParts[0],
        value: valueAsNumber
      };
      answers.current = newAnswers;
      console.log(answers.current)
    }
  };

  const SituationalResponse = () => {
    const preventDefault = (event: React.SyntheticEvent) =>
      event.preventDefault();

    return (
      <>
        <List
          sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}
        >
          {listEndModalSituacional.map((value, index) => (
            <ListItem
              key={index}
              disableGutters
              secondaryAction={<Badge badgeContent={`${value.average}`} color="primary"></Badge>}
            >
              <ListItemText primary={`${value.category}`} />
            </ListItem>
          ))}
        </List>
        <Box
          sx={{
            typography: 'body1',
            '& > :not(style) ~ :not(style)': {
              ml: 2,
            },
            textAlign: "center"
          }}
          onClick={preventDefault}
        >
          <Link onClick={setIsOpenRadarModal} href="#">Ver Mapa</Link>
        </Box>
      </>
    );
  };

  const resultForSituacional = () => {
    const arForList = [];
    console.log(answers.current)
    for (let i = 0; i < categories.length; i++){
      let arValues = [];
      for (let j = 0; j < answers.current.length; j++){

        if (answers.current[j].category == categories[i]) {
          if (answers.current[j].value == 0){
            if (questions[j].permite_cero == 0){
              arValues.push(answers.current[j].value);
            }
          }else{
            arValues.push(answers.current[j].value);
          }
        }
      }
      let average = arValues.length > 0 ? 
        arValues.reduce((accumulator, currentValue) => {
          return accumulator + currentValue
        },0) / arValues.length
        :
        0;
      average = Number(average) % 1 == 0 ? Number(average) : Number(average).toFixed(1)
      
      arForList.push({
        category: categories[i],
        average: average
      })
    }

    console.log(arForList)

    setListEndModalSituacional(arForList);

    setSerieRadarChart([{
      name: "Valor",
      data: arForList.map(ele =>  Number(ele.average))
    }]);

    setModalEndData({
      title: 'ANÁLISIS SITUACIONAL',
      content: SituationalResponse(),
      buttonText: 'Aceptar',
    });

    setOpenModalEnd(true);
  }

  const saveResult = () => {
    setOpen(true);
    let canSaving = true;

    for (let i = 0; i < questions.length; i++){
      if (answers.current[i].value == 0 && questions[i].permite_cero == 0){
        canSaving = false;
      }

      if (answers.current[i].value != 0 && questions[i].permite_cero == 0){
        if (answers.current[i].value < currentTest.rango_inicial || answers.current[i].value > currentTest.rango_final){
          canSaving = false;
        }
      }
    }
    

    if (canSaving){
      switch (currentTest.cod_test) {
        case 'COVI_AnalisisSituac':
          resultForSituacional();
        break;
      }
    }else{
      showToast("Debes completar todos los datos con valores válidos");
    }

    setOpen(false);
    
  };

  const imagePaths = async (html, stringImages, path) => {
    const images = stringImages ? stringImages.split(',') : null;
    let content = html;
    if (Array.isArray(images)) {
      for (let i = 0; i < images.length; i++) {
        let finalPath = '';
        if (images[i].indexOf('commons/') != -1) {
          finalPath = await getPathCourseResource(
            images[i].replace('commons', 'commons.asar')
          );
        } else {
          finalPath = await getPathCourseResource(
            path + '/img.asar/' + images[i]
          );
        }
        content = content.replace(images[i], finalPath);
      }
    }
    return content;
  };

  const loadTestData = async () => {
    const test = await sqlite3All(
      `SELECT * FROM tests WHERE cod_test = '${data.test_id}' LIMIT 1`
    );
    console.log(test);
    if (test.OK) {
      const testData = test.OK[0];
      setTest(testData);
      if (testData.encabezado && testData.encabezado != '') {
        let htmlContent = testData.encabezado;
        const path = courseCode;
        if (testData.img_encabezado && testData.img_encabezado != '') {
          htmlContent = await imagePaths(
            htmlContent,
            testData.img_encabezado,
            path
          );
        }
        setModalInitData({
          title: '',
          content: htmlContent,
          buttonText:
            testData.texto_boton && testData.texto_boton != ''
              ? testData.texto_boton
              : 'Aceptar',
        });
      } else {
        setModalInitData({
          title: '',
          content: '',
          buttonText: '',
        });
      }
    } else {
      setModalInitData({
        title: '',
        content: '',
        buttonText: '',
      });
    }

    const questions = await sqlite3All(
      `SELECT tests_preguntas_inputn.permite_cero, tests_preguntas_inputn.pregunta, tests_preguntas_inputn.cod_categoria, tests_categorias_preguntas.nombre FROM tests_preguntas_inputn 
      LEFT JOIN tests_categorias_preguntas ON tests_categorias_preguntas.cod_categoria = tests_preguntas_inputn.cod_categoria
      WHERE tests_preguntas_inputn.cod_test = '${data.test_id}' ORDER BY tests_categorias_preguntas.orden, tests_preguntas_inputn.orden ASC`
    );
    console.log(questions);
    if (questions.OK) {
      const categoryArray = [
        ...new Set(
          questions.OK.map((ele, index) => {
            return ele.nombre;
          })
        ),
      ];
      setCategories(categoryArray);
      console.log(categoryArray);
      setQuestions(questions.OK);
      answers.current = new Array(questions.OK.length).fill({
        category: '',
        value: 0
      });
    } else {
      setCategories([]);
      setQuestions([]);
      answers.current = [];
    }
  };

  useEffect(() => {
    if (data) {
      loadTestData();
    }
  }, [data]);

  return (
    <Grid container columns={{ xs: 4, md: 12 }} spacing={2}>
      <OverlayLoader open={open} />
      {currentTest ? (
        <>
          <Grid item xs={12}>
            {data ? (
              <TestTitle
                title={data.nombre}
                component={'div'}
                color={'white'}
              />
            ) : null}
          </Grid>
          <Grid item xs={12}>
            <div className="tests-container">
              {categories && categories.length > 0 ? (
                <>
                  {categories.map((ele1, index) => (
                    <Box className="container-area">
                      <TestTitle
                        title={ele1}
                        component={'nav'}
                        color={'white'}
                        barColor={'secondary'}
                      />

                      <Box component="main" sx={{ p: 3 }}>
                        {questions.map((ele, index2) => (
                          <>
                            {ele.nombre == ele1 ? (
                              <div className="question-container" key={index2}>
                                <div className="question input-number-cuestion">
                                  {parse(ele.pregunta)}
                                </div>
                                <div className="input-number-container"  key={index2}>
                                  <NumericInput
                                    key={index2}
                                    strict={false}
                                    //value={ele.permite_cero == 1 ? 0 : currentTest.rango_inicial}
                                    name={ele1 + "-input-"+index2}
                                    min={ele.permite_cero == 1 ? 0 : currentTest.rango_inicial}
                                    max={currentTest.rango_final}
                                    step={1}
                                    size={6}
                                    format={(num)=>{
                                      if (num < currentTest.rango_inicial) {
                                        return ele.permite_cero == 1 ? 0 : currentTest.rango_inicial;
                                      }
                                      if (num > currentTest.rango_final){
                                        return currentTest.rango_final;
                                      }
                                      return num;
                                    }}
                                    onChange={handleAnswerChange}
                                    style={{
                                      wrap: {
                                        background: 'white',
                                        boxShadow:
                                          '0 0 1px 1px #fff inset, 1px 1px 5px -1px #000',
                                        padding: '2px 2.26ex 2px 2px',
                                        borderRadius: '6px 3px 3px 6px',
                                        fontSize: 18,
                                      },
                                      input: {
                                        borderRadius: '4px 2px 2px 4px',
                                        padding: '0.1ex 1ex',
                                        border: '1px solid #white',
                                        marginRight: 4,
                                        display: 'block',
                                        fontWeight: 100,
                                        textShadow:
                                          '1px 1px 1px rgba(0, 0, 0, 0.1)',
                                      },
                                      'input:focus': {
                                        border: '1px inset #white',
                                        outline: 'none',
                                      },
                                    }}
                                  />
                                </div>
                              </div>
                            ) : null}
                          </>
                        ))}
                      </Box>
                    </Box>
                  ))}
                </>
              ) : null}
            </div>
          </Grid>
          <Grid item xs={12} className="lessons-button-container-center">
            <ButtomCustom
              variant="contained"
              onClick={() => {
                saveResult();
              }}
              rounded
            >
              Continuar
            </ButtomCustom>
          </Grid>
        </>
      ) : null}

      <AlertModal
        open={openModalWelcome}
        title={''}
        content={parse(modalInitData.content)}
        buttonText={modalInitData.buttonText}
        onButtonClick={() => {
          setOpenModalWelcome(false);
        }}
      />
      <AlertModal
        open={openModalEnd}
        title={modalEndData.title}
        content={SituationalResponse()}
        buttonText={modalEndData.buttonText}
        onButtonClick={() => {
          setOpenModalEnd(false);
        }}
      />

      <AlertModal
        open={isOpenRadarModal}
        title={''}
        content={<RadarChart title={"Mapa situacional"} series={serieRadarChart} categories={categories}/>}
        buttonText={'Cerrar'}
        onButtonClick={() => {
          setIsOpenRadarModal(false);
        }}
        maxWidth={"lg"}
      />
      <ToastContainer />
    </Grid>
  );
};

export default InputNumberTest;
